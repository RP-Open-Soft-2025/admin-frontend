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
	fetchHRList,
	createUser,
	reassignHR,
	User,
	HRUser,
} from '@/services/adminService'
import SessionStatusChart from '@/components/dashboard/SessionStatusChart'
import UserRoleChart from '@/components/dashboard/UserRoleChart'
import { API_URL } from '@/constants'

type DashboardStats = {
	employee_stats: {
		total_employees: number
		active_employees: number
		total_admins: number
		total_hrs: number
	}
	session_stats: {
		total_sessions: number
		completed_sessions: number
		active_sessions: number
		pending_sessions: number
	}
	meeting_stats: {
		total_meetings: number
	}
}

function AdminDashboard() {
	const router = useRouter()
	const auth = useSelector((state: RootState) => state.auth)
	const [dashBoard, setDashboard] = useState<DashboardStats>(
		{} as DashboardStats
	)
	const [load, isLoad] = useState<boolean>(true)
	const isHR = auth.user?.userRole === 'hr'
	const isAdmin = auth.user?.userRole === 'admin'

	// State for all data
	const [users, setUsers] = useState<User[] | 'UNAVAILABLE'>([])
	const [hrUsers, setHRUsers] = useState<HRUser[] | 'UNAVAILABLE'>([])

	// UI state
	const [showCreateUserModal, setShowCreateUserModal] = useState(false)

	// Loading states
	const [loading, setLoading] = useState({
		users: true,
		hr: true,
		sessions: true,
		meetings: true,
	})

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
		// Only admin needs HR data
		if (isAdmin) {
			await getHRData()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAdmin, isHR, getHRData])

	// First useEffect
	useEffect(() => {
		if (!auth.isAuthenticated) {
			console.log('User is not authenticated, redirecting to login')
			router.push('/login')
			return
		}

		fetchAllData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Handlers for actions
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

	useEffect(() => {
		fetch(`${API_URL}/admin/stats`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.user?.accessToken}`,
				'Content-type': 'Application/json',
			},
		}).then(resp => {
			if (resp.ok) {
				resp.json().then((dataJson: DashboardStats) => {
					setDashboard(dataJson)
					isLoad(false)
				})
			} else {
				toast({
					type: 'error',
					description: 'Error getting dashboard stats',
				})
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (load) {
		return (
			<div className="flex justify-center items-center h-full">
				<div className="animate-spin rounded-full h-10 w-10 border-t-3 border-indigo-500"></div>
			</div>
		)
	}
	return (
		<div className="space-y-6">
			{/* Stats Overview */}
			<StatsOverview
				totalUsers={dashBoard.employee_stats.total_employees}
				activeUsers={
					dashBoard.employee_stats.total_employees -
					dashBoard.employee_stats.active_employees
				}
				totalSessions={dashBoard.session_stats.total_sessions}
				activeSessions={dashBoard.session_stats.active_sessions}
				pendingSessions={dashBoard.session_stats.pending_sessions}
				totalMeets={dashBoard.meeting_stats.total_meetings}
				isLoading={load}
			/>

			{/* Sessions Chart & User Distribution */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{dashBoard.session_stats && (
					<SessionStatusChart
						activeSessions={dashBoard.session_stats.active_sessions}
						pendingSessions={dashBoard.session_stats.pending_sessions}
						completedSessions={dashBoard.session_stats.completed_sessions}
						isLoading={load}
					/>
				)}

				{!isHR && users !== 'UNAVAILABLE' && (
					<UserRoleChart users={dashBoard.employee_stats} isLoading={load} />
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
