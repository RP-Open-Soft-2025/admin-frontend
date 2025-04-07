import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat | DeloConnect',
  description: 'Communicate with team members through DeloConnect chat',
  keywords: ['chat', 'messaging', 'communication', 'DeloConnect', 'admin'],
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 