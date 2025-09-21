import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login - Internify Pulse',
  description: 'Sign in to your company dashboard',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}