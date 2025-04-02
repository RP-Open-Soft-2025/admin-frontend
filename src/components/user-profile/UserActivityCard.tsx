'use client'
import React from 'react'
import { Activity } from '@/types/UserProfile'

// Props interface
interface UserActivityCardProps {
	activityData?: Activity[]
}

// Dummy data for development
const dummyActivityData: Activity[] = [
	{
		Date: '2023-01-15',
		Teams_Messages_Sent: 45,
		Emails_Sent: 23,
		Meetings_Attended: 5,
		Work_Hours: 8.5,
	},
	{
		Date: '2023-01-16',
		Teams_Messages_Sent: 32,
		Emails_Sent: 18,
		Meetings_Attended: 3,
		Work_Hours: 9,
	},
	{
		Date: '2023-01-17',
		Teams_Messages_Sent: 51,
		Emails_Sent: 27,
		Meetings_Attended: 4,
		Work_Hours: 8,
	},
	{
		Date: '2023-01-18',
		Teams_Messages_Sent: 38,
		Emails_Sent: 15,
		Meetings_Attended: 6,
		Work_Hours: 8.5,
	},
	{
		Date: '2023-01-19',
		Teams_Messages_Sent: 42,
		Emails_Sent: 22,
		Meetings_Attended: 2,
		Work_Hours: 7.5,
	},
]

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserActivityCard({
	activityData,
}: UserActivityCardProps) {
	// Use provided data or fall back to dummy data
	const displayData =
		activityData && activityData.length > 0 ? activityData : dummyActivityData

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Recent Activity
					</h4>

					<div className="overflow-x-auto">
						<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
							<thead className="bg-gray-50 dark:bg-gray-800">
								<tr>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
									>
										Date
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
									>
										Teams Messages
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
									>
										Emails Sent
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
									>
										Meetings Attended
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
									>
										Work Hours
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
								{displayData.map((activity, index) => (
									<tr key={index}>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
											{formatDate(activity.Date)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
											{activity.Teams_Messages_Sent}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
											{activity.Emails_Sent}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
											{activity.Meetings_Attended}
										</td>
										<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
											{activity.Work_Hours}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Activity Overview
						</h5>
						<div className="flex h-10 items-end space-x-2">
							{displayData.map((activity, index) => (
								<div
									key={index}
									className="relative flex flex-col items-center"
								>
									<div
										className="w-8 bg-blue-500 dark:bg-blue-600 rounded-t-sm"
										style={{ height: `${activity.Teams_Messages_Sent / 2}px` }}
									></div>
									<span className="mt-1 text-xs text-gray-500 dark:text-gray-400">
										{new Date(activity.Date).getDate()}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
