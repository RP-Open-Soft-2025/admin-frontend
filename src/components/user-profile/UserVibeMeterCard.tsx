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

// Professional text mapping for vibe scores
const getLabelForScore = (score: number): string => {
	const normalizedScore = score // Handle legacy data that might be out of 10
	if (normalizedScore >= 4) return 'Excellent'
	if (normalizedScore >= 3) return 'Good'
	if (normalizedScore >= 2) return 'Satisfactory'
	if (normalizedScore >= 1) return 'Needs Improvement'
	return 'Critical'
}

// Color mapping for vibe scores
const getColorForScore = (score: number): string => {
	const normalizedScore = score // Handle legacy data that might be out of 10
	if (normalizedScore >= 4) return 'bg-green-500'
	if (normalizedScore >= 3) return 'bg-lime-500'
	if (normalizedScore >= 2) return 'bg-amber-500'
	if (normalizedScore >= 1) return 'bg-orange-500'
	return 'bg-red-500'
}

// Text color mapping for vibe scores
const getTextColorForScore = (score: number): string => {
	const normalizedScore = score // Handle legacy data that might be out of 10
	if (normalizedScore >= 4) return 'text-green-500'
	if (normalizedScore >= 3) return 'text-lime-500'
	if (normalizedScore >= 2) return 'text-amber-500'
	if (normalizedScore >= 1) return 'text-orange-500'
	return 'text-red-500'
}

// Get specific color for each score point
const getColorForPoint = (point: number): string => {
	switch (point) {
		case 1:
			return 'bg-red-500'
		case 2:
			return 'bg-orange-500'
		case 3:
			return 'bg-amber-500'
		case 4:
			return 'bg-lime-500'
		case 5:
			return 'bg-green-500'
		default:
			return 'bg-green-400'
	}
}

// Get text color for each score point
const getTextColorForPoint = (point: number): string => {
	switch (point) {
		case 1:
			return 'text-red-500'
		case 2:
			return 'text-orange-500'
		case 3:
			return 'text-amber-500'
		case 4:
			return 'text-lime-500'
		case 5:
			return 'text-green-500'
		default:
			return 'text-green-400'
	}
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

	// Normalize score to scale of 5
	const normalizeScore = (score: number) => (score > 5 ? score / 2 : score)
	const normalizedScore = normalizeScore(latestVibe.Vibe_Score)

	// Force the 5th marker to be active if score is 5 (or 10 in legacy data)
	const isScoreFive = normalizedScore >= 4

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
			<div className="flex flex-col">
				<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
					Employee Wellbeing Assessment
				</h4>

				<div className="flex flex-col items-center justify-center p-6">
					<div className="mb-6 text-center">
						<div
							className={`rounded-full ${getColorForScore(latestVibe.Vibe_Score)} w-32 h-32 flex items-center justify-center shadow-lg`}
						>
							<span className="text-white text-4xl font-bold">
								{normalizedScore.toFixed(1)}
							</span>
						</div>

						<h3
							className={`text-2xl font-bold mt-4 ${getTextColorForScore(latestVibe.Vibe_Score)}`}
						>
							{getLabelForScore(latestVibe.Vibe_Score)}
						</h3>
					</div>

					<div className="mt-6 flex flex-col items-center w-full max-w-md">
						<div className="flex items-center justify-between w-full mb-2">
							<span className="text-xs text-red-500 font-medium">Critical</span>
							<span className="text-xs text-green-500 font-medium">
								Excellent
							</span>
						</div>

						{/* Colorful bar with gradient background */}
						<div className="w-full h-4 rounded-full mb-4 relative bg-gradient-to-r from-red-500 via-orange-500 via-amber-500 via-lime-500 to-green-500">
							{/* Score marker/indicator */}
							<div
								className="absolute bottom-full mb-1"
								style={{
									left: `${(normalizedScore - 1) * 25 - 1}%`,
									transform: 'translateX(-50%)',
									transition: 'left 0.3s ease-in-out',
								}}
							>
								<div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-transparent border-t-gray-800 dark:border-t-white mx-auto"></div>
							</div>
						</div>

						{/* Score points with colored indicators */}
						<div className="flex justify-between w-full px-0 relative">
							{[1, 2, 3, 4, 5].map(value => {
								// Special case for value 5
								const isActive =
									value === 5 && isScoreFive
										? true
										: value <= Math.ceil(normalizedScore)
								return (
									<div key={value} className="flex flex-col items-center">
										<div
											className={`w-4 h-4 rounded-full mb-1 ${
												isActive
													? getColorForPoint(value)
													: 'bg-gray-200 dark:bg-gray-700'
											}`}
										></div>
										<div
											className={`text-xs font-medium ${
												isActive
													? getTextColorForPoint(value)
													: 'text-gray-500 dark:text-gray-400'
											}`}
										>
											{value}
										</div>
									</div>
								)
							})}
						</div>
					</div>

					<div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg w-full max-w-md">
						<div className="flex justify-between mb-2">
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Current Score
							</p>
							<p
								className={`text-sm font-semibold ${getTextColorForScore(latestVibe.Vibe_Score)}`}
							>
								{normalizedScore.toFixed(1)}/5
							</p>
						</div>

						<div className="flex justify-between">
							<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Last Update
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{formatDate(latestVibe.Response_Date)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
