'use client'
import React from 'react'
import { Leave, LeaveType } from '@/types/UserProfile'

// Props interface
interface UserLeaveCardProps {
	leaveData?: Leave[] | null
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

// Helper function to calculate total leave days
const calculateTotalLeaveDays = (leaves: Leave[]) => {
	return leaves.reduce((total, leave) => total + leave.Leave_Days, 0)
}

// Helper function to get leave type color
const getLeaveTypeColor = (type: LeaveType) => {
	switch (type) {
		case LeaveType.ANNUAL:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case LeaveType.CASUAL:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case LeaveType.SICK:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case LeaveType.UNPAID:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}

export default function UserLeaveCard({ leaveData }: UserLeaveCardProps) {
	if (!leaveData || leaveData.length === 0) return null

	const totalLeaveDays = calculateTotalLeaveDays(leaveData)

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
						Leave History
					</h4>

					{/* Leave Summary */}
					<div className="mb-6">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Total Leave Days
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{totalLeaveDays} days
							</p>
						</div>
					</div>

					{/* Leave Records */}
					<div>
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Leave Records
						</h5>
						<div className="overflow-x-auto">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Type
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Days
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Duration
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{leaveData.map((leave, index) => (
										<tr key={index}>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeaveTypeColor(
														leave.Leave_Type
													)}`}
												>
													{leave.Leave_Type}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
												{leave.Leave_Days} days
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
												{formatDate(leave.Leave_Start_Date)} -{' '}
												{formatDate(leave.Leave_End_Date)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
