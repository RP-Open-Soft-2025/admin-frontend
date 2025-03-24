import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { Video } from 'lucide-react'
import { SessionType } from '@/types/sessions'

type BadgeColor =
	| 'primary'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'light'
	| 'dark'
export function BasicTableOne({
	tableData,
}: {
	tableData: SessionType[] | SessionType[]
}) {
	const statusMapping: Record<SessionType['status'], BadgeColor> = {
		pending: 'info',
		active: 'primary',
		completed: 'success',
		cancelled: 'warning',
	}

	// Type guard function to check if an item is of type Order
	const isOrder = (item: SessionType | SessionType): item is SessionType => {
		return 'meet_id' in item
	}

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
									Meeting Details
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Meeting Start Time
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Location
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
							{tableData.filter(isOrder).map(order => (
								<TableRow key={order.session_id}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 overflow-hidden rounded-full">
												<Video />
											</div>
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{order.session_id}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													{(new Date(order.created_at)).toLocaleDateString()}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{new Date(order.scheduled_at).toLocaleString()}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{order.status}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										<Badge color={statusMapping[order.status]}>
											{order.status.replace('_', ' ').toUpperCase()}
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

// export function BasicTableOneAll({ tableData }: { tableData: SessionType[] }) {
// 	return (
// 		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
// 			<div className="max-w-full overflow-x-auto">
// 				<div className="min-w-[800px]">
// 					<Table>
// 						{/* Table Header */}
// 						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
// 							<TableRow>
// 								<TableCell
// 									isHeader
// 									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
// 								>
// 									Employee ID
// 								</TableCell>
// 								<TableCell
// 									isHeader
// 									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
// 								>
// 									Start Time
// 								</TableCell>
// 								<TableCell
// 									isHeader
// 									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
// 								>
// 									End Time
// 								</TableCell>
// 								<TableCell
// 									isHeader
// 									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
// 								>
// 									Location
// 								</TableCell>
// 							</TableRow>
// 						</TableHeader>

// 						{/* Table Body */}
// 						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
// 							{tableData.map(order => (
// 								<TableRow key={order.employee_id}>
// 									<TableCell className="px-5 py-4 sm:px-6 text-start">
// 										{order.employee_id}
// 									</TableCell>
// 									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
// 										{new Date(order.start_time).toLocaleString()}
// 									</TableCell>
// 									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
// 										{new Date(order.end_time).toLocaleString()}
// 									</TableCell>
// 									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
// 										{order.location}
// 									</TableCell>
// 								</TableRow>
// 							))}
// 						</TableBody>
// 					</Table>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }
