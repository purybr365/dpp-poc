import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      organization: string | null;
    };
  }

  interface User {
    role: string;
    organization: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    organization: string | null;
  }
}
