// types/next-auth.d.ts
import { User as AdapterUser } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    admin: boolean;
  }

  // Ensure the MongoDB adapter uses the extended User type
  interface AdapterUser {
    _id: string;
    admin: boolean;
  }
}
