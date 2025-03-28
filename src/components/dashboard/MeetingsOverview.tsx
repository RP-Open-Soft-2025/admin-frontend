import React from 'react'
import { Meet } from '@/services/adminService'

interface MeetingsOverviewProps {
	meetings: Meet[] | 'UNAVAILABLE'
	isLoading?: boolean
}

const MeetingsOverview = ({
	meetings,
	isLoading = false,
}: MeetingsOverviewProps) => {
	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return new Intl.DateTimeFormat('en-US', {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			}).format(date)
		} catch (error) {
			console.log(error)
			return 'Invalid date'
		}
	}

	const getStatusColor = (status: string) => {
		status = status.toLowerCase()
		switch (status) {
			case 'scheduled':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
			case 'completed':
				return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
			case 'cancelled':
				return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
			case 'in_progress':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
		}
	}

	const formatStatus = (status: string) => {
		return status
			.replace('_', ' ')
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ')
	}

	if (isLoading) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Upcoming Meetings
					</h3>
				</div>
				<div className="flex h-64 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
				</div>
			</div>
		)
	}

	if (meetings === 'UNAVAILABLE') {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Upcoming Meetings
					</h3>
				</div>
				<div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
					UNAVAILABLE
				</div>
			</div>
		)
	}

	// Filter to show only scheduled and in progress meetings
	const upcomingMeetings = meetings.filter(
		meeting =>
			meeting.status.toUpperCase() === 'SCHEDULED' ||
			meeting.status.toUpperCase() === 'IN_PROGRESS'
	)

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Upcoming Meetings
				</h3>
			</div>

			{upcomingMeetings.length === 0 ? (
				<div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
					No upcoming meetings
				</div>
			) : (
				<div className="h-[400px] overflow-y-auto pr-2">
					<div className="space-y-4">
						{upcomingMeetings.map(meeting => (
							<div
								key={meeting.meet_id}
								className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="mb-2 flex items-center justify-between">
									<h4 className="text-base font-medium text-gray-900 dark:text-white">
										Meeting {meeting.meet_id.substring(0, 10)}
									</h4>
									<span
										className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(
											meeting.status
										)}`}
									>
										{formatStatus(meeting.status)}
									</span>
								</div>
								<div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
									{meeting.notes || 'No description provided'}
								</div>
								<div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
									<svg
										className="mr-1.5 h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									{formatDate(meeting.scheduled_at)}
								</div>
								<div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
									<svg
										className="mr-1.5 h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 9v2m0 4h-2m-4-6h.01M9 9h.01M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z"
										/>
									</svg>
									{meeting.location || 'Virtual Meeting'}
								</div>
								<div className="mt-2 flex justify-between">
									<div>
										<span className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
											Duration
										</span>
										<span className="text-sm text-gray-700 dark:text-gray-300">
											{meeting.duration} minutes
										</span>
									</div>
									{meeting.meeting_link && (
										<a
											href={meeting.meeting_link}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
										>
											Join Meeting
											<svg
												className="ml-1 h-3 w-3"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
										</a>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default MeetingsOverview
