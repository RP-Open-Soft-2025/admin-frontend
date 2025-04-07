import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Form Layout | DeloConnect',
  description: 'Create and manage forms in DeloConnect',
  keywords: ['forms', 'layout', 'management', 'DeloConnect', 'admin'],
}

export default function FormLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 