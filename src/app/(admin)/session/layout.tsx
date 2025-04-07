import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Session | DeloConnect',
  description: 'Manage and monitor sessions in DeloConnect',
  keywords: ['sessions', 'management', 'DeloConnect', 'admin'],
}

export default function SessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 