'use client'
import React from 'react'
import { Performance, ManagerFeedback } from '@/types/employee'

// Props interface
interface UserPerformanceCardProps {
	performanceData?: Performance[]
}

// Dummy data for development
const dummyPerformanceData: Performance[] = [
	{
		reviewPeriod: '2023 Q1',
		performanceRating: 4.2,
		managerFeedback: ManagerFeedback.EXCEEDS_EXPECTATIONS,
		promotionConsideration: false,
	},
	{
		reviewPeriod: '2023 Q2',
		performanceRating: 4.5,
		managerFeedback: ManagerFeedback.EXCEEDS_EXPECTATIONS,
		promotionConsideration: true,
	},
	{
		reviewPeriod: '2023 Q3',
		performanceRating: 3.8,
		managerFeedback: ManagerFeedback.MEETS_EXPECTATIONS,
		promotionConsideration: false,
	},
	{
		reviewPeriod: '2023 Q4',
		performanceRating: 4.7,
		managerFeedback: ManagerFeedback.EXCEEDS_EXPECTATIONS,
		promotionConsideration: true,
	},
]

// Get feedback color based on feedback type
const getFeedbackColor = (feedback: ManagerFeedback) => {
	switch (feedback) {
		case ManagerFeedback.EXCEEDS_EXPECTATIONS:
			return 'text-green-600 dark:text-green-500'
		case ManagerFeedback.MEETS_EXPECTATIONS:
			return 'text-blue-600 dark:text-blue-500'
		case ManagerFeedback.NEEDS_IMPROVEMENT:
			return 'text-amber-600 dark:text-amber-500'
		default:
			return 'text-gray-600 dark:text-gray-400'
	}
}

export default function UserPerformanceCard({
	performanceData,
}: UserPerformanceCardProps) {
	// Use provided data or fall back to dummy data
	const displayData =
		performanceData && performanceData.length > 0
			? performanceData
			: dummyPerformanceData

	// Get most recent performance review
	const latestPerformance = displayData[displayData.length - 1]

	// Calculate average rating
	const averageRating =
		displayData.reduce((total, perf) => total + perf.performanceRating, 0) /
		displayData.length

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Performance Overview
					</h4>

					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Latest Rating
							</p>
							<div className="mt-2 flex items-end">
								<p className="text-3xl font-bold text-gray-800 dark:text-white">
									{latestPerformance.performanceRating.toFixed(1)}
								</p>
								<p className="ml-1 mb-1 text-sm text-gray-500 dark:text-gray-400">
									/5.0
								</p>
							</div>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								{latestPerformance.reviewPeriod}
							</p>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Average Rating
							</p>
							<div className="mt-2 flex items-end">
								<p className="text-3xl font-bold text-gray-800 dark:text-white">
									{averageRating.toFixed(1)}
								</p>
								<p className="ml-1 mb-1 text-sm text-gray-500 dark:text-gray-400">
									/5.0
								</p>
							</div>
							<div className="mt-1 flex">
								{[1, 2, 3, 4, 5].map(star => (
									<svg
										key={star}
										className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`}
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Manager Feedback
							</p>
							<p
								className={`mt-2 text-base font-semibold ${getFeedbackColor(latestPerformance.managerFeedback)}`}
							>
								{latestPerformance.managerFeedback}
							</p>
							<div className="mt-2">
								<span
									className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${latestPerformance.promotionConsideration ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
								>
									{latestPerformance.promotionConsideration
										? 'Promotion Considered'
										: 'No Promotion'}
								</span>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Performance History
						</h5>
						<div className="mt-4 flex items-end space-x-2 h-32">
							{displayData.map((performance, index) => (
								<div
									key={index}
									className="relative flex flex-col items-center flex-1"
								>
									<div className="relative w-full">
										<div
											className={`w-full rounded-t-sm ${
												performance.managerFeedback ===
												ManagerFeedback.EXCEEDS_EXPECTATIONS
													? 'bg-green-500 dark:bg-green-600'
													: performance.managerFeedback ===
														  ManagerFeedback.MEETS_EXPECTATIONS
														? 'bg-blue-500 dark:bg-blue-600'
														: 'bg-amber-500 dark:bg-amber-600'
											}`}
											style={{
												height: `${performance.performanceRating * 20}px`,
											}}
										></div>
										<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
											{performance.performanceRating.toFixed(1)}
										</div>
									</div>
									<span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
										{performance.reviewPeriod}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
