import { SessionOptions } from "iron-session";

export interface XAccount {
  username: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface SessionData {
  accounts: XAccount[];
  codeVerifier?: string;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
  cookieName: "x_auth_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
