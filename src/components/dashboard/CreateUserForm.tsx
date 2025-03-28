import React, { useState } from 'react'

interface CreateUserProps {
	onCreateUser: (userData: {
		name: string
		email: string
		role: string
		department?: string
	}) => Promise<void>
	isLoading?: boolean
}

const CreateUserForm = ({
	onCreateUser,
	isLoading = false,
}: CreateUserProps) => {
	const [userData, setUserData] = useState({
		name: '',
		email: '',
		role: '',
		department: '',
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

	const validate = () => {
		const newErrors: Record<string, string> = {}
		if (!userData.name.trim()) newErrors.name = 'Name is required'
		if (!userData.email.trim()) newErrors.email = 'Email is required'
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
			newErrors.email = 'Valid email is required'
		if (!userData.role.trim()) newErrors.role = 'Role is required'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target
		setUserData(prev => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validate()) return

		try {
			await onCreateUser({
				name: userData.name,
				email: userData.email,
				role: userData.role,
				department: userData.department || undefined,
			})

			// Reset form on success
			setUserData({
				name: '',
				email: '',
				role: '',
				department: '',
			})
		} catch (error) {
			console.error('Failed to create user:', error)
		}
	}

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Create New User
				</h3>
			</div>

			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>
						Full Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={userData.name}
						onChange={handleChange}
						className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
							errors.name ? 'border-red-500 dark:border-red-500' : ''
						}`}
						placeholder="John Doe"
						disabled={isLoading}
					/>
					{errors.name && (
						<p className="mt-1 text-sm text-red-500">{errors.name}</p>
					)}
				</div>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>
						Email Address
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={userData.email}
						onChange={handleChange}
						className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
							errors.email ? 'border-red-500 dark:border-red-500' : ''
						}`}
						placeholder="john@example.com"
						disabled={isLoading}
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-500">{errors.email}</p>
					)}
				</div>

				<div className="mb-4">
					<label
						htmlFor="role"
						className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>
						Role
					</label>
					<select
						id="role"
						name="role"
						value={userData.role}
						onChange={handleChange}
						className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
							errors.role ? 'border-red-500 dark:border-red-500' : ''
						}`}
						disabled={isLoading}
					>
						<option value="">Select Role</option>
						<option value="employee">Employee</option>
						<option value="hr">HR</option>
						<option value="manager">Manager</option>
						<option value="admin">Admin</option>
					</select>
					{errors.role && (
						<p className="mt-1 text-sm text-red-500">{errors.role}</p>
					)}
				</div>

				<div className="mb-6">
					<label
						htmlFor="department"
						className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>
						Department (Optional)
					</label>
					<input
						type="text"
						id="department"
						name="department"
						value={userData.department}
						onChange={handleChange}
						className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						placeholder="Engineering"
						disabled={isLoading}
					/>
				</div>

				<div className="flex items-center justify-end">
					<button
						type="submit"
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<svg
									className="mr-2 h-4 w-4 animate-spin"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Creating...
							</>
						) : (
							'Create User'
						)}
					</button>
				</div>
			</form>
		</div>
	)
}

export default CreateUserForm
