'use client'
import BasicTableOne from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { type Order } from '@/components/tables/MeetsTable'
import { MAX_PER_PAGE } from '@/constatnts'

const orders: Order[] = [
	{
		meet_id: 101,
		scheduled_at: '2025-03-25T10:00:00Z',
		duration_minutes: '60',
		meeting_link: 'https://meet.example.com/abc123',
		location: 'Conference Room A',
		notes: 'Client meeting to discuss project roadmap.',
		status: 'scheduled',
	},
	{
		meet_id: 102,
		scheduled_at: '2025-03-26T14:30:00Z',
		duration_minutes: '45',
		meeting_link: 'https://meet.example.com/xyz789',
		location: 'Virtual',
		notes: 'Weekly team sync-up.',
		status: 'in_progress',
	},
	{
		meet_id: 103,
		scheduled_at: '2025-03-27T09:15:00Z',
		duration_minutes: '30',
		meeting_link: 'https://meet.example.com/jkl456',
		location: 'Head Office, Room 2B',
		notes: 'Investor pitch presentation.',
		status: 'scheduled',
	},
	{
		meet_id: 104,
		scheduled_at: '2025-03-28T16:00:00Z',
		duration_minutes: '90',
		meeting_link: 'https://meet.example.com/mno789',
		location: 'Virtual',
		notes: 'Technical interview with candidate.',
		status: 'cancelled',
	},
	{
		meet_id: 105,
		scheduled_at: '2025-03-29T11:45:00Z',
		duration_minutes: '120',
		meeting_link: 'https://meet.example.com/pqr123',
		location: "Client's Office",
		notes: 'On-site product demo.',
		status: 'completed',
	},
	{
		meet_id: 106,
		scheduled_at: '2025-03-30T13:00:00Z',
		duration_minutes: '60',
		meeting_link: 'https://meet.example.com/stu456',
		location: 'Virtual',
		notes: 'Follow-up discussion on partnership.',
		status: 'no_show',
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
