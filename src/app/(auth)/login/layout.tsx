import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | DeloConnect',
  description: 'Sign in to your DeloConnect account to access the administrative dashboard',
  keywords: ['login', 'sign in', 'authentication', 'DeloConnect', 'admin'],
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 