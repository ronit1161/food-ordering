import { withAuth } from "next-auth/middleware";

export default withAuth({
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    authorized: ({ token }) => !!token?.email,
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/cart", "/profile", "/orders", "/orders/:path*", "/users", "/users/:path*"],
};
