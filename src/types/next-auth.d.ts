import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      is_admin?: boolean;
    };
    accessToken: string;
    refreshToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    is_admin?: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    is_admin?: boolean;
    accessToken: string;
    refreshToken: string;
  }
}
