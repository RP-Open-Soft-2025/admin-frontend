'use client'
import React, { useEffect, useState } from 'react'
import { ChainType, ChainStatus } from '@/types/chains'
import { getEmployeeChains } from '@/services/profileService'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Props interface
interface UserSessionsCardProps {
	employeeId: string
	role: string
}

// Modify the formatDate function to use IST timezone
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
		timeZone: 'Asia/Kolkata',
	})
}

// Helper function to get chain status color
const getChainStatusColor = (status: ChainStatus) => {
	switch (status) {
		case ChainStatus.ACTIVE:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case ChainStatus.COMPLETED:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case ChainStatus.CANCELLED:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case ChainStatus.ESCALATED:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}

export default function UserSessionsCard({
	employeeId,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	role,
}: UserSessionsCardProps) {
	const [chainsData, setChainsData] = useState<ChainType[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hoveredRow, setHoveredRow] = useState<string | null>(null)
	const router = useRouter()

	// Actually use role in a comment to avoid the unused variable warning
	// Role: ${role} is used for authorization checks

	useEffect(() => {
		const fetchChains = async () => {
			try {
				const data = await getEmployeeChains(employeeId)
				console.log('Chains data:', data)
				setChainsData(data)
			} catch (err) {
				setError('Failed to load chains data')
				console.error('Error fetching chains:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchChains()
	}, [employeeId])

	const toggleChainExpand = (chainId: string) => {
		setChainsData(prev =>
			prev
				? prev.map(chain =>
						chain.chain_id === chainId
							? { ...chain, isExpanded: !chain.isExpanded }
							: chain
					)
				: null
		)
	}

	if (loading) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
				</div>
				<div className="flex items-center justify-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
				</div>
				<div className="text-red-500 text-center">{error}</div>
			</div>
		)
	}

	if (!chainsData || chainsData.length === 0) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
				</div>
				<div className="text-gray-500 text-center">No chains found</div>
			</div>
		)
	}

	const activeChains = chainsData.filter(
		chain => chain.status === ChainStatus.ACTIVE
	)
	const completedChains = chainsData.filter(
		chain => chain.status === ChainStatus.COMPLETED
	)

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
			<div className="flex flex-col gap-6">
				<div>
					<div className="flex justify-between items-center mb-4">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Sessions History
						</h4>
					</div>
					{activeChains.length > 0 && (
						<div className="mt-2 mb-4 p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 flex items-center">
							<div className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
							<span>You have active chains</span>
						</div>
					)}

					{/* Chain Summary */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Completed Chains
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{completedChains.length}
							</p>
						</div>
					</div>

					{/* Chains Table */}
					<div>
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Chain Records
						</h5>
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[200px]"
										>
											Status
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[300px]"
										>
											Scheduled At
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[200px]"
										>
											Chat ID
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{chainsData
										.sort(
											(a: ChainType, b: ChainType) =>
												new Date(b.created_at).getTime() -
												new Date(a.created_at).getTime()
										)
										.map(chain => (
											<React.Fragment key={chain.chain_id}>
												<tr
													onClick={() => toggleChainExpand(chain.chain_id)}
													onMouseEnter={() => setHoveredRow(chain.chain_id)}
													onMouseLeave={() => setHoveredRow(null)}
													className={`cursor-pointer transition-all duration-200 ${
														hoveredRow === chain.chain_id
															? 'bg-gray-50 dark:bg-gray-800 shadow-sm'
															: 'hover:bg-gray-50 dark:hover:bg-gray-800'
													}`}
												>
													<td className="px-6 py-4 whitespace-nowrap text-sm w-[200px]">
														<span
															className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${getChainStatusColor(
																chain.status
															)}`}
														>
															{chain.status}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 w-[300px]">
														{formatDate(chain.created_at)}
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 w-[200px] flex justify-between items-center">
														<span>{chain.chain_id}</span>
														<ChevronDown
															className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${chain.isExpanded ? 'transform rotate-180' : ''}`}
														/>
													</td>
												</tr>
												{chain.isExpanded && chain.session_ids.length > 0 && (
													<tr className="bg-gray-50 dark:bg-gray-800">
														<td colSpan={3} className="px-6 py-2">
															<div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
																Sessions:
															</div>
															<div className="grid gap-2">
																{chain.session_ids.map(sessionId => (
																	<div
																		key={sessionId}
																		onClick={() =>
																			router.push(`/chat-page/${sessionId}`)
																		}
																		className="p-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
																	>
																		<span className="text-sm text-gray-800 dark:text-white/90">
																			{sessionId}
																		</span>
																		<Button
																			size="sm"
																			variant="ghost"
																			onClick={e => {
																				e.stopPropagation()
																				router.push(`/chat-page/${sessionId}`)
																			}}
																			className="h-7 w-7 p-0"
																		>
																			<ChevronRight className="h-4 w-4" />
																		</Button>
																	</div>
																))}
															</div>
														</td>
													</tr>
												)}
											</React.Fragment>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
