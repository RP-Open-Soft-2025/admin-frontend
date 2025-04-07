import axios from 'axios'
import { API_URL } from '@/constants'

const api = axios.create({
	baseURL: API_URL,
})

// Only run interceptors on client side
if (typeof window !== 'undefined') {
	// Request interceptor to add auth token to all requests
	api.interceptors.request.use(
		config => {
			// Get token from localStorage instead of store to avoid SSR issues
			const userData = localStorage.getItem('user')
			if (userData) {
				const { accessToken } = JSON.parse(userData)
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`
				}
			}

			return config
		},
		error => Promise.reject(error)
	)

	// Response interceptor to handle 403 errors
	api.interceptors.response.use(
		response => response,
		async error => {
			// Handle 403 Forbidden responses
			if (error.response && error.response.status === 403) {
				console.log('Received 403 forbidden response - logging out')

				// Clear localStorage directly
				localStorage.removeItem('user')

				// Redirect to login page
				window.location.href = '/login'
			}

			return Promise.reject(error)
		}
	)
}

export default api
