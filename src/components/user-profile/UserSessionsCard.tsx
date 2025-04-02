'use client'
import React, { useEffect, useState } from 'react'
import { SessionType, SessionStatus } from '@/types/sessions'
import { getSessionsData } from '@/services/profileService'
import { useRouter } from 'next/navigation'

// Props interface
interface UserSessionsCardProps {
	employeeId: string
	role: string
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

// Helper function to get session status color
const getSessionStatusColor = (status: SessionStatus) => {
	switch (status) {
		case SessionStatus.ACTIVE:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case SessionStatus.COMPLETED:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case SessionStatus.CANCELLED:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case SessionStatus.PENDING:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}

export default function UserSessionsCard({
	employeeId,
	role,
}: UserSessionsCardProps) {
	const [sessionsData, setSessionsData] = useState<SessionType[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hoveredRow, setHoveredRow] = useState<string | null>(null)
	const router = useRouter()

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const data = await getSessionsData(employeeId)
				setSessionsData(data)
			} catch (err) {
				setError('Failed to load sessions data')
				console.error('Error fetching sessions:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchSessions()
	}, [employeeId])

	if (loading) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex items-center justify-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="text-red-500 text-center">{error}</div>
			</div>
		)
	}

	if (!sessionsData || sessionsData.length === 0) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="text-gray-500 text-center">No sessions found</div>
			</div>
		)
	}

	const activeSessions = sessionsData.filter(
		session => session.status === SessionStatus.ACTIVE
	)
	const completedSessions = sessionsData.filter(
		session => session.status === SessionStatus.COMPLETED
	)
	const pendingSessions = sessionsData.filter(
		session => session.status === SessionStatus.PENDING
	)

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
						Session History
					</h4>

					{/* Session Summary */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div
							onClick={() => router.push(`/${role}/sessions/active`)}
							className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
						>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Active Sessions
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{activeSessions.length}
							</p>
						</div>
						<div
							onClick={() => router.push(`/${role}/sessions/completed`)}
							className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
						>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Completed Sessions
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{completedSessions.length}
							</p>
						</div>
						<div
							onClick={() => router.push(`/${role}/sessions/pending`)}
							className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
						>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Pending Sessions
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{pendingSessions.length}
							</p>
						</div>
					</div>

					{/* Sessions Table */}
					<div>
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Session Records
						</h5>
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Status
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Scheduled At
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Chat ID
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{sessionsData.map(session => (
										<tr
											key={session.session_id}
											onClick={() =>
												router.push(`/chat-page/${session.chat_id}`)
											}
											onMouseEnter={() => setHoveredRow(session.session_id)}
											onMouseLeave={() => setHoveredRow(null)}
											className={`cursor-pointer transition-all duration-200 ${
												hoveredRow === session.session_id
													? 'bg-gray-50 dark:bg-gray-800 shadow-sm'
													: 'hover:bg-gray-50 dark:hover:bg-gray-800'
											}`}
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm">
												<span
													className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${getSessionStatusColor(
														session.status as SessionStatus
													)}`}
												>
													{session.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
												{formatDate(session.scheduled_at)}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
												{session.chat_id}
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
