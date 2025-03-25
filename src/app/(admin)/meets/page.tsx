'use client'
import { BasicTableOne } from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { MAX_PER_PAGE_SESSION } from '@/constants'
import { SessionType } from '@/types/sessions'

function Page() {
	const [currData, setCurrData] = useState<SessionType[]>([])
	const [paginatedData, setPaginatedData] = useState<SessionType[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		setCurrData([])
		// Calculate total pages, making sure to round up
		const pages = Math.ceil(MAX_PER_PAGE_SESSION / MAX_PER_PAGE_SESSION)
		setTotalPages(pages)
		setCurrentPage(1)
	}, [])

	useEffect(() => {
		// Only run this effect if currData has items
		if (currData.length > 0) {
			const start = (currPage - 1) * MAX_PER_PAGE_SESSION
			const end = start + MAX_PER_PAGE_SESSION
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
