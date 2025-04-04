import store from '@/redux/store'
import { API_URL } from '@/constants'

interface SessionData {
	scheduled_at: string
	notes: string
}

/**
 * Create a new session for an employee
 *
 * @param userId - Employee ID to create session for
 * @param data - Session data containing scheduled_at time and optional notes
 * @param role - User role making the request (HR, manager, admin)
 * @returns Promise with the created session data
 */
export const createSession = async (
	userId: string,
	data: SessionData,
	role: string
) => {
	try {
		// Get auth token from Redux store
		const { auth } = store.getState()
		const token = auth.user?.accessToken

		if (!token) {
			throw new Error('Authentication token not found')
		}

		const response = await fetch(`${API_URL}/${role}/session/${userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error(`Error creating session: ${response.statusText}`)
		}

		return await response.json()
	} catch (error) {
		console.error('Failed to create session:', error)
		throw error
	}
}
