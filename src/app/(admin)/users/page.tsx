'use client'
import BasicTableOne from '@/components/tables/EmployeeTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { API_URL, MAX_PER_PAGE_USER } from '@/constants'
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
		fetch(API_URL + route, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${auth.user?.accessToken}`,
				'Content-type': 'application/json',
			},
		}).then(resp => {
			if (resp.ok) {
				resp.json().then((res: Response) => {
					setCurrData(res.users)
					const pages = Math.ceil(res.users.length / MAX_PER_PAGE_USER)
					console.log(pages)
					setTotalPages(pages)
					setCurrentPage(1)
				})
			}
		})
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
