import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar | DeloConnect',
  description: 'View and manage your schedule in DeloConnect',
  keywords: ['calendar', 'schedule', 'events', 'DeloConnect', 'admin'],
}

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 