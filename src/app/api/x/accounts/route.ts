import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/x-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.accounts || session.accounts.length === 0) {
    return NextResponse.json([]);
  }

  // Return only safe data to the client
  const safeAccounts = session.accounts.map(acc => ({
    username: acc.username,
    name: acc.name
  }));

  return NextResponse.json(safeAccounts);
}
