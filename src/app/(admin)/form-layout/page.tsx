'use client'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import { useState, useRef, useEffect } from 'react'
import { API_URL } from '@/constants'
import { Role } from '@/types/employee'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'

interface FormErrors {
	employee_id?: string
	name?: string
	email?: string
	password?: string
	role?: string
	manager_id?: string
}

export default function FormLayout() {
	const [formData, setFormData] = useState({
		employee_id: '',
		name: '',
		email: '',
		password: '',
		role: '',
		manager_id: '',
	})
	const [errors, setErrors] = useState<FormErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Add ref to first input
	const employeeIdRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		employeeIdRef.current?.focus()
	}, [])

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

		// Employee ID validation - improved regex
		if (!trimmedData.employee_id.match(/^EMP\d{3,}$/)) {
			newErrors.employee_id =
				'Employee ID must start with EMP followed by at least 3 numbers'
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

		// Password validation - more secure requirements
		if (
			!formData.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/)
		) {
			newErrors.password =
				'Password must be at least 6 characters and contain both letters and numbers'
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
			if (!trimmedData.manager_id.match(/^EMP\d{3,}$/)) {
				newErrors.manager_id =
					'Manager ID must be in valid format (e.g., EMP123)'
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

		setFormData({
			...formData,
			password: [...Array(16)]
				.map(
					() =>
						'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+'[
							Math.floor(Math.random() * 72)
						]
				)
				.join(''),
		})
		try {
			const { auth } = store.getState()
			const response = await fetch(`${API_URL}/admin/create-user`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
				body: JSON.stringify(formData),
			})

			const errorData = await response.json()

			if (response.ok) {
				toast({
					type: 'error',
					description: errorData,
				})
				resetForm()
			} else {
				toast({
					type: 'error',
					description: errorData,
				})
			}
		} catch (error) {
			console.error('Error creating user:', error)
			toast({
				type: 'error',
				description: 'Failed to create user, contact system admins',
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
			password: '',
			role: '',
			manager_id: '',
		})
		setErrors({})
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<PageBreadcrumb pageTitle="Add New User" />
			<div className="max-w-2xl mx-auto py-8 px-4">
				<div className="bg-white dark:bg-gray-800 rounded-lg shadow-theme-lg p-6">
					<h2 className="text-2xl font-semibold text-gray-900 dark:text-white/90 mb-6">
						User Registration Form
					</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Employee ID Field */}
							<div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Employee ID*
								</label>
								<input
									ref={employeeIdRef}
									type="text"
									placeholder="Enter employee ID (e.g., EMP001)"
									value={formData.employee_id}
									onChange={e =>
										setFormData({ ...formData, employee_id: e.target.value })
									}
									className={`w-full p-3 bg-white dark:bg-gray-900 border ${
										errors.employee_id
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
                  focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
								/>
								{errors.employee_id && (
									<p className="mt-1 text-sm text-error-500">
										{errors.employee_id}
									</p>
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

							{/* Password Field */}
							{/* <div>
								<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Password*
								</label>
								<input
									type="password"
									placeholder="Enter password"
									value={formData.password}
									onChange={e =>
										setFormData({ ...formData, password: e.target.value })
									}
									className={`w-full p-3 bg-white dark:bg-gray-900 border ${
										errors.password
											? 'border-error-500'
											: 'border-gray-200 dark:border-gray-700'
									} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
									focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
								/>
								{errors.password && (
									<p className="mt-1 text-sm text-error-500">
										{errors.password}
									</p>
								)}
							</div> */}

							{/* Role Field */}
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

							{/* Manager ID Field - Only shown if role is Employee */}
							{formData.role === Role.EMPLOYEE && (
								<div>
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
										Manager ID*
									</label>
									<input
										type="text"
										placeholder="Enter manager ID"
										value={formData.manager_id}
										onChange={e =>
											setFormData({ ...formData, manager_id: e.target.value })
										}
										className={`w-full p-3 bg-white dark:bg-gray-900 border ${
											errors.manager_id
												? 'border-error-500'
												: 'border-gray-200 dark:border-gray-700'
										} rounded-lg text-gray-900 dark:text-white/90 placeholder-gray-500 dark:placeholder-gray-400
										focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-500 transition`}
									/>
									{errors.manager_id && (
										<p className="mt-1 text-sm text-error-500">
											{errors.manager_id}
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
											Creating User...
										</div>
									) : (
										'Create New User'
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
