import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        try {
          const data = {
            username: (credentials as any).username || "",
            password: (credentials as any).password || "",
          };
          if (data) {
            const res = await fetch(
              `${process.env.NEXTAUTH_URL}/api/routes/login`,
              {
                headers: {
                  "Content-Type": `application/json`,
                },
                method: "POST",
                body: JSON.stringify(data),
              }
            );
            const resData = await res.json();
            console.log("API response status:", res.status);
            console.log("API response data:", resData);
            const token = resData;
            if (res.ok) {
              if (resData.statusCode === 404) {
                throw new Error("User details not found");
              } else {
                return token;
              }
            } else {
              throw new Error(resData.message);
            }
          }
        } catch (error) {
          //@ts-ignore
          throw new Error("User details not found");
        }
      },
    }),
  ],
  callbacks: {
    // If there is a token, the user is authenticated
    async jwt({ token, user }: any) {
      if (user) {
        token.token = user;
      }
      return token;
    },

    async session({ session, token }: any) {
      session.user = token.token;
      return session;
    },
  },
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 2 * 24 * 60 * 60, // 2 days
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
