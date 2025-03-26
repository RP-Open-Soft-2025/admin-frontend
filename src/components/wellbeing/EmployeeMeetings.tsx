'use client'
import React from 'react'
import { meetingsData } from '@/data/wellbeingData'
import {
	CalendarIcon,
	UserGroupIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline'

const EmployeeMeetings: React.FC = () => {
	// Helper function to format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	}

	// Helper function to format time
	const formatTime = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	// Helper function to get priority badge
	const getPriorityBadge = (priority: string) => {
		switch (priority) {
			case 'Critical':
				return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
			case 'High':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
			case 'Medium':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
			default:
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
		}
	}

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
						Employee Meetings
					</h3>
					<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
						Scheduled wellbeing check-ins and support sessions
					</p>
				</div>
				<button className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30">
					Schedule Meeting
				</button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{meetingsData.map(meeting => (
					<div
						key={meeting.id}
						className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/30"
					>
						<div className="flex items-center justify-between">
							<h4 className="text-base font-semibold text-gray-900 dark:text-white">
								{meeting.title}
							</h4>
							<span
								className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityBadge(meeting.priority)}`}
							>
								{meeting.priority}
							</span>
						</div>

						<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
							{meeting.purpose}
						</p>

						<div className="mt-4 space-y-3">
							<div className="flex items-start gap-2.5">
								<CalendarIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
								<div>
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										{formatDate(meeting.dateTime)} at{' '}
										{formatTime(meeting.dateTime)}
									</p>
								</div>
							</div>

							<div className="flex items-start gap-2.5">
								<UserGroupIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
								<div>
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Host: {meeting.host}
									</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{meeting.attendees.length === 1
											? meeting.attendees[0]
											: meeting.attendees.length > 3
												? `${meeting.attendees.slice(0, 2).join(', ')} +${meeting.attendees.length - 2} more`
												: meeting.attendees.join(', ')}
									</p>
								</div>
							</div>
						</div>

						<div className="mt-4 flex justify-end space-x-3">
							<button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
								Reschedule
							</button>
							<button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
								<CheckCircleIcon className="mr-1 h-4 w-4" />
								Confirm
							</button>
						</div>
					</div>
				))}
			</div>

			<div className="mt-6 flex justify-center">
				<button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800/60">
					View All Meetings
				</button>
			</div>
		</div>
	)
}

export default EmployeeMeetings
