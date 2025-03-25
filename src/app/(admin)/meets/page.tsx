'use client'
import { BasicTableOne } from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { MAX_PER_PAGE_USER } from '@/constatnts'
import { SessionType } from '@/types/meets'
import store from '@/redux/store'

function Page() {
	var MAX_PER_PAGE = MAX_PER_PAGE_USER;
	const { auth } = store.getState()
	
	const [currData, setCurrData] = useState<SessionType[]>([])
	const [paginatedData, setPaginatedData] = useState<SessionType[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)

	useEffect(() => {
		const fetchMeets = async () => {
			try {
				const response = await fetch('https://backend-deployment-792.as.r.appspot.com/admin/meets', {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${auth.user?.accessToken}`
					}
				});
				const data = await response.json();
				
				setCurrData(data);
				// Calculate total pages, making sure to round up
				const pages = Math.ceil(data.length / MAX_PER_PAGE);
				setTotalPages(pages);
			} catch (error) {
				console.error('Error fetching meets:', error);
			}
		};

		fetchMeets();
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
