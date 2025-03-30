'use client'
import React from 'react'
import { Reward, AwardType } from '@/types/UserProfile'

// Props interface
interface UserRewardsCardProps {
	rewardsData?: Reward[]
}

// Dummy data for development
const dummyRewardsData: Reward[] = [
	{
		Award_Type: AwardType.STAR_PERFORMER,
		Award_Date: '2023-03-15',
		Reward_Points: 500,
	},
	{
		Award_Type: AwardType.BEST_TEAM_PLAYER,
		Award_Date: '2023-06-30',
		Reward_Points: 300,
	},
	{
		Award_Type: AwardType.INNOVATION,
		Award_Date: '2023-09-22',
		Reward_Points: 450,
	},
	{
		Award_Type: AwardType.LEADERSHIP,
		Award_Date: '2023-12-10',
		Reward_Points: 400,
	},
]

// Map award types to icons (dummy paths, would need real icons)
// const awardIcons = {
// 	[AwardType.STAR_PERFORMER]: '/images/icons/star.svg',
// 	[AwardType.BEST_TEAM_PLAYER]: '/images/icons/team.svg',
// 	[AwardType.INNOVATION]: '/images/icons/innovation.svg',
// 	[AwardType.LEADERSHIP]: '/images/icons/leadership.svg',
// }

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserRewardsCard({ rewardsData }: UserRewardsCardProps) {
	// Use provided data or fall back to dummy data
	const displayData = rewardsData || dummyRewardsData

	// Get total reward points
	const totalRewardPoints = displayData.reduce(
		(total, reward) => total + reward.Reward_Points,
		0
	)

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:mb-6">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Awards & Achievements
						</h4>
						<div className="mt-2 sm:mt-0">
							<span className="text-xs text-gray-500 dark:text-gray-400">
								Total Reward Points:
							</span>
							<span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">
								{totalRewardPoints}
							</span>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{displayData.map((reward, index) => (
							<div
								key={index}
								className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
							>
								<div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
									{/* Using a fallback icon display since we don't have actual icons */}
									<div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
										{reward.Award_Type.charAt(0)}
									</div>
								</div>
								<h5 className="mb-1 text-center text-sm font-medium text-gray-800 dark:text-white/90">
									{reward.Award_Type}
								</h5>
								<p className="text-center text-xs text-gray-500 dark:text-gray-400">
									{formatDate(reward.Award_Date)}
								</p>
								<div className="mt-2 flex items-center justify-center">
									<svg
										className="h-4 w-4 text-yellow-500"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
									<span className="ml-1 text-xs font-medium text-gray-800 dark:text-white/90">
										{reward.Reward_Points} pts
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Rewards Progress
						</h5>
						<div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700">
							<div
								className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
								style={{ width: `${(totalRewardPoints / 2000) * 100}%` }}
							></div>
						</div>
						<div className="mt-2 flex justify-between">
							<span className="text-xs text-gray-500 dark:text-gray-400">
								Current: {totalRewardPoints}
							</span>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								Goal: 2000
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
