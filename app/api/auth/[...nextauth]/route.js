import { getUserbyEmail, getUsers } from "@/lib/actions"
import { compare } from "bcryptjs"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  pages: {
      signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
          const email = credentials?.email;
          const password = credentials?.password;

          const user = await getUserbyEmail(email);
          
          const isValid = await compare(password, user.password);

          if (!isValid) return null;

            return{
                    id: user.id, 
                    email: user.email,
                    name: user.username,
                    image: user.image
            };
          }
    })
  ],
  callbacks: {
    // Using the `...rest` parameter to be able to narrow down the type based on `trigger`
    jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session?.name) {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.name = session.name
      }

      if (user) {
        token.image = user?.image;
      }

      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.email = token.image
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

