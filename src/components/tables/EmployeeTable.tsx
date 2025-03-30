import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

import Badge from '../ui/badge/Badge'
import { User } from 'lucide-react'
import { Employee, Role } from '@/types/employee'
import { DEL_TIME } from '@/constants'
import { useRouter } from 'next/navigation'

export default function BasicTableOne({
	tableData,
}: {
	tableData: Employee[]
}) {
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
									Employee Id
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Employee Name
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Employee Email
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Role
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Online
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{tableData.map(order => {
								const lastPingTime: number = new Date(order.lastPing).getTime()
								const diff = Date.now() - lastPingTime
								return (
									<TableRow
										key={order.userId}
										onClick={() => router.push(`/profile/${order.userId}`)}
										className="cursor-pointer"
									>
										<TableCell className="px-5 py-4 sm:px-6 text-start">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 overflow-hidden rounded-full">
													<User className="dark:text-white" />
												</div>
												<div>
													<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
														{order.userId}
													</span>
													<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
														{order.email}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											{order.name}
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											{order.email}
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={
													order.role === Role.HR
														? 'primary'
														: order.role === Role.ADMIN
															? 'info'
															: 'warning'
												}
											>
												{order.role ? order.role.toUpperCase() : 'EMPLOYEE'}
											</Badge>
										</TableCell>
										<TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
											<Badge
												size="sm"
												color={diff > DEL_TIME ? 'error' : 'success'}
											>
												{diff > DEL_TIME ? 'OFFLINE' : 'ONLINE'}
											</Badge>
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	)
}
