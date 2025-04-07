import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | DeloConnect',
  description: 'Set a new password for your DeloConnect account',
  keywords: ['password', 'reset', 'security', 'DeloConnect', 'authentication'],
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 