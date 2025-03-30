'use client'
import { BasicTableOne } from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { API_URL, MAX_PER_PAGE_SESSION } from '@/constants'
import { SessionType } from '@/types/sessions'
import store from '@/redux/store'

type State = 'pending' | 'completed' | 'active'

const TableSession = ({ state }: { state: State }) => {
	const [currData, setCurrData] = useState<SessionType[]>([])
	const [paginatedData, setPaginatedData] = useState<SessionType[]>([])
	const [currPage, setCurrentPage] = useState<number>(1)
	const [historyLoading, setHistoryLoading] = useState<boolean>(true)
	const [totalPages, setTotalPages] = useState<number>(1)
	const { auth } = store.getState()

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				fetch(`${API_URL}/${auth.user!.userRole}/sessions/${state}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
				}).then(resp => {
					if (resp.ok) {
						resp.json().then((result: SessionType[]) => {
							setCurrData(result)
							setTotalPages(Math.ceil(result.length / MAX_PER_PAGE_SESSION))
							setHistoryLoading(false)
						})
					}
				})
			} catch (error) {
				console.error('Error fetching sessions:', error)
			}
		}

		fetchSessions()
	}, [state, auth.user])

	useEffect(() => {
		if (currData.length > 0) {
			const start = (currPage - 1) * MAX_PER_PAGE_SESSION
			const end = start + MAX_PER_PAGE_SESSION
			setPaginatedData(currData.slice(start, end))
		}
	}, [currPage, currData])

	if (historyLoading) {
		return (
			<div className="flex justify-center items-center h-24">
				<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
			</div>
		)
	}

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4 dark:text-white">
				{state.toUpperCase()}
			</h2>
			<BasicTableOne tableData={paginatedData} />
			<div className="mt-6 w-full flex justify-center items-center">
				{state != 'active' && (
					<Pagination
						totalPages={totalPages}
						currentPage={currPage}
						onPageChange={setCurrentPage}
					/>
				)}
			</div>
		</div>
	)
}

const Page = () => {
	return (
		<>
			<TableSession state="active" />
			<TableSession state="completed" />
			<TableSession state="pending" />
		</>
	)
}

export default Page
