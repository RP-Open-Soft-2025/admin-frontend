import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Employee Management | DeloConnect',
  description: 'Manage and view all employees in the DeloConnect system',
  keywords: ['employees', 'management', 'staff', 'DeloConnect', 'admin'],
}

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 