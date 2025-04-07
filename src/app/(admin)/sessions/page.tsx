'use client'
import { BasicTableOne } from '@/components/tables/MeetsTable'
import Pagination from '@/components/tables/Pagination'
import React, { useEffect, useState } from 'react'
import { API_URL, MAX_PER_PAGE_SESSION } from '@/constants'
import { SessionType } from '@/types/sessions'
import store from '@/redux/store'

const SessionsPage = () => {
	const [activeSessions, setActiveSessions] = useState<SessionType[]>([])
	const [pendingSessions, setPendingSessions] = useState<SessionType[]>([])
	const [activePage, setActivePage] = useState<number>(1)
	const [pendingPage, setPendingPage] = useState<number>(1)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const { auth } = store.getState()

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const endpoint = `${API_URL}/admin/sessions`

				fetch(endpoint, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
				})
					.then(resp => {
						if (resp.ok) {
							resp.json().then((result: SessionType[]) => {
								setActiveSessions(
									result.filter(
										session => session.status.toLowerCase() === 'active'
									)
								)
								setPendingSessions(
									result.filter(
										session => session.status.toLowerCase() === 'pending'
									)
								)
								setIsLoading(false)
							})
						} else {
							setIsLoading(false)
						}
					})
					.catch(error => {
						console.error('Error fetching sessions:', error)
						setIsLoading(false)
					})
			} catch (error) {
				console.error('Error fetching sessions:', error)
				setIsLoading(false)
			}
		}

		fetchSessions()
	}, [auth.user])

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-24">
				<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500"></div>
			</div>
		)
	}

	const getPaginatedData = (data: SessionType[], page: number) => {
		const start = (page - 1) * MAX_PER_PAGE_SESSION
		const end = start + MAX_PER_PAGE_SESSION
		return data.slice(start, end)
	}

	const getTotalPages = (data: SessionType[]) => {
		return Math.ceil(data.length / MAX_PER_PAGE_SESSION)
	}

	return (
		<>
			<div>
				<h2 className="text-lg font-semibold mb-4 dark:text-white">ACTIVE</h2>
				<BasicTableOne
					tableData={getPaginatedData(activeSessions, activePage)}
				/>
				<div className="mt-6 w-full flex justify-center items-center">
					<Pagination
						totalPages={getTotalPages(activeSessions)}
						currentPage={activePage}
						onPageChange={setActivePage}
					/>
				</div>
			</div>
			<div className="mt-8">
				<h2 className="text-lg font-semibold mb-4 dark:text-white">
					SCHEDULED
				</h2>
				<BasicTableOne
					tableData={getPaginatedData(pendingSessions, pendingPage)}
				/>
				<div className="mt-6 w-full flex justify-center items-center">
					<Pagination
						totalPages={getTotalPages(pendingSessions)}
						currentPage={pendingPage}
						onPageChange={setPendingPage}
					/>
				</div>
			</div>
		</>
	)
}

export default SessionsPage
