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

function Page() {
	const [currData, setCurrData] = useState<Employee[]>([])
	const [paginatedData, setPaginatedData] = useState<Employee[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)

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
						const sort_user = res.users.sort((a: Employee, b: Employee) => {
							const da = new Date(a.lastPing)
							const db = new Date(b.lastPing)
							return db.getTime() - da.getTime()
						})
						setCurrData(sort_user)
						const pages = Math.ceil(res.users.length / MAX_PER_PAGE_USER)
						console.log(pages)
						setTotalPages(pages)
						setCurrentPage(1)
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
		// Only run this effect if currData has items
		if (currData.length > 0) {
			const start = (currPage - 1) * MAX_PER_PAGE_USER
			const end = start + MAX_PER_PAGE_USER
			// Make sure to use the correct end index (not subtracting 1)
			setPaginatedData(currData.slice(start, end))
		}
	}, [currPage, currData]) // Also run when currData changes

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4 dark:text-white">ALL USERS</h2>
			<BasicTableOne tableData={paginatedData} />
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
