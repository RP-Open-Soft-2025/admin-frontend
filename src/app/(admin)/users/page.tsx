'use client'
import BasicTableOne from '@/components/tables/EmployeeTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { API_URL, DEL_TIME, MAX_PER_PAGE_USER } from '@/constants'
import store from '@/redux/store'
import { Employee } from '@/types/employee'

type Response = {
	users: Employee[]
}

type SortConfig = {
	key: keyof Employee
	direction: 'asc' | 'desc'
}

function Page() {
	const [allData, setAllData] = useState<Employee[]>([])
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currData, setCurrData] = useState<Employee[]>([])
	const [paginatedData, setPaginatedData] = useState<Employee[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [searchTerm, setSearchTerm] = useState<string>('')
	const [selectedRole, setSelectedRole] = useState<string>('')
	const [availableRoles, setAvailableRoles] = useState<string[]>([])
	const [historyLoading, setHistoryLoading] = useState<boolean>(true)
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		key: 'name',
		direction: 'asc',
	})

	useEffect(() => {
		const { auth } = store.getState()
		const route =
			auth.user?.userRole == 'admin'
				? '/admin/list-users'
				: '/hr/list-assigned-users'
		const getUpdate = () => {
			fetch(API_URL + route, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${auth.user?.accessToken}`,
					'Content-type': 'application/json',
				},
			}).then(resp => {
				if (resp.ok) {
					resp.json().then((res: Response) => {
						setAllData(res.users)
						// Extract unique roles from the data
						const roles = [...new Set(res.users.map(user => user.role))].filter(
							Boolean
						)
						setAvailableRoles(roles)
						setHistoryLoading(false)
					})
				}
			})
		}

		getUpdate()

		const interval = setInterval(() => {
			getUpdate()
		}, DEL_TIME)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		// First sort all data
		let sortedData = [...allData]
		sortedData.sort((a, b) => {
			const aValue = a[sortConfig.key] || ''
			const bValue = b[sortConfig.key] || ''

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				const comparison = aValue.localeCompare(bValue)
				return sortConfig.direction === 'asc' ? comparison : -comparison
			}

			return 0
		})

		// Then filter the sorted data
		if (searchTerm) {
			sortedData = sortedData.filter(
				user =>
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.userId.toLowerCase().includes(searchTerm.toLowerCase())
			)
		}

		if (selectedRole) {
			sortedData = sortedData.filter(user => user.role === selectedRole)
		}

		setCurrData(sortedData)

		// Calculate total pages based on filtered data
		const pages = Math.ceil(sortedData.length / MAX_PER_PAGE_USER)
		setTotalPages(pages || 1)

		// Ensure current page is valid with new filter results
		if (currPage > pages && pages > 0) {
			setCurrentPage(1)
		}

		// Apply pagination to filtered data
		const start = (currPage - 1) * MAX_PER_PAGE_USER
		const end = start + MAX_PER_PAGE_USER
		setPaginatedData(sortedData.slice(start, end))
	}, [currPage, allData, searchTerm, selectedRole, sortConfig])

	if (historyLoading) {
		return (
			<div className="flex justify-center items-center h-24">
				<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
			</div>
		)
	}

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4 dark:text-white">ALL USERS</h2>

			<div className="flex flex-col mb-4 gap-4 md:flex-row md:items-center">
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

				<div className="md:w-48">
					<select
						className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						value={selectedRole}
						onChange={e => setSelectedRole(e.target.value)}
					>
						<option value="">All Roles</option>
						{availableRoles.map(role => (
							<option key={role} value={role}>
								{role.toUpperCase()}
							</option>
						))}
					</select>
				</div>
			</div>

			<BasicTableOne tableData={paginatedData} onSort={setSortConfig} />
			<div className="mt-6 w-full flex justify-center items-center">
				<Pagination
					totalPages={totalPages}
					currentPage={currPage}
					onPageChange={(num: number) => setCurrentPage(num)}
				/>
			</div>
		</div>
	)
}

export default Page
