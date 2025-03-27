import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'

import Badge from '../ui/badge/Badge'
import { User } from 'lucide-react'
import Link from 'next/link'
import { Employee, Role } from '@/types/employee'

export default function BasicTableOne({
	tableData,
}: {
	tableData: Employee[]
}) {
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="max-w-full overflow-x-auto">
				<div className="min-w-[1102px]">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
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
									Status
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Blocked
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{tableData.map(order => (
								<TableRow key={order.userId}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 overflow-hidden rounded-full">
												<User />
											</div>
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{order.name}
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
											color={order.isBlocked === true ? 'error' : 'success'}
										>
											{order.isBlocked ? 'Blocked' : 'Active'}
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
