import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { Video } from 'lucide-react'
import { SessionType } from '@/types/sessions'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type BadgeColor =
	| 'primary'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'light'
	| 'dark'

export function BasicTableOne({ tableData }: { tableData: SessionType[] }) {
	const statusMapping: Record<SessionType['status'], BadgeColor> = {
		pending: 'info',
		active: 'primary',
		completed: 'success',
		cancelled: 'warning',
	}
	const router = useRouter()
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="max-w-full overflow-x-auto">
				<div className="min-w-[1102px]">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow onClick={() => {}}>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Session Details
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Employee ID
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Session Start Time
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Status
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{tableData.map(session => (
								<TableRow
									key={session.session_id}
									onClick={() => router.push(`/chat-page/${session.chat_id}`)}
									className="cursor-pointer"
								>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<Link href={`./chat-page/${session.chat_id}`}>
												<Video className="w-6 h-6 text-gray-500 dark:text-gray-400" />
											</Link>
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{session.session_id}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													{session.created_at
														? new Date(session.created_at).toLocaleDateString()
														: new Date(
																session.scheduled_at
															).toLocaleDateString()}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{session.employee_id}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{new Date(session.scheduled_at).toLocaleString()}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										<Badge color={statusMapping[session.status]}>
											{session.status.replace('_', ' ').toUpperCase()}
										</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
