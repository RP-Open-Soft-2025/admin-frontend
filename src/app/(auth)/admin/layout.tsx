import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Authentication | DeloConnect',
  description: 'Admin authentication and access control for DeloConnect',
  keywords: ['admin', 'authentication', 'access', 'DeloConnect', 'security'],
}

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 