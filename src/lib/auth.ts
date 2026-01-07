import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    // MVP: Simple Email/Password mock or Credentials for development
    // In production, you'd use GoogleProvider or EmailProvider with SMTP
    CredentialsProvider({
      name: "Guest Login",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "user@example.com" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        // MVP Logic: Find or Create User by Email automatically (Magic Link style simulation)
        const user = await prisma.user.upsert({
          where: { email: credentials.email },
          update: {},
          create: {
            email: credentials.email,
            name: credentials.email.split('@')[0],
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // session.user.id = token.sub // Typescript might complain without extension, keeping simple for now
      }
      return session
    }
  }
}
