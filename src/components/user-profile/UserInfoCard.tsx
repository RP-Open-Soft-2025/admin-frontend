'use client'
import React from 'react'
import { EmployeeAPI } from '@/types/UserProfile'
import { Badge } from '@/components/ui/badge'
import {
	Calendar,
	Clock,
	UserCircle,
	Shield,
	Info,
	CreditCard,
} from 'lucide-react'

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
		<div className="p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 dark:border-gray-700 lg:p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div className="w-full">
					<div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
							<UserCircle className="h-5 w-5 text-gray-700 dark:text-gray-300" />
							Employee Information
						</h4>
					</div>

					<div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
						<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
							<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
								<CreditCard className="h-3.5 w-3.5 text-2xl" />
								Employee ID
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{userData.employee_id}
							</p>
						</div>

						<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
							<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
								<Shield className="h-3.5 w-3.5" />
								Role
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{userData.role}
							</p>
						</div>

						{userData.manager_id && (
							<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
								<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
									<UserCircle className="h-3.5 w-3.5" />
									Manager ID
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{userData.manager_id}
								</p>
							</div>
						)}

						<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
							<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
								<Shield className="h-3.5 w-3.5" />
								Account Status
							</p>
							<Badge
								variant={
									userData.is_blocked
										? 'danger'
										: userData.account_activated
											? 'success'
											: 'warning'
								}
							>
								{userData.is_blocked
									? 'Blocked'
									: userData.account_activated
										? 'Active'
										: 'Pending'}
							</Badge>
						</div>

						{userData.blocked_at && (
							<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
								<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
									<Calendar className="h-3.5 w-3.5" />
									Blocked At
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{formatDate(userData.blocked_at)}
								</p>
							</div>
						)}

						{userData.blocked_by && (
							<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
								<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
									<UserCircle className="h-3.5 w-3.5" />
									Blocked By
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{userData.blocked_by}
								</p>
							</div>
						)}

						{userData.blocked_reason && (
							<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
								<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
									<Info className="h-3.5 w-3.5" />
									Block Reason
								</p>
								<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
									{userData.blocked_reason}
								</p>
							</div>
						)}

						<div className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors duration-200">
							<p className="mb-2 text-lg leading-normal text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5" />
								Last Active
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
								{formatDate(userData.last_ping)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
