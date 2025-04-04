'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { toast } from '@/components/ui/sonner'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import {
	StatsOverview,
	HRManagement,
	CreateUserForm,
} from '@/components/dashboard'
import {
	fetchUsers,
	fetchHRList,
	fetchSessions,
	fetchActiveSessions,
	fetchPendingSessions,
	fetchCompletedSessions,
	fetchMeets,
	createUser,
	deleteUser,
	createSession,
	reassignHR,
	User,
	HRUser,
	Session,
	Meet,
} from '@/services/adminService'
import SessionStatusChart from '@/components/dashboard/SessionStatusChart'
import UserRoleChart from '@/components/dashboard/UserRoleChart'

function AdminDashboard() {
	const router = useRouter()
	const auth = useSelector((state: RootState) => state.auth)
	const isHR = auth.user?.userRole === 'hr'
	const isAdmin = auth.user?.userRole === 'admin'

	// State for all data
	const [users, setUsers] = useState<User[] | 'UNAVAILABLE'>([])
	const [hrUsers, setHRUsers] = useState<HRUser[] | 'UNAVAILABLE'>([])
	const [activeSessions, setActiveSessions] = useState<
		Session[] | 'UNAVAILABLE'
	>([])
	const [pendingSessions, setPendingSessions] = useState<
		Session[] | 'UNAVAILABLE'
	>([])
	const [completedSessions, setCompletedSessions] = useState<
		Session[] | 'UNAVAILABLE'
	>([])
	const [meetings, setMeetings] = useState<Meet[] | 'UNAVAILABLE'>([])

	// UI state
	const [showCreateUserModal, setShowCreateUserModal] = useState(false)

	// Loading states
	const [loading, setLoading] = useState({
		users: true,
		hr: true,
		sessions: true,
		meetings: true,
	})

	// Session chart data
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [sessionChartData, setSessionChartData] = useState({
		active: [] as number[],
		pending: [] as number[],
		completed: [] as number[],
		labels: [] as string[],
	})

	// Calculate stats
	const totalUsers = Array.isArray(users) ? users.length : 'UNAVAILABLE'
	const activeUsers = Array.isArray(users)
		? users.filter(user => !user.is_blocked).length
		: 'UNAVAILABLE'

	const totalSessions =
		Array.isArray(activeSessions) &&
		Array.isArray(pendingSessions) &&
		Array.isArray(completedSessions)
			? activeSessions.length +
				pendingSessions.length +
				completedSessions.length
			: 'UNAVAILABLE'

	const activeSessionsCount = Array.isArray(activeSessions)
		? activeSessions.length
		: 'UNAVAILABLE'

	const pendingSessionsCount = Array.isArray(pendingSessions)
		? pendingSessions.length
		: 'UNAVAILABLE'

	const totalMeets = Array.isArray(meetings) ? meetings.length : 'UNAVAILABLE'

	// Process session data for chart based on actual session counts
	const processSessionData = useCallback(() => {
		if (
			activeSessionsCount === 'UNAVAILABLE' ||
			pendingSessionsCount === 'UNAVAILABLE'
		) {
			return
		}

		// Generate dates for a week (we'll simply use the next 7 days)
		const startDate = new Date()
		startDate.setHours(0, 0, 0, 0)

		// Generate 7 consecutive days
		const chartDates = Array.from({ length: 7 }, (_, i) => {
			const date = new Date(startDate)
			date.setDate(date.getDate() + i)
			return date
		})

		// Generate labels for the chart
		const labels = chartDates.map(date =>
			date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
		)

		// For the chart data, use actual counts from the API
		// Create an array where all days have the actual session count
		// First day shows actual count, other days zero to emphasize current state
		const activeSessionsArray = [
			typeof activeSessionsCount === 'number' ? activeSessionsCount : 0,
			0,
			0,
			0,
			0,
			0,
			0,
		]

		const pendingSessionsArray = [
			typeof pendingSessionsCount === 'number' ? pendingSessionsCount : 0,
			0,
			0,
			0,
			0,
			0,
			0,
		]

		// Since we don't have a completedSessionsCount prop in the StatsOverview,
		// we'll calculate it from the total if available
		let completedCount = 0
		if (
			typeof totalSessions === 'number' &&
			typeof activeSessionsCount === 'number' &&
			typeof pendingSessionsCount === 'number'
		) {
			completedCount =
				totalSessions - activeSessionsCount - pendingSessionsCount
		}

		const completedSessionsArray = [completedCount, 0, 0, 0, 0, 0, 0]

		// Update chart data
		setSessionChartData({
			labels: labels,
			active: activeSessionsArray,
			pending: pendingSessionsArray,
			completed: completedSessionsArray,
		})

		console.log('Updated chart data with actual session counts:', {
			labels,
			activeSessionsArray,
			pendingSessionsArray,
			completedSessionsArray,
		})
	}, [activeSessionsCount, pendingSessionsCount, totalSessions])

	// Wrap getUsersData in useCallback
	const getUsersData = useCallback(async () => {
		try {
			setLoading(prev => ({ ...prev, users: true }))

			// Fetch users
			const userData = await fetchUsers()
			setUsers(userData)
		} catch (error) {
			console.error('Failed to fetch users:', error)
			setUsers('UNAVAILABLE')
			toast({
				type: 'error',
				description: 'Failed to load users. Please try again later.',
			})
		} finally {
			setLoading(prev => ({ ...prev, users: false }))
		}
	}, [])

	// Wrap getSessionsData in useCallback
	const getSessionsData = useCallback(async () => {
		try {
			setLoading(prev => ({ ...prev, sessions: true }))

			// Fetch sessions - Try fetching combined first, fallback to individual endpoints
			try {
				// First try fetching all sessions using the combined endpoint
				const sessionData = await fetchSessions()
				setActiveSessions(sessionData.active)
				setPendingSessions(sessionData.pending)

				// Still need to fetch completed sessions separately
				const completed = await fetchCompletedSessions()
				setCompletedSessions(completed)
			} catch (error) {
				console.error(
					'Failed to fetch combined sessions, trying individual endpoints:',
					error
				)

				// Fallback to individual endpoints
				const [active, pending, completed] = await Promise.all([
					fetchActiveSessions(),
					fetchPendingSessions(),
					fetchCompletedSessions(),
				])

				setActiveSessions(active)
				setPendingSessions(pending)
				setCompletedSessions(completed)
			}

			// Process chart data based on actual session dates
			processSessionData()
		} catch (error) {
			console.error('Failed to fetch sessions:', error)
			setActiveSessions('UNAVAILABLE')
			setPendingSessions('UNAVAILABLE')
			setCompletedSessions('UNAVAILABLE')
			toast({
				type: 'error',
				description: 'Failed to load sessions. Please try again later.',
			})
		} finally {
			setLoading(prev => ({ ...prev, sessions: false }))
		}
	}, [processSessionData])

	// Wrap getMeetingsData in useCallback
	const getMeetingsData = useCallback(async () => {
		try {
			setLoading(prev => ({ ...prev, meetings: true }))

			// Fetch meetings
			const meetData = await fetchMeets()
			setMeetings(meetData)
		} catch (error) {
			console.error('Failed to fetch meetings:', error)
			setMeetings('UNAVAILABLE')
			toast({
				type: 'error',
				description: 'Failed to load meetings. Please try again later.',
			})
		} finally {
			setLoading(prev => ({ ...prev, meetings: false }))
		}
	}, [])

	// Wrap getHRData in useCallback
	const getHRData = useCallback(async () => {
		try {
			setLoading(prev => ({ ...prev, hr: true }))

			// Fetch HR users
			const hrData = await fetchHRList()
			setHRUsers(hrData)
		} catch (error) {
			console.error('Failed to fetch HR Employee:', error)
			setHRUsers('UNAVAILABLE')
			toast({
				type: 'error',
				description: 'Failed to load HR Employee. Please try again later.',
			})
		} finally {
			setLoading(prev => ({ ...prev, hr: false }))
		}
	}, [])

	// Functions to get data - wrap in useCallback
	const fetchAllData = useCallback(async () => {
		// Only fetch data the user should have access to
		if (isAdmin || isHR) {
			await getUsersData()
		}

		await getSessionsData()
		await getMeetingsData()

		// Only admin needs HR data
		if (isAdmin) {
			await getHRData()
		}
	}, [isAdmin, isHR, getUsersData, getSessionsData, getMeetingsData, getHRData])

	// First useEffect
	useEffect(() => {
		if (!auth.isAuthenticated) {
			console.log('User is not authenticated, redirecting to login')
			router.push('/login')
			return
		}

		fetchAllData()
	}, [])

	// Handlers for actions
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleOpenCreateUserModal = () => {
		setShowCreateUserModal(true)
	}

	const handleCreateUser = async (userData: {
		name: string
		email: string
		role: string
		department?: string
	}) => {
		try {
			const newUser = await createUser(userData)
			setUsers(prev => (Array.isArray(prev) ? [...prev, newUser] : [newUser]))
			setShowCreateUserModal(false)
			toast({
				type: 'success',
				description: `User ${userData.name} created successfully.`,
			})
		} catch (error) {
			console.error('Failed to create user:', error)
			toast({
				type: 'error',
				description: 'Failed to create user. Please try again.',
			})
			throw error
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUser(userId)
			setUsers(prev =>
				Array.isArray(prev)
					? prev.filter(user => user.id !== userId)
					: 'UNAVAILABLE'
			)
			toast({
				type: 'success',
				description: 'User deleted successfully.',
			})
		} catch (error) {
			console.error('Failed to delete user:', error)
			toast({
				type: 'error',
				description: 'Failed to delete user. Please try again.',
			})
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleCreateSession = async (userId: string) => {
		try {
			const newSession = await createSession(userId)
			setPendingSessions(prev =>
				Array.isArray(prev) ? [...prev, newSession] : [newSession]
			)
			toast({
				type: 'success',
				description: 'Session created successfully.',
			})
		} catch (error) {
			console.error('Failed to create session:', error)
			toast({
				type: 'error',
				description: 'Failed to create session. Please try again.',
			})
		}
	}

	const handleReassignHR = async (userId: string, hrId: string) => {
		try {
			await reassignHR(userId, hrId)
			toast({
				type: 'success',
				description: 'HR reassigned successfully.',
			})
		} catch (error) {
			console.error('Failed to reassign HR:', error)
			toast({
				type: 'error',
				description: 'Failed to reassign HR. Please try again.',
			})
		}
	}

	// Second useEffect - fix processSessionData dependency
	useEffect(() => {
		processSessionData()
	}, [])

	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<StatsOverview
				totalUsers={totalUsers}
				activeUsers={activeUsers}
				totalSessions={totalSessions}
				activeSessions={activeSessionsCount}
				pendingSessions={pendingSessionsCount}
				totalMeets={totalMeets}
				isLoading={loading.sessions}
			/>

			{/* Sessions Chart & User Distribution */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{totalSessions !== 'UNAVAILABLE' && (
					<SessionStatusChart
						activeSessions={activeSessionsCount}
						pendingSessions={pendingSessionsCount}
						completedSessions={
							totalSessions -
							(activeSessionsCount === 'UNAVAILABLE'
								? 0
								: activeSessionsCount) -
							(pendingSessionsCount === 'UNAVAILABLE'
								? 0
								: pendingSessionsCount)
						}
						isLoading={loading.sessions}
					/>
				)}

				{!isHR && users !== 'UNAVAILABLE' && (
					<UserRoleChart users={users} isLoading={loading.users} />
				)}
			</div>

			{/* HR Management - Admin Only */}
			{isAdmin && (
				<HRManagement
					hrUsers={hrUsers}
					onReassignHR={handleReassignHR}
					isLoading={loading.hr}
				/>
			)}

			{/* Create User Modal */}
			{showCreateUserModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
								Create New User
							</h3>
							<button
								type="button"
								className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
								onClick={() => setShowCreateUserModal(false)}
							>
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
						<CreateUserForm onCreateUser={handleCreateUser} />
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminDashboard
