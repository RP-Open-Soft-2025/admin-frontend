'use client'
import React from 'react'
import { EmployeeAPI } from '@/types/UserProfile'

// Props interface
interface UserInfoCardProps {
	userData?: EmployeeAPI
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserInfoCard({ userData }: UserInfoCardProps) {
	if (!userData) return null

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div className="w-full">
					<div className="flex items-center justify-between mb-4 lg:mb-6">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Employee Information
						</h4>
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Employee ID
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userData.employee_id}
							</p>
						</div>

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Role
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{userData.role}
							</p>
						</div>

						{userData.manager_id && (
							<div>
								<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
									Manager ID
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90">
									{userData.manager_id}
								</p>
							</div>
						)}

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Account Status
							</p>
							<p
								className={`text-sm font-medium ${
									userData.is_blocked
										? 'text-red-600 dark:text-red-400'
										: userData.account_activated
											? 'text-green-600 dark:text-green-400'
											: 'text-yellow-600 dark:text-yellow-400'
								}`}
							>
								{userData.is_blocked
									? 'Blocked'
									: userData.account_activated
										? 'Active'
										: 'Pending'}
							</p>
						</div>

						{userData.blocked_at && (
							<div>
								<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
									Blocked At
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90">
									{formatDate(userData.blocked_at)}
								</p>
							</div>
						)}

						{userData.blocked_by && (
							<div>
								<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
									Blocked By
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90">
									{userData.blocked_by}
								</p>
							</div>
						)}

						{userData.blocked_reason && (
							<div>
								<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
									Block Reason
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90">
									{userData.blocked_reason}
								</p>
							</div>
						)}

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Last Active
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{formatDate(userData.last_ping)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
