import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData, XAccount } from "@/lib/x-auth";
import { OAuth2, Client } from "@xdevplatform/xdk";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new Response(`Auth error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response("No code provided", { status: 400 });
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const codeVerifier = session.codeVerifier;

  if (!codeVerifier) {
    return new Response("No code verifier found in session", { status: 400 });
  }

  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI || "https://gre-content.vercel.app/auth/callback";

  if (!client_id || !client_secret) {
    return new Response("Missing CLIENT_ID or CLIENT_SECRET", { status: 500 });
  }

  try {
    const auth = new OAuth2({
      clientId: client_id,
      clientSecret: client_secret,
      redirectUri: redirect_uri,
      scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
    });

    const tokens = await auth.exchangeCode(code, codeVerifier);

    const client = new Client({
      accessToken: tokens.access_token
    });

    const userResponse = await client.users.getMe();
    const userData = userResponse.data;

    if (!userData) {
      throw new Error("Failed to get user data from X");
    }

    const newAccount: XAccount = {
      username: userData.username,
      name: userData.name,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in || 7200) * 1000,
    };

    if (!session.accounts) {
      session.accounts = [];
    }

    // Update existing or add new
    const existingIndex = session.accounts.findIndex(a => a.username === newAccount.username);
    if (existingIndex > -1) {
      session.accounts[existingIndex] = newAccount;
    } else {
      session.accounts.push(newAccount);
    }

    delete session.codeVerifier;
    await session.save();

    return Response.redirect(new URL("/", request.url));
  } catch (err: any) {
    console.error("Auth callback error:", err);
    return new Response(`Failed to exchange code: ${err.message}`, { status: 500 });
  }
}
