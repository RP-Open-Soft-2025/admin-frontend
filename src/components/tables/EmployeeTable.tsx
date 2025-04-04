import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { User } from 'lucide-react'
import { Employee, Role } from '@/types/employee'
import { DEL_TIME } from '@/constants'
import { useRouter } from 'next/navigation'

type SortDirection = 'asc' | 'desc'
type SortConfig = {
	key: keyof Employee
	direction: SortDirection
}

export default function EmployeeTable({
	tableData,
	onSort,
}: {
	tableData: Employee[]
	onSort: (sortConfig: SortConfig) => void
}) {
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'name',
		direction: 'asc',
	})

	const router = useRouter()

	const handleSort = (key: keyof Employee) => {
		let direction: SortDirection = 'asc'

		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc'
		}

		const newSortConfig = { key, direction }
		setSortConfig(newSortConfig)
		onSort(newSortConfig)
	}

	const getSortIndicator = (key: keyof Employee) => {
		if (sortConfig.key === key) {
			return sortConfig.direction === 'asc' ? ' ↑' : ' ↓'
		}
		return ''
	}

	const getRoleBadgeColor = (role?: Role) => {
		switch (role) {
			case Role.HR:
				return 'primary'
			case Role.ADMIN:
				return 'info'
			default:
				return 'warning'
		}
	}

	const isOnline = (dateCurr: string) => {
		const curr = new Date()
		curr.setHours(curr.getHours() - 5)
		curr.setMinutes(curr.getMinutes() - 30)
		const lastTime = new Date(dateCurr)
		const delTime = curr.getTime() - lastTime.getTime()
		return delTime <= DEL_TIME && delTime >= 0
	}

	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="w-full overflow-x-auto">
				<Table>
					<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
						<TableRow onClick={() => {}}>
							{[
								{ key: 'userId', label: 'ID' },
								{ key: 'name', label: 'Name' },
								{ key: 'email', label: 'Email' },
								{ key: 'role', label: 'Role' },
							].map(column => (
								<TableCell
									key={column.key}
									isHeader
									className="px-5 py-3 font-bold text-gray-700 text-start text-theme-xs dark:text-gray-300 cursor-pointer select-none hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									<div
										className="flex items-center"
										onClick={() => handleSort(column.key as keyof Employee)}
									>
										{column.label.toUpperCase()}
										{getSortIndicator(column.key as keyof Employee)}
									</div>
								</TableCell>
							))}
							<TableCell
								isHeader
								className="px-5 py-3 font-bold text-gray-700 text-start text-theme-xs dark:text-gray-300"
							>
								STATUS
							</TableCell>
						</TableRow>
					</TableHeader>
					<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
						{tableData.length > 0 ? (
							tableData.map(employee => (
								<TableRow
									key={employee.userId}
									onClick={() => router.push(`/profile/${employee.userId}`)}
									className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
								>
									<TableCell className="px-5 py-4 text-start">
										<div className="flex items-center gap-3">
											<div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-white/[0.05] rounded-full">
												<User className="w-5 h-5 text-gray-500 dark:text-white" />
											</div>
											<span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
												{employee.userId}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300">
										{employee.name}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{employee.email}
									</TableCell>
									<TableCell className="px-4 py-3 text-start">
										<Badge size="sm" color={getRoleBadgeColor(employee.role)}>
											{employee.role?.toUpperCase() ?? 'EMPLOYEE'}
										</Badge>
									</TableCell>
									<TableCell className="px-4 py-3">
										<Badge
											size="sm"
											color={isOnline(employee.lastPing) ? 'success' : 'error'}
										>
											{isOnline(employee.lastPing) ? 'ONLINE' : 'OFFLINE'}
										</Badge>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow onClick={() => {}}>
								<TableCell className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
									No employees found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
