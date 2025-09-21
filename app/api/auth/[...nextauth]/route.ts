import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your backend authentication endpoint
          const response = await axios.post(`${process.env.API_BASE_URL || 'http://localhost:7470'}/company/login`, {
            email: credentials.email,
            password: credentials.password,
          })

          if (response.data.success && response.data.company) {
            const company = response.data.company
            const token = response.data.token

            return {
              id: company._id,
              email: company.email,
              name: company.name,
              uniqueName: company.uniqueName,
              token: token,
            }
          }
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token
        token.companyId = user.id
        token.uniqueName = user.uniqueName
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.id = token.companyId as string
      session.user.uniqueName = token.uniqueName as string
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key',
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }