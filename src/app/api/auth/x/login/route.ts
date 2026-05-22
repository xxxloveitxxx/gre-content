import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/x-auth";
import { OAuth2, generateCodeVerifier, generateCodeChallenge } from "@xdevplatform/xdk";

export async function GET() {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI || "https://gre-content.vercel.app/auth/callback";

  if (!client_id || !client_secret) {
    return new Response("Missing CLIENT_ID or CLIENT_SECRET", { status: 500 });
  }

  const auth = new OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: redirect_uri,
    scope: ["tweet.read", "tweet.write", "users.read", "offline.access"],
  });

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  await auth.setPkceParameters(codeVerifier, codeChallenge);

  const authUrl = await auth.getAuthorizationUrl();

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.codeVerifier = codeVerifier;
  await session.save();

  return Response.redirect(authUrl);
}
