'use client'
import React from 'react'
import Image from 'next/image'
import { EmployeeAPI } from '@/types/UserProfile'

// Props interface
interface UserMetaCardProps {
	userData?: EmployeeAPI
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserMetaCard({ userData }: UserMetaCardProps) {
	if (!userData) return null

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-col items-center w-full gap-6 xl:flex-row">
					<div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
						<Image
							width={80}
							height={80}
							src="/images/user/owner.jpg"
							alt={userData.name}
							className="object-cover"
						/>
					</div>
					<div className="order-3 xl:order-2">
						<h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
							{userData.name}
						</h4>
						<div className="flex flex-col items-center gap-2 text-center xl:flex-row xl:gap-4 xl:text-left">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{userData.email}
							</p>
							<span
								className={`px-2 py-1 text-xs font-medium rounded-full ${
									userData.is_blocked
										? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
										: userData.account_activated
											? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
											: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
								}`}
							>
								{userData.is_blocked
									? 'Blocked'
									: userData.account_activated
										? 'Active'
										: 'Pending'}
							</span>
						</div>
						<div className="mt-2 flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Role: <span className="font-medium">{userData.role}</span>
							</p>
							{userData.manager_id && (
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Manager ID:{' '}
									<span className="font-medium">{userData.manager_id}</span>
								</p>
							)}
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Last Active:{' '}
								<span className="font-medium">
									{formatDate(userData.last_ping)}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
