import store from '@/redux/store'
import { API_URL } from '@/constants'
import { CompanyData } from '@/types/employee'
import { EmployeeAPI } from '@/types/UserProfile'
import { SessionType } from '@/types/sessions'
import { ChainType } from '@/types/chains'

// Define the API response type based on the backend structure
export interface ProfileApiResponse {
	employee_id: string
	name: string
	email: string
	role: string
	manager_id: string | null
	is_blocked: boolean
	mood_stats: {
		average_score: number
		total_sessions: number
		emotion_distribution: {
			[key: string]: number
		}
		last_5_scores: Array<{
			score: number
			emotion: string
			date: string
		}>
	}
	chat_summary: {
		chat_id: string
		last_message: string | null
		last_message_time: string | null
		unread_count: number
		total_messages: number
		chat_mode: string
		is_escalated: boolean
	}
	upcoming_meets: number
	upcoming_sessions: number
	company_data: CompanyData
}

// Fetch profile data from the API
export async function getProfileData(): Promise<EmployeeAPI> {
	try {
		// Use API_URL from constants
		console.log('API URL:', API_URL) // Debug log

		// Get auth token from Redux store
		const authState = store.getState().auth
		console.log(
			'Auth state:',
			JSON.stringify({
				isAuthenticated: authState.isAuthenticated,
				hasToken: !!authState.user?.accessToken,
			})
		) // Debug log - avoiding logging the actual token for security

		const token = authState.user?.accessToken

		if (!token) {
			throw new Error('Authentication token not found. Please log in.')
		}

		console.log('Making API request to /employee/profile') // Debug log

		const response = await fetch(`${API_URL}/employee/profile`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})

		console.log('API Response status:', response.status) // Debug log

		if (response.status === 401) {
			throw new Error(
				'Authentication failed. Your session may have expired. Please log in again.'
			)
		}

		if (!response.ok) {
			throw new Error(`Error fetching profile: ${response.statusText}`)
		}

		const data: EmployeeAPI = await response.json()
		console.log('Profile data received successfully') // Debug log
		return data
	} catch (error) {
		console.error('Failed to fetch profile data:', error)
		throw error
	}
}

export async function getUserProfileData(userId: string): Promise<EmployeeAPI> {
	try {
		// Use API_URL from constants
		console.log('API URL:', API_URL) // Debug log

		// Get auth token from Redux store
		const authState = store.getState().auth
		console.log(
			'Auth state:',
			JSON.stringify({
				isAuthenticated: authState.isAuthenticated,
				hasToken: !!authState.user?.accessToken,
			})
		) // Debug log - avoiding logging the actual token for security

		const token = authState.user?.accessToken

		if (!token) {
			throw new Error('Authentication token not found. Please log in.')
		}

		console.log('Making API request to /admin/user-det') // Debug log

		const response = await fetch(
			`${API_URL}/admin/user-det/${userId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
		)

		console.log('API Response status:', response.status) // Debug log

		if (response.status === 401) {
			throw new Error(
				'Authentication failed. Your session may have expired. Please log in again.'
			)
		}

		if (!response.ok) {
			throw new Error(`Error fetching profile: ${response.statusText}`)
		}

		const data: EmployeeAPI = await response.json()
		console.log('Profile data received successfully') // Debug log
		return data
	} catch (error) {
		console.error('Failed to fetch profile data:', error)
		throw error
	}
}

// Function to transform API data into the format expected by UserMetaCard
export function getUserMetaData(profileData: EmployeeAPI) {
	return {
		name: profileData.name,
		bio: profileData.role,
		email: profileData.email,
		location: {
			city: '',
			country: '',
		},
		socialLinks: {
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
		},
		profileImage: '/images/user/owner.jpg', // Default image
	}
}

// Function to transform API data into the format expected by UserInfoCard
export function getUserInfoData(profileData: EmployeeAPI) {
	const names = profileData.name.split(' ')
	return {
		firstName: names[0] || '',
		lastName: names.slice(1).join(' ') || '',
		email: profileData.email,
		phone: '',
		bio: profileData.role,
		socialLinks: {
			facebook: '',
			twitter: '',
			linkedin: '',
			instagram: '',
		},
	}
}

// Function to transform API data into the format expected by UserVibeMeterCard
export function getVibeMeterData(profileData: EmployeeAPI) {
	console.log(
		'Transforming VibeMeter data:',
		profileData.company_data.vibemeter
	)
	return profileData.company_data.vibemeter
}

// Function to transform API data into the format expected by UserActivityCard
export function getActivityData(profileData: EmployeeAPI) {
	console.log('Transforming Activity data:', profileData.company_data.activity)
	return profileData.company_data.activity
}

// Function to transform API data into the format expected by UserLeaveCard
export function getLeaveData(profileData: EmployeeAPI) {
	console.log('Transforming Leave data:', profileData.company_data.leave)
	return {
		usedLeave: 0,
		totalLeave: 0,
		requests: [],
	}
}

// Function to transform API data into the format expected by UserPerformanceCard
export function getPerformanceData(profileData: EmployeeAPI) {
	console.log(
		'Transforming Performance data:',
		profileData.company_data.performance
	)
	return profileData.company_data.performance
}

// Function to transform API data into the format expected by UserRewardsCard
export function getRewardsData(profileData: EmployeeAPI) {
	console.log('Transforming Rewards data:', profileData.company_data.rewards)
	return profileData.company_data.rewards
}

// Function to transform API data into the format expected by UserOnboardingCard
export function getOnboardingData(profileData: EmployeeAPI) {
	console.log(
		'Transforming Onboarding data:',
		profileData.company_data.onboarding
	)
	return profileData.company_data.onboarding.length > 0
		? profileData.company_data.onboarding[0]
		: null
}

export const getSessionsData = async (
	employeeId: string
): Promise<SessionType[]> => {
	const { auth } = store.getState()

	try {
		// Fetch from consistent admin endpoints
		const [activeAndPendingResponse, completedResponse] =
			await Promise.all([
				fetch(`${API_URL}/admin/sessions`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
				}),
				fetch(`${API_URL}/admin/sessions/completed`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
				}),
			])

		// Check if any of the responses failed
		if (!activeAndPendingResponse.ok || !completedResponse.ok) {
			throw new Error('Failed to fetch sessions data')
		}

		// Parse all responses
		const [activeAndPendingData, completedData] = await Promise.all([
			activeAndPendingResponse.json(),
			completedResponse.json(),
		])

		// Combine all sessions and filter by employee_id
		const allSessions = [...activeAndPendingData, ...completedData]
		return allSessions.filter(
			(session: SessionType) => session.employee_id === employeeId
		)
	} catch (error) {
		console.error('Error fetching sessions:', error)
		throw error
	}
}

// Function to fetch employee chains
export const getEmployeeChains = async (
	employeeId: string
): Promise<ChainType[]> => {
	const { auth } = store.getState()
	try {
		const response = await fetch(
			`${API_URL}/admin/chains/employee/${employeeId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
			}
		)

		if (!response.ok) {
			throw new Error(`Error fetching chains: ${response.statusText}`)
		}

		const data: ChainType[] = await response.json()
		return data.map(chain => ({
			...chain,
			isExpanded: false, // Initialize all chains as collapsed
		}))
	} catch (error) {
		console.error('Failed to fetch employee chains:', error)
		throw error
	}
}
