import React, { useState } from 'react'
import { User } from '@/services/adminService'

interface UserManagementProps {
	users: User[] | 'UNAVAILABLE'
	onDeleteUser?: (userId: string) => void
	onViewDetails?: (userId: string) => void
	onCreateSession?: (userId: string) => void
	onCreateUser?: () => void
	onRefresh?: () => void
	isLoading?: boolean
}

const UserManagement = ({
	users,
	onDeleteUser,
	onViewDetails,
	onCreateSession,
	onCreateUser,
	onRefresh,
	isLoading = false,
}: UserManagementProps) => {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredUsers =
		users === 'UNAVAILABLE'
			? []
			: users.filter(
					user =>
						user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
						user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
						user.role.toLowerCase().includes(searchTerm.toLowerCase())
				)

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}).format(date)
		} catch (error) {
			console.log(error)
			return 'Invalid date'
		}
	}

	if (isLoading) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						User Management
					</h3>
				</div>
				<div className="flex h-64 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
				</div>
			</div>
		)
	}

	if (users === 'UNAVAILABLE') {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						User Management
					</h3>
				</div>
				<div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
					UNAVAILABLE
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					User Management
				</h3>
				<div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-end">
					<div className="flex space-x-2">
						{onCreateUser && (
							<button
								onClick={onCreateUser}
								className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<line x1="19" y1="8" x2="19" y2="14" />
									<line x1="16" y1="11" x2="22" y2="11" />
								</svg>
								Create User
							</button>
						)}
						{onRefresh && (
							<button
								onClick={onRefresh}
								className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="mr-2 h-4 w-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M21 2v6h-6"></path>
									<path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
									<path d="M3 22v-6h6"></path>
									<path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
								</svg>
								Refresh
							</button>
						)}
					</div>
					<div className="relative max-w-sm md:w-64">
						<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								className="h-4 w-4 text-gray-500 dark:text-gray-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								></path>
							</svg>
						</div>
						<input
							type="search"
							className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
							placeholder="Search users..."
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
			</div>

			<div className="h-[400px] overflow-auto">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Email
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Role
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Blocked
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Last Online
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
								>
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
							{filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
									>
										No users found
									</td>
								</tr>
							) : (
								filteredUsers.map((user, index) => (
									<tr
										key={user.id || `user-${index}`}
										className="hover:bg-gray-50 dark:hover:bg-gray-800"
									>
										<td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
											{user.name}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
											{user.email}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
											{user.role.toUpperCase()}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm">
											<span
												className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
													user.is_blocked
														? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
														: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
												}`}
											>
												{user.is_blocked ? 'Blocked' : 'Active'}
											</span>
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
											{formatDate(user.lastPing)}
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
											<div className="flex justify-end space-x-2">
												{onViewDetails && (
													<button
														onClick={() => onViewDetails(user.id)}
														className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
														title="View Details"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
															/>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
															/>
														</svg>
													</button>
												)}
												{onCreateSession && (
													<button
														onClick={() => onCreateSession(user.id)}
														className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
														title="Create Session"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M12 6v6m0 0v6m0-6h6m-6 0H6"
															/>
														</svg>
													</button>
												)}
												{onDeleteUser && (
													<button
														onClick={() => onDeleteUser(user.id)}
														className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
														title="Delete User"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="h-5 w-5"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
													</button>
												)}
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default UserManagement
