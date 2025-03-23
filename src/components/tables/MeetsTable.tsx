import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import Badge from '../ui/badge/Badge'
import { Video } from 'lucide-react'

export interface Order {
	meet_id: number
	scheduled_at: string
	duration_minutes: string
	meeting_link: string
	location: string
	notes: string
	status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
}

export interface all_order {
	employee_id: number
	start_time: string
	end_time: string
	location: string
}
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
	tableData: Order[] | all_order[]
}) {
	const statusMapping: Record<Order['status'], BadgeColor> = {
		scheduled: 'primary',
		in_progress: 'warning',
		completed: 'primary',
		cancelled: 'warning',
		no_show: 'error',
	}

	// Type guard function to check if an item is of type Order
	const isOrder = (item: Order | all_order): item is Order => {
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
								<TableRow key={order.meet_id}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 overflow-hidden rounded-full">
												<Video />
											</div>
											<div>
												<span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
													{order.meet_id}
												</span>
												<span className="block text-gray-500 text-theme-xs dark:text-gray-400">
													{order.meeting_link}
												</span>
											</div>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{new Date(order.scheduled_at).toLocaleString()}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{order.location}
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

export function BasicTableOneAll({ tableData }: { tableData: all_order[] }) {
	return (
		<div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
			<div className="max-w-full overflow-x-auto">
				<div className="min-w-[800px]">
					<Table>
						{/* Table Header */}
						<TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
							<TableRow>
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
									Start Time
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									End Time
								</TableCell>
								<TableCell
									isHeader
									className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
								>
									Location
								</TableCell>
							</TableRow>
						</TableHeader>

						{/* Table Body */}
						<TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
							{tableData.map(order => (
								<TableRow key={order.employee_id}>
									<TableCell className="px-5 py-4 sm:px-6 text-start">
										{order.employee_id}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{new Date(order.start_time).toLocaleString()}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{new Date(order.end_time).toLocaleString()}
									</TableCell>
									<TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
										{order.location}
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
