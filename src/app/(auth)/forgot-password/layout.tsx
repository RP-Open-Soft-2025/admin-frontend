import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password | DeloConnect',
  description: 'Reset your DeloConnect account password',
  keywords: ['password reset', 'forgot password', 'DeloConnect', 'authentication'],
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 