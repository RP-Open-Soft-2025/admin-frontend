'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useState, useRef, useEffect } from 'react'
import { API_URL } from '@/constants'
import { Role } from '@/types/employee'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import Select from 'react-select'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

interface FormErrors {
	employee_id?: string
	name?: string
	email?: string
	password?: string
	role?: string
	manager_id?: string
	meeting_link?: string
}

interface LocalHR {
	currentAssignedUsers: number
	hrId: string
	name: string
}

interface HRResponse {
	hrs: LocalHR[]
}

interface MissingIDsResponse {
	missing_employee_ids: string[]
}

export default function FormLayout() {
	const router = useRouter()
	const [hrsGot, setHrs] = useState<LocalHR[]>([])
	const [filterHR, setFilterHR] = useState<LocalHR[]>([])
	const [currSel, SetCurrSel] = useState<string>('')
	const [formData, setFormData] = useState({
		employee_id: '',
		name: '',
		email: '',
		role: '',
		manager_id: '',
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [meetLink, setMeetLink] = useState<string>('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [missingEmployeeIds, setMissingEmployeeIds] = useState<string[]>([])
	const [missingHRIds, setMissingHRIds] = useState<string[]>([])
	const [suggestedIds, setSuggestedIds] = useState<string[]>([])
	const [showIdSuggestions, setShowIdSuggestions] = useState(false)
	const [currentSuggestionIndex, setCurrentSuggestionIndex] =
		useState<number>(-1)
	const [isAuthorized, setIsAuthorized] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	// Add ref to first input
	const employeeIdRef = useRef<HTMLInputElement>(null)

	// Check user authorization
	useEffect(() => {
		const { auth } = store.getState()
		if (!auth.user || auth.user.userRole !== 'admin') {
			// HR users don't have access - redirect to dashboard
			toast({
				type: 'error',
				description: 'You do not have permission to access this page',
			})
			router.push('/dashboard')
		} else {
			setIsAuthorized(true)
			setIsLoading(false)
		}
	}, [router])

	useEffect(() => {
		if (isAuthorized && !isLoading) {
			employeeIdRef.current?.focus()
		}
	}, [isAuthorized, isLoading])

	// Fetch missing employee IDs when component mounts
	useEffect(() => {
		if (!isAuthorized) return

		const fetchMissingIds = async () => {
			try {
				const { auth } = store.getState()
				// Fetch missing employee IDs
				const employeeResponse = await fetch(
					`${API_URL}/admin/missing/employee`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${auth.user?.accessToken}`,
						},
					}
				)

				if (employeeResponse.ok) {
					const employeeData: MissingIDsResponse = await employeeResponse.json()
					// Sort the employee IDs in increasing order
					setMissingEmployeeIds(
						employeeData.missing_employee_ids.sort((a, b) => a.localeCompare(b))
					)
				}

				// Fetch missing HR IDs
				const hrResponse = await fetch(`${API_URL}/admin/missing/hr`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
				})

				if (hrResponse.ok) {
					const hrData: MissingIDsResponse = await hrResponse.json()
					// Sort the HR IDs in increasing order
					setMissingHRIds(
						hrData.missing_employee_ids.sort((a, b) => a.localeCompare(b))
					)
				}
			} catch (error) {
				console.error('Error fetching missing IDs:', error)
			}
		}

		fetchMissingIds()
	}, [isAuthorized])

	// Update suggested IDs based on role selection
	useEffect(() => {
		if (formData.role === Role.EMPLOYEE) {
			// Show the first 5 employee IDs in sorted order (already sorted during fetch)
			setSuggestedIds(missingEmployeeIds.slice(0, 5))
		} else if (formData.role === Role.HR) {
			// Show the first 5 HR IDs in sorted order (already sorted during fetch)
			setSuggestedIds(missingHRIds.slice(0, 5))
		} else {
			setSuggestedIds([])
		}
	}, [formData.role, missingEmployeeIds, missingHRIds])

	// Filter suggestions based on user input
	const handleEmployeeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setFormData({ ...formData, employee_id: value })

		// Show suggestions if there's user input
		if (value.length > 0) {
			// Filter based on the role and current input
			const idsToFilter =
				formData.role === Role.HR ? missingHRIds : missingEmployeeIds
			const filtered = idsToFilter
				.filter(id => id.includes(value.toUpperCase()))
				.slice(0, 5)
			setSuggestedIds(filtered)
			setShowIdSuggestions(filtered.length > 0)
		} else {
			setShowIdSuggestions(false)
		}
	}

	// Get the next suggestion based on selected role
	const getRandomSuggestion = () => {
		const idsToChooseFrom =
			formData.role === Role.HR ? missingHRIds : missingEmployeeIds

		if (idsToChooseFrom.length > 0) {
			// Move to the next suggestion in the list
			let nextIndex = currentSuggestionIndex + 1

			// Wrap around to the beginning if we reach the end
			if (nextIndex >= idsToChooseFrom.length) {
				nextIndex = 0
			}

			setCurrentSuggestionIndex(nextIndex)
			setFormData({ ...formData, employee_id: idsToChooseFrom[nextIndex] })
			setShowIdSuggestions(false)
		}
	}

	// Reset suggestion index when role changes
	useEffect(() => {
		setCurrentSuggestionIndex(-1)
	}, [formData.role])

	// Select a suggested ID
	const selectSuggestedId = (id: string) => {
		setFormData({ ...formData, employee_id: id })
		setShowIdSuggestions(false)
	}

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {}

		// Trim all string inputs
		const trimmedData = {
			...formData,
			employee_id: formData.employee_id.trim(),
			name: formData.name.trim(),
			email: formData.email.trim(),
			manager_id: formData.manager_id.trim(),
		}

		// Employee ID validation - updated to require exactly 4 digits
		if (!trimmedData.employee_id.match(/^EMP\d{4}$/)) {
			newErrors.employee_id =
				'Employee ID must be in format EMP followed by 4 digits (e.g., EMP0001)'
		}

		// Name validation - improved with regex
		if (!trimmedData.name.match(/^[a-zA-Z\s]{2,}$/)) {
			newErrors.name =
				'Name must contain only letters and spaces, at least 2 characters'
		}

		// Email validation - more comprehensive regex
		if (
			!trimmedData.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
		) {
			newErrors.email = 'Please enter a valid email address'
		}

		// Role validation
		if (
			!formData.role ||
			!Object.values(Role).includes(formData.role as Role)
		) {
			newErrors.role = 'Please select a valid role'
		}

		// Manager ID validation
		if (formData.role === Role.EMPLOYEE) {
			if (!trimmedData.manager_id.match(/^EMP\d{4}$/)) {
				newErrors.manager_id =
					'Manager ID must be in format EMP followed by 4 digits (e.g., EMP0001)'
			}
		}

		// Meeting link validation for HR role
		if (formData.role === Role.HR) {
			if (!meetLink.trim()) {
				newErrors.meeting_link = 'Meeting link is required'
			}
		}

		setFormData(trimmedData) // Update with trimmed values
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		if (!validateForm()) {
			setIsSubmitting(false)
			return
		}

		try {
			const { auth } = store.getState()
			const requestData = {
				...formData,
				...(formData.role === Role.HR ? { meeting_link: meetLink } : {}),
			}

			const response = await fetch(`${API_URL}/admin/create-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
				body: JSON.stringify(requestData),
			})

			const data = await response.json()

			if (response.ok) {
				toast({
					type: 'success',
					description: 'Employee created successfully',
				})
				resetForm()
			} else {
				// Handle specific error status codes
				if (response.status === 401) {
					toast({
						type: 'error',
						description: 'Your session has expired. Please login again.',
					})
				} else if (response.status === 400) {
					// Handle validation errors from backend
					toast({
						type: 'error',
						description:
							typeof data === 'string'
								? data
								: data.detail || 'Invalid form data. Please check your inputs.',
					})
				} else {
					// Generic error handling
					toast({
						type: 'error',
						description:
							typeof data === 'string'
								? data
								: data.detail || 'Failed to create Employee',
					})
				}
			}
		} catch (error) {
			console.error('Error creating Employee:', error)
			toast({
				type: 'error',
				description: 'Failed to create Employee, contact system admins',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const resetForm = () => {
		setFormData({
			employee_id: '',
			name: '',
			email: '',
			role: '',
			manager_id: '',
		})
		setMeetLink('')
		setErrors({})
	}

	useEffect(() => {
		if (!isAuthorized) return

		const { auth } = store.getState()
		fetch(`${API_URL}/admin/list-hr`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.user?.accessToken}`,
			},
		}).then(resp => {
			if (resp.ok) {
				resp.json().then((res: HRResponse) => {
					setHrs(res.hrs)
					setFilterHR(res.hrs)
				})
			}
		})
	}, [isAuthorized])

	useEffect(() => {
		if (currSel) {
			setFilterHR(
				hrsGot.filter(
					(res: LocalHR) =>
						res.hrId && res.hrId.toLowerCase().includes(currSel.toLowerCase())
				)
			)
		} else {
			setFilterHR(hrsGot) // Optional: You can clear the filter when currSel is empty.
		}
	}, [currSel, hrsGot])

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
					<p className="text-gray-600 dark:text-gray-300">Loading...</p>
				</div>
			</div>
		)
	}

	if (!isAuthorized) {
		return null // This shouldn't render as we redirect unauthorized users
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<PageBreadcrumb pageTitle="Add New Employee" />
			<div className="max-w-2xl mx-auto py-8 px-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-lg p-6">
					<h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-6">
						Employee Registration Form
					</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Role Field - Moved up so ID suggestions can be role-specific */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Role*
								</label>
								<select
									value={formData.role}
									onChange={e =>
										setFormData({ ...formData, role: e.target.value })
									}
									className={`w-full p-3 bg-white dark:bg-gray-900 border ${
										errors.role
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90
									focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
								>
									<option value="">Select Role</option>
									<option value={Role.HR}>HR Manager</option>
									<option value={Role.EMPLOYEE}>Employee</option>
								</select>
								{errors.role && (
									<p className="mt-1 text-sm text-error-500">{errors.role}</p>
								)}
							</div>

							{/* Employee ID Field with suggestions */}
							<div className="relative">
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Employee ID*
								</label>
								<div className="flex">
									<input
										ref={employeeIdRef}
										type="text"
										placeholder="Enter employee ID (e.g., EMP0001)"
										value={formData.employee_id}
										onChange={handleEmployeeIdChange}
										onFocus={() =>
											formData.role &&
											setShowIdSuggestions(suggestedIds.length > 0)
										}
										onBlur={() =>
											setTimeout(() => setShowIdSuggestions(false), 200)
										}
										className={`w-full p-3 bg-white dark:bg-gray-900 border ${
											errors.employee_id
												? 'border-error-500'
												: 'border-gray-200 dark:border-gray-700'
										} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
										focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
									/>
									{formData.role && (
										<button
											type="button"
											onClick={getRandomSuggestion}
											className="ml-2 px-3 py-2 rounded-lg bg-brand-500/20 text-brand-600 dark:text-brand-400 hover:bg-brand-500/30 transition-colors"
											title="Suggest next available ID"
										>
											Suggest
										</button>
									)}
								</div>
								{errors.employee_id && (
									<p className="mt-1 text-sm text-error-500">
										{errors.employee_id}
									</p>
								)}
								{showIdSuggestions && suggestedIds.length > 0 && (
									<div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
										<ul className="py-1">
											{suggestedIds.map(id => (
												<li
													key={id}
													className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-white/90"
													onClick={() => selectSuggestedId(id)}
												>
													{id}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>

							{/* Name Field */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Full Name*
								</label>
								<input
									type="text"
									placeholder="Enter full name"
									value={formData.name}
									onChange={e =>
										setFormData({ ...formData, name: e.target.value })
									}
									className={`w-full p-3 bg-white dark:bg-gray-900 border ${
										errors.name
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
									focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
								/>
								{errors.name && (
									<p className="mt-1 text-sm text-error-500">{errors.name}</p>
								)}
							</div>

							{/* Email Field */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Email Address*
								</label>
								<input
									type="email"
									placeholder="Enter email address"
									value={formData.email}
									onChange={e =>
										setFormData({ ...formData, email: e.target.value })
									}
									className={`w-full p-3 bg-white dark:bg-gray-900 border ${
										errors.email
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
									focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
								/>
								{errors.email && (
									<p className="mt-1 text-sm text-error-500">{errors.email}</p>
								)}
							</div>

							{/* Manager ID Field - Only shown if role is Employee */}
							{formData.role === Role.EMPLOYEE && (
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Manager ID*
									</label>
									<Select
										isSearchable
										options={[...filterHR]
											.sort((a, b) => a.hrId.localeCompare(b.hrId))
											.map((hr: LocalHR) => ({
												value: hr.hrId,
												label: `${hr.hrId} - ${hr.name}`,
											}))}
										onChange={e => {
											setFormData({ ...formData, manager_id: e!.value })
											SetCurrSel(e!.value)
										}}
										value={
											filterHR
												.filter(hr => hr.hrId === formData.manager_id)
												.map(hr => ({
													value: hr.hrId,
													label: `${hr.hrId} - ${hr.name}`,
												}))[0]
										}
										styles={{
											control: (base, state) => ({
												...base,
												background: 'rgb(255, 255, 255)',
												borderColor: state.isFocused
													? 'rgb(99, 102, 241)'
													: 'rgb(229, 231, 235)',
												boxShadow: state.isFocused
													? '0 0 0 2px rgba(99, 102, 241, 0.2)'
													: 'none',
												'&:hover': {
													borderColor: 'rgb(99, 102, 241)',
												},
												'.dark &': {
													background: 'rgb(17, 24, 39)',
													borderColor: state.isFocused
														? 'rgb(99, 102, 241)'
														: 'rgb(55, 65, 81)',
												},
											}),
											menu: base => ({
												...base,
												background: 'rgb(255, 255, 255)',
												border: '1px solid rgb(229, 231, 235)',
												'.dark &': {
													background: 'rgb(17, 24, 39)',
													border: '1px solid rgb(55, 65, 81)',
												},
											}),
											option: (base, state) => ({
												...base,
												backgroundColor: state.isFocused
													? 'rgba(99, 102, 241, 0.2)'
													: 'transparent',
												color: 'rgb(31, 41, 55)',
												'&:hover': {
													backgroundColor: 'rgba(99, 102, 241, 0.2)',
												},
												'.dark &': {
													color: 'rgb(243, 244, 246)',
												},
											}),
											singleValue: base => ({
												...base,
												color: 'rgb(31, 41, 55)',
												'.dark &': {
													color: 'rgb(243, 244, 246)',
												},
											}),
											input: base => ({
												...base,
												color: 'rgb(31, 41, 55)',
												'.dark &': {
													color: 'rgb(243, 244, 246)',
												},
											}),
										}}
										theme={theme => ({
											...theme,
											colors: {
												...theme.colors,
												primary: 'rgb(99, 102, 241)',
												primary75: 'rgba(99, 102, 241, 0.75)',
												primary50: 'rgba(99, 102, 241, 0.5)',
												primary25: 'rgba(99, 102, 241, 0.25)',
											},
										})}
										className={`w-full ${errors.manager_id ? 'border-error-500' : ''}`}
									/>

									{errors.manager_id && (
										<p className="mt-1 text-sm text-error-500">
											{errors.manager_id}
										</p>
									)}
								</div>
							)}

							{formData.role == Role.HR && (
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Meeting Link*
									</label>
									<Input
										type="text"
										onChange={e => setMeetLink(e.target.value)}
										value={meetLink}
										placeholder="Add a meeting link..."
										className={`w-full p-3 bg-white dark:bg-gray-900 border ${
											errors.meeting_link
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
									focus:ring-2 focus:ring-brand-500/20 focus:border-black-500 dark:focus:border-brand-500 transition`}
									/>
									{errors.meeting_link && (
										<p className="mt-1 text-sm text-error-500">
											{errors.meeting_link}
										</p>
									)}
								</div>
							)}

							<div className="col-span-full pt-4 flex gap-4">
								<button
									type="button"
									onClick={resetForm}
									className="w-1/3 py-3 px-4 rounded-lg border border-gray-300 
										dark:border-gray-700 text-gray-700 dark:text-gray-300
										hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
								>
									Reset
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className={`w-full py-3 px-4 rounded-lg transition-colors duration-200
										${
											isSubmitting
												? 'bg-gray-400 cursor-not-allowed'
												: 'bg-brand-500 hover:bg-brand-600'
										}
										text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 
										focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
								>
									{isSubmitting ? (
										<div className="flex items-center justify-center">
											<svg
												className="animate-spin h-5 w-5 mr-3"
												viewBox="0 0 24 24"
											>
												<circle
													className="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													strokeWidth="4"
													fill="none"
												/>
												<path
													className="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												/>
											</svg>
											Creating Employee...
										</div>
									) : (
										'Create New Employee'
									)}
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}