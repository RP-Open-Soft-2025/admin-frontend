'use client'
import {BasicTableOneAll} from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { type all_order } from '@/components/tables/MeetsTable'
import { MAX_PER_PAGE } from '@/constatnts'

const orders: all_order[] = [ 
	{
		employee_id: 201,
		start_time: '2025-03-25T10:00:00Z',
		end_time: '2025-03-25T11:00:00Z',
		location: 'Conference Room A',
	}, 
	{
		employee_id: 202,
		start_time: '2025-03-26T14:30:00Z',
		end_time: '2025-03-26T15:15:00Z',
		location: 'Virtual',
	},
	{
		employee_id: 203,
		start_time: '2025-03-27T09:15:00Z',
		end_time: '2025-03-27T09:45:00Z',
		location: 'Head Office, Room 2B',
	},
	{
		employee_id: 204,
		start_time: '2025-03-28T16:00:00Z',
		end_time: '2025-03-28T17:30:00Z',
		location: 'Virtual',
	},
	{
		employee_id: 205,
		start_time: '2025-03-29T11:45:00Z',
		end_time: '2025-03-29T13:45:00Z',
		location: "Client's Office",
	},
	{
		employee_id: 206,
		start_time: '2025-03-30T13:00:00Z',
		end_time: '2025-03-30T14:00:00Z',
		location: 'Virtual',
	},
	{
		employee_id: 206,
		start_time: '2025-03-30T13:00:00Z',
		end_time: '2025-03-30T14:00:00Z',
		location: 'Virtual',
	},
]

function Page() {
	const [currData, setCurrData] = useState<all_order[]>([])
	const [paginatedData, setPaginatedData] = useState<all_order[]>([])
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
			<BasicTableOneAll tableData={paginatedData} />
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
