import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/x-auth";
import { NextRequest, NextResponse } from "next/server";
import { OAuth2 } from "@xdevplatform/xdk";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  const { text, username } = await request.json();

  if (!text || !username) {
    return NextResponse.json({ error: "Missing text or username" }, { status: 400 });
  }

  const account = session.accounts?.find(a => a.username === username);

  if (!account) {
    return NextResponse.json({ error: "Account not found in session" }, { status: 404 });
  }

  try {
    let currentAccessToken = account.accessToken;

    const postTweet = async (token: string) => {
      return fetch("https://api.x.com/2/tweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
    };

    let response = await postTweet(currentAccessToken);

    // Handle token expiration (401 Unauthorized)
    if (response.status === 401 && account.refreshToken) {
      console.log("Access token expired, attempting refresh...");
      try {
        const auth = new OAuth2({
          clientId: process.env.CLIENT_ID!,
          clientSecret: process.env.CLIENT_SECRET!,
          redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9002"}/auth/callback`,
        });

        // @ts-ignore - The library might have slightly different types than inferred
        const tokens = await auth.refreshToken(account.refreshToken);

        if (tokens.access_token) {
          // Update session with new tokens
          const index = session.accounts.findIndex((a) => a.username === username);
          if (index !== -1) {
            session.accounts[index].accessToken = tokens.access_token;
            if (tokens.refresh_token) {
              session.accounts[index].refreshToken = tokens.refresh_token;
            }
            await session.save();
            console.log("Tokens refreshed and session updated.");

            // Retry the post with new token
            response = await postTweet(tokens.access_token);
          }
        }
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        // Fall through to return the original 401
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Failed to post tweet" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error posting to X:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
