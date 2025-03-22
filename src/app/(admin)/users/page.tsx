'use client'
import BasicTableOne from '@/components/tables/BasicTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { type Order } from '@/components/tables/BasicTable'
import { MAX_PER_PAGE } from '@/constatnts'

export const orders: Order[] = [
	{
		id: 1,
		name: 'Alice Johnson',
		email: 'alice.johnson@example.com',
		emp_id: 'EMP1001',
		role: 'Admin',
		is_blocked: false,
	},
	{
		id: 2,
		name: 'Bob Smith',
		email: 'bob.smith@example.com',
		emp_id: 'EMP1002',
		role: 'Employee',
		is_blocked: false,
	},
	{
		id: 3,
		name: 'Charlie Brown',
		email: 'charlie.brown@example.com',
		emp_id: 'EMP1003',
		role: 'HR',
		is_blocked: true,
	},
	{
		id: 4,
		name: 'David Williams',
		email: 'david.williams@example.com',
		emp_id: 'EMP1004',
		role: 'Employee',
		is_blocked: false,
	},
	{
		id: 5,
		name: 'Eve Adams',
		email: 'eve.adams@example.com',
		emp_id: 'EMP1005',
		role: 'Employee',
		is_blocked: true,
	},
]

function Page() {
	const [currData, setCurrData] = useState<Order[]>([])
	const [paginatedData, setPaginatedData] = useState<Order[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		setCurrData(orders)
		// Calculate total pages, making sure to round up
		const pages = Math.ceil(orders.length / MAX_PER_PAGE)
		setTotalPages(pages)
		setCurrentPage(1)
	}, [])

	useEffect(() => {
		// Only run this effect if currData has items
		if (currData.length > 0) {
			const start = (currPage - 1) * MAX_PER_PAGE
			const end = start + MAX_PER_PAGE
			// Make sure to use the correct end index (not subtracting 1)
			setPaginatedData(currData.slice(start, end))
		}
	}, [currPage, currData]) // Also run when currData changes

	return (
		<div>
			<BasicTableOne tableData={paginatedData} />
			<div className="mt-6">
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
