'use client'
import React, { useEffect, useState } from 'react'
import store from '../../../redux/store'
import { ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react'
import { API_URL } from '@/constants'

interface Meet {
	meet_id: string
	user_id: string
	with_user_id: string
	duration: number
	// status: string
	scheduled_at: string
	meeting_link: string
	location: string
	notes: string
}

export default function MeetsPage() {
	const [meets, setMeets] = useState<Meet[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string>('')

	const { auth } = store.getState()

	useEffect(() => {
		const fetchMeets = async () => {
			try {
				setIsLoading(true)
				if (!auth.isAuthenticated)
					throw new Error('No token found in Redux store')

				const response = await fetch(
					`${API_URL}/admin/meets`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${auth.user?.accessToken}`, // ✅ Fixed string interpolation
							'Content-Type': 'application/json',
						},
					}
				)

				if (!response.ok)
					throw new Error(`HTTP error! Status: ${response.status}`)

				const data = await response.json()
				console.log('Fetched meets:', data)
				setMeets(Array.isArray(data) ? data : [])
			} catch (err) {
				console.error('Error fetching meets:', err)
				setError('Failed to fetch meets')
			} finally {
				setIsLoading(false)
			}
		}

		fetchMeets()
	}, [auth.isAuthenticated, auth.user?.accessToken])

	if (isLoading) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Meets</h1>
				<p>Loading...</p>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">Meets</h1>
				<div className="text-red-500">Error: {error}</div>
			</div>
		)
	}

	return <MeetsList meets={meets} />
}

const MeetsList = ({ meets }: { meets: Meet[] }) => {
	const [currentPage, setCurrentPage] = useState(0)
	const itemsPerPage = 10
	const totalPages = Math.ceil(meets.length / itemsPerPage)
	const currentData = meets.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	)

	return (
		<div className="p-8 bg-gray-50 min-h-screen dark:bg-gray-900">
			<h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 dark:text-white ">
				🗓️ Scheduled Meets
			</h1>

			<div className="grid gap-8 dark:bg-gray-900">
				{currentData.length > 0 ? (
					currentData.map((meet, index) => (
						<div
							key={meet.meet_id || index}
							className="bg-white  rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all border border-gray-200 flex flex-col dark:text-white dark:bg-gray-900"
						>
							<div className="grid grid-cols-3 gap-6 text-gray-700 text-sm flex-grow dark:bg-gray-900 dark:text-white">
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										Meet ID:
									</span>{' '}
									{meet.meet_id}
								</p>
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										User ID:
									</span>{' '}
									{meet.user_id}
								</p>
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										With User ID:
									</span>{' '}
									{meet.with_user_id}
								</p>
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										Location:
									</span>{' '}
									{meet.location}
								</p>
								{/* <p>
									<span className="font-semibold text-gray-900 dark:text-white">
										Status:
									</span>{' '}
									<span
										className={`px-2 py-1 rounded-md text-xs font-bold ${
											meet.status === 'COMPLETED'
												? 'bg-green-100 text-green-600'
												: 'bg-yellow-100 text-yellow-600'
										}`}
									>
										{meet.status}
									</span>
								</p> */}
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										Scheduled At:
									</span>{' '}
									{new Date(meet.scheduled_at).toLocaleString()}
								</p>
								<p>
									<span className="font-semibold text-gray-900 dark:text-white">
										Duration:
									</span>{' '}
									{meet.duration} mins
								</p>
								<p className="col-span-3 text-gray-900 dark:text-white">
									<span className="font-semibold dark:text-white">Notes:</span>{' '}
									{meet.notes}
								</p>
							</div>

							{/* ✅ Join Meeting Link at Bottom Right */}
							<div className="mt-4 flex justify-end">
								<a
									href={meet.meeting_link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
								>
									Join Meeting <ExternalLink />
								</a>
							</div>
						</div>
					))
				) : (
					<p className="text-gray-500 text-center text-lg dark:text-white">
						No scheduled meets found.
					</p>
				)}
			</div>

			{/* ✅ Pagination Controls */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center mt-10">
					<button
						onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
						disabled={currentPage === 0}
						className={`px-4 py-2 mr-4 rounded-lg text-white transition-all ${
							currentPage === 0
								? 'bg-gray-300 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-800'
						}`}
					>
						<ArrowLeft />
					</button>
					<span className="text-lg font-semibold text-gray-700">
						Page {currentPage + 1} of {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))
						}
						disabled={currentPage === totalPages - 1}
						className={`px-4 py-2 ml-4 rounded-lg text-white transition-all ${
							currentPage === totalPages - 1
								? 'bg-gray-300 cursor-not-allowed'
								: 'bg-blue-600 hover:bg-blue-800'
						}`}
					>
						<ArrowRight />
					</button>
				</div>
			)}
		</div>
	)
}
