import store from '@/redux/store'
import { API_URL } from '@/constants'

// Types for API responses
export interface User {
	id: string
	name: string
	email: string
	role: string
	department?: string
	manager_id?: string
	is_blocked: boolean
	created_at: string
	lastPing: string
}

export interface HRUser {
	hrId: string
	name: string
	currentAssignedUsers: number
}

export interface Session {
	id?: string
	session_id: string
	employee_id: string
	user_id?: string
	user_name?: string
	chat_id: string
	status: 'active' | 'pending' | 'completed'
	start_time?: string
	scheduled_at: string
	duration?: number
	session_type?: string
}

export interface Meet {
	meet_id: string
	user_id: string
	with_user_id: string
	duration: number
	status: string
	scheduled_at: string
	meeting_link: string
	location: string | null
	notes: string
}

export interface UserDetail extends User {
	department?: string
	position?: string
	joined_at?: string
	last_active?: string
	performance_metrics?: {
		attendance: number
		productivity: number
		communication: number
	}
	recent_sessions?: Session[]
}

// API functions for admin endpoints
export async function getAuthToken() {
	const authState = store.getState().auth
	const token = authState.user?.accessToken

	if (!token) {
		throw new Error('Authentication token not found. Please log in.')
	}

	return token
}

export async function fetchUsers(): Promise<User[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/list-users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching users: ${response.statusText}`)
		}

		const data = await response.json()
		return data.users || []
	} catch (error) {
		console.error('Failed to fetch users:', error)
		throw error
	}
}

export async function fetchHRList(): Promise<HRUser[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/list-hr`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching HR list: ${response.statusText}`)
		}

		const data = await response.json()
		return data.hrs || []
	} catch (error) {
		console.error('Failed to fetch HR list:', error)
		throw error
	}
}

export async function fetchUserDetails(userId: string): Promise<UserDetail> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/user-det/${userId}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching user details: ${response.statusText}`)
		}

		const data = await response.json()
		return data.user || {}
	} catch (error) {
		console.error('Failed to fetch user details:', error)
		throw error
	}
}

export async function fetchSessions(): Promise<{
	active: Session[]
	pending: Session[]
	total: number
}> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/sessions`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching sessions: ${response.statusText}`)
		}

		const sessions: Session[] = await response.json()

		// Filter sessions by status
		const activeSessions = sessions.filter(
			session => session.status === 'active'
		)
		const pendingSessions = sessions.filter(
			session => session.status === 'pending'
		)

		return {
			active: activeSessions || [],
			pending: pendingSessions || [],
			total: sessions.length,
		}
	} catch (error) {
		console.error('Failed to fetch sessions:', error)
		throw error
	}
}

export async function fetchActiveSessions(): Promise<Session[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/sessions/active`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching active sessions: ${response.statusText}`)
		}

		const sessions: Session[] = await response.json()
		return sessions || []
	} catch (error) {
		console.error('Failed to fetch active sessions:', error)
		throw error
	}
}

export async function fetchPendingSessions(): Promise<Session[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/sessions/pending`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching pending sessions: ${response.statusText}`)
		}

		const sessions: Session[] = await response.json()
		return sessions || []
	} catch (error) {
		console.error('Failed to fetch pending sessions:', error)
		throw error
	}
}

export async function fetchCompletedSessions(): Promise<Session[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/sessions/completed`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(
				`Error fetching completed sessions: ${response.statusText}`
			)
		}

		const sessions: Session[] = await response.json()
		return sessions || []
	} catch (error) {
		console.error('Failed to fetch completed sessions:', error)
		throw error
	}
}

export async function fetchMeets(): Promise<Meet[]> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/meets`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error fetching meets: ${response.statusText}`)
		}

		const meets = await response.json()
		return meets || []
	} catch (error) {
		console.error('Failed to fetch meets:', error)
		throw error
	}
}

export async function createUser(userData: {
	name: string
	email: string
	role: string
	department?: string
}): Promise<User> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/create-user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(userData),
		})

		if (!response.ok) {
			throw new Error(`Error creating user: ${response.statusText}`)
		}

		const data = await response.json()
		return data.user
	} catch (error) {
		console.error('Failed to create user:', error)
		throw error
	}
}

export async function deleteUser(
	userId: string
): Promise<{ success: boolean }> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/delete-user`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ user_id: userId }),
		})

		if (!response.ok) {
			throw new Error(`Error deleting user: ${response.statusText}`)
		}

		await response.json()
		return { success: true }
	} catch (error) {
		console.error('Failed to delete user:', error)
		throw error
	}
}

export async function createSession(userId: string): Promise<Session> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/session/${userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error(`Error creating session: ${response.statusText}`)
		}

		const data = await response.json()
		return {
			session_id: data.session_id,
			employee_id: userId,
			chat_id: data.chat_id || '',
			status: 'pending',
			scheduled_at: new Date().toISOString(),
			...data,
		}
	} catch (error) {
		console.error('Failed to create session:', error)
		throw error
	}
}

export async function reassignHR(
	userId: string,
	newHrId: string
): Promise<{ success: boolean }> {
	try {
		const token = await getAuthToken()

		const response = await fetch(`${API_URL}/admin/reassign-hr/${userId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ hr_id: newHrId }),
		})

		if (!response.ok) {
			throw new Error(`Error reassigning HR: ${response.statusText}`)
		}

		await response.json()
		return { success: true }
	} catch (error) {
		console.error('Failed to reassign HR:', error)
		throw error
	}
}

export async function blockUser(
	employeeId: string,
	reason: string
): Promise<{ success: boolean; message: string }> {
	try {
		const token = await getAuthToken()
		const role = store.getState().auth.user?.userRole

		const response = await fetch(`${API_URL}/admin-hr/block-user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				employee_id: employeeId,
				reason: reason,
			}),
		})

		if (!response.ok) {
			throw new Error(`Error blocking user: ${response.statusText}`)
		}

		const data = await response.json()
		return { 
			success: true, 
			message: typeof data === 'string' ? data : 'User blocked successfully' 
		}
	} catch (error) {
		console.error('Failed to block user:', error)
		throw error
	}
}

export async function unblockUser(
	employeeId: string,
	reason: string
): Promise<{ success: boolean; message: string }> {
	try {
		const token = await getAuthToken()
		const role = store.getState().auth.user?.userRole

		const response = await fetch(`${API_URL}/admin-hr/unblock-user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				employee_id: employeeId,
				reason: reason,
			}),
		})

		if (!response.ok) {
			throw new Error(`Error unblocking user: ${response.statusText}`)
		}

		const data = await response.json()
		return { 
			success: true, 
			message: typeof data === 'string' ? data : 'User unblocked successfully' 
		}
	} catch (error) {
		console.error('Failed to unblock user:', error)
		throw error
	}
}
