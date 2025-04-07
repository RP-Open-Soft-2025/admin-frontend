import { Metadata } from 'next'
import AdminLayoutClient from '@/components/layout/AdminLayoutClient'

export const metadata: Metadata = {
	title: 'Admin Dashboard | DeloConnect',
	description: 'Administrative dashboard for managing employees, sessions, and HR operations in DeloConnect',
	keywords: ['admin', 'dashboard', 'management', 'employees', 'sessions', 'HR', 'DeloConnect'],
}

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <AdminLayoutClient>{children}</AdminLayoutClient>
}
