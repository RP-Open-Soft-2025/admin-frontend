import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | DeloConnect',
  description: 'Manage your DeloConnect profile and account settings',
  keywords: ['profile', 'settings', 'account', 'DeloConnect', 'admin'],
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 