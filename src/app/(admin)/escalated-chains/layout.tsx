import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Escalated Chains | DeloConnect',
  description: 'Manage and monitor escalated chains in DeloConnect',
  keywords: ['escalated', 'chains', 'management', 'DeloConnect', 'admin'],
}

export default function EscalatedChainsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
