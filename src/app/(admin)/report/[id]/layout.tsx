import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Report | DeloConnect',
  description: 'View and generate reports in DeloConnect',
  keywords: ['reports', 'analytics', 'statistics', 'DeloConnect', 'admin'],
}

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 