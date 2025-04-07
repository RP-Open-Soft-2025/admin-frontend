import React from 'react'
import { HRUser } from '@/services/adminService'

interface HRManagementProps {
	hrUsers: HRUser[] | 'UNAVAILABLE'
	onReassignHR?: (hrId: string, userId: string) => void
	isLoading?: boolean
}

const HRManagement = ({
	hrUsers,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onReassignHR,
	isLoading = false,
}: HRManagementProps) => {
	if (isLoading) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						HR Management
					</h3>
				</div>
				<div className="flex h-64 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
				</div>
			</div>
		)
	}

	if (hrUsers === 'UNAVAILABLE') {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						HR Management
					</h3>
				</div>
				<div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
					UNAVAILABLE
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					HR Management
				</h3>
			</div>

			<div className="h-[400px] overflow-auto">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
						<thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
							<tr>
								<th
									scope="col"
									className="w-1/3 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									ID
								</th>
								<th
									scope="col"
									className="w-1/3 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Name
								</th>
								<th
									scope="col"
									className="w-1/3 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Assigned Users
								</th>
								{/* <th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Workload
								</th> */}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
							{hrUsers.length === 0 ? (
								<tr>
									<td
										colSpan={4}
										className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
									>
										No HR users found
									</td>
								</tr>
							) : (
								[...hrUsers]
									.sort((a, b) => a.name.localeCompare(b.name)) // Sorting alphabetically by name
									.map(hr => (
										<tr
											key={hr.hrId}
											className="hover:bg-gray-50 dark:hover:bg-gray-800"
										>
											<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-center text-gray-900 dark:text-white">
												{hr.hrId}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
												{hr.name}
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
												{hr.currentAssignedUsersCount}
											</td>
											{/* <td className="whitespace-nowrap px-6 py-4 text-sm">
											<div className="flex items-center">
												<div className="relative h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700">
													<div
														className={`absolute h-2 rounded-full ${
															hr.currentAssignedUsers > 90
																? 'bg-red-500'
																: hr.currentAssignedUsers > 70
																	? 'bg-yellow-500'
																	: 'bg-green-500'
														}`}
														style={{
															width: `${Math.min(100, (hr.currentAssignedUsers / 100) * 100)}%`,
														}}
													/>
												</div>
												<span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
													{hr.currentAssignedUsers}%
												</span>
											</div>
										</td> */}
										</tr>
									))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default HRManagement