import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentication | DeloConnect',
  description: 'Sign in to your DeloConnect account to access the administrative dashboard',
  keywords: ['login', 'sign in', 'authentication', 'DeloConnect', 'admin'],
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 