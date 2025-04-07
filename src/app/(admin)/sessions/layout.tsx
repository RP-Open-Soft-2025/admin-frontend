import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Session Management | DeloConnect',
  description: 'View and manage all sessions in the DeloConnect system',
  keywords: ['sessions', 'meetings', 'management', 'DeloConnect', 'admin'],
}

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 