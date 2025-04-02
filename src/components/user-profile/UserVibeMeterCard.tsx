'use client'
import React from 'react'
import { VibeMeter } from '@/types/UserProfile'

// Props interface
interface UserVibeMeterCardProps {
	vibeMeterData: VibeMeter[]
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export default function UserVibeMeterCard({
	vibeMeterData,
}: UserVibeMeterCardProps) {
	if (!vibeMeterData || vibeMeterData.length === 0) return null

	// Get the latest vibe meter entry
	const latestVibe = vibeMeterData.reduce((latest, current) => {
		return new Date(current.Response_Date) > new Date(latest.Response_Date)
			? current
			: latest
	})

	// Calculate average vibe score
	const averageVibeScore =
		vibeMeterData.reduce((sum, entry) => sum + entry.Vibe_Score, 0) /
		vibeMeterData.length

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-4">
						Employee Wellbeing & Vibe Meter
					</h4>

					{/* Current Wellbeing Status */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Latest Vibe Score
							</p>
							<div className="mt-2 flex items-baseline">
								<p className="text-3xl font-bold text-gray-800 dark:text-white/90">
									{latestVibe.Vibe_Score}
								</p>
								<p className="ml-1 text-sm text-gray-500 dark:text-gray-400">
									/10
								</p>
							</div>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Last updated: {formatDate(latestVibe.Response_Date)}
							</p>
						</div>
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Average Vibe Score
							</p>
							<div className="mt-2 flex items-baseline">
								<p className="text-3xl font-bold text-gray-800 dark:text-white/90">
									{averageVibeScore.toFixed(1)}
								</p>
								<p className="ml-1 text-sm text-gray-500 dark:text-gray-400">
									/10
								</p>
							</div>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								Based on {vibeMeterData.length} responses
							</p>
						</div>
					</div>

					{/* Recent Responses */}
					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Recent Responses
						</h5>
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Date
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Vibe Score
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{vibeMeterData
										.sort(
											(a, b) =>
												new Date(b.Response_Date).getTime() -
												new Date(a.Response_Date).getTime()
										)
										.slice(0, 5)
										.map(vibe => (
											<tr
												key={vibe.Response_Date}
												className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
													{formatDate(vibe.Response_Date)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
													{vibe.Vibe_Score}/10
												</td>
											</tr>
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
