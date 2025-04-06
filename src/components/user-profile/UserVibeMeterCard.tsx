'use client'
import React from 'react'
import { VibeMeter } from '@/types/UserProfile'
import { BarChart } from 'lucide-react'

// Props interface
interface UserVibeMeterCardProps {
	vibeMeterData: VibeMeter[]
}

export default function UserVibeMeterCard({
	vibeMeterData,
}: UserVibeMeterCardProps) {
	return (
		<div className="h-full p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-900">
			<div className="flex flex-col">
				<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6 flex items-center">
					<BarChart className="size-5 mr-2" />
					Mood & Vibe Statistics
				</h4>

				<div className="grid gap-4">
					{vibeMeterData?.[0] && (
						<div className="flex flex-col items-center justify-center p-6">
							<div className="mb-6 text-center">
								{/* Determine color based on score */}
								{(() => {
									const score = vibeMeterData[0].Vibe_Score
									const normalizedScore = score > 5 ? score / 2 : score

									const getColorForScore = () => {
										if (normalizedScore >= 4.5) return 'bg-emerald-500'
										if (normalizedScore >= 3.5) return 'bg-blue-500'
										if (normalizedScore >= 2.5) return 'bg-amber-500'
										if (normalizedScore >= 1.5) return 'bg-orange-500'
										return 'bg-red-500'
									}

									const getTextColorForScore = () => {
										if (normalizedScore >= 4.5)
											return 'text-emerald-600 dark:text-emerald-400'
										if (normalizedScore >= 3.5)
											return 'text-blue-600 dark:text-blue-400'
										if (normalizedScore >= 2.5)
											return 'text-amber-600 dark:text-amber-400'
										if (normalizedScore >= 1.5)
											return 'text-orange-600 dark:text-orange-400'
										return 'text-red-600 dark:text-red-400'
									}

									const getLabelForScore = () => {
										if (normalizedScore >= 4.5) return 'Excellent'
										if (normalizedScore >= 3.5) return 'Good'
										if (normalizedScore >= 2.5) return 'Satisfactory'
										if (normalizedScore >= 1.5) return 'Needs Improvement'
										return 'Critical'
									}

									return (
										<>
											<div
												className={`rounded-full ${getColorForScore()} size-32 flex items-center justify-center shadow-lg`}
											>
												<span className="text-white text-4xl font-bold">
													{normalizedScore.toFixed(1)}
												</span>
											</div>

											<h3
												className={`text-2xl font-bold mt-4 ${getTextColorForScore()}`}
											>
												{getLabelForScore()}
											</h3>
										</>
									)
								})()}
							</div>

							<div className="mt-6 flex flex-col items-center w-full max-w-md">
								<div className="flex items-center justify-between w-full mb-2 p-1">
									<span className="text-xs text-red-500 font-medium">
										Critical
									</span>
									<span className="text-xs text-emerald-500 font-medium">
										Excellent
									</span>
								</div>

								{/* Colorful bar with gradient background */}
								<div className="w-full h-4 rounded-full mb-4 relative bg-gradient-to-r from-red-500 via-orange-500 via-amber-500 via-blue-500 to-emerald-500">
									{/* Score marker/indicator */}
									<div
										className="absolute bottom-full mb-1"
										style={{
											left: `calc(${(vibeMeterData[0].Vibe_Score - 1) * 25 - (vibeMeterData[0].Vibe_Score - 3) / 2}% - 8px)`,
											transition: 'left 0.3s ease-in-out',
										}}
									>
										<div className="size-0 border-x-[8px] border-t-[8px] border-transparent border-t-gray-800 dark:border-t-white mx-auto" />
									</div>
								</div>

								{/* Score points with colored indicators */}
								<div className="flex justify-between w-full px-0 relative">
									{[1, 2, 3, 4, 5].map(value => {
										const score = vibeMeterData[0].Vibe_Score
										const normalizedScore = score

										const getColorForPoint = (point: number) => {
											switch (point) {
												case 1:
													return 'bg-red-500 dark:bg-red-600'
												case 2:
													return 'bg-orange-500 dark:bg-orange-600'
												case 3:
													return 'bg-amber-500 dark:bg-amber-600'
												case 4:
													return 'bg-green-500 dark:bg-green-600'
												case 5:
													return 'bg-emerald-500 dark:bg-emerald-600'
												default:
													return 'bg-gray-400 dark:bg-gray-600'
											}
										}

										const getTextColorForPoint = (point: number) => {
											switch (point) {
												case 1:
													return 'text-red-600 dark:text-red-400'
												case 2:
													return 'text-orange-600 dark:text-orange-400'
												case 3:
													return 'text-amber-600 dark:text-amber-400'
												case 4:
													return 'text-green-600 dark:text-green-400'
												case 5:
													return 'text-emerald-600 dark:text-emerald-400'
												default:
													return 'text-gray-600 dark:text-gray-400'
											}
										}

										return (
											<div key={value} className="flex flex-col items-center">
												<div
													className={`size-4 rounded-full mb-1 ${getColorForPoint(value)}`}
												/>
												<div
													className={`text-xs font-medium ${getTextColorForPoint(value)}`}
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
										className={`text-sm font-semibold ${(() => {
											const score = vibeMeterData[0].Vibe_Score
											const normalizedScore = score > 5 ? score / 2 : score

											if (normalizedScore >= 4.5)
												return 'text-emerald-600 dark:text-emerald-400'
											if (normalizedScore >= 3.5)
												return 'text-blue-600 dark:text-blue-400'
											if (normalizedScore >= 2.5)
												return 'text-amber-600 dark:text-amber-400'
											if (normalizedScore >= 1.5)
												return 'text-orange-600 dark:text-orange-400'
											return 'text-red-600 dark:text-red-400'
										})()}`}
									>
										{(vibeMeterData[0].Vibe_Score > 5
											? vibeMeterData[0].Vibe_Score / 2
											: vibeMeterData[0].Vibe_Score
										).toFixed(1)}
										/5
									</p>
								</div>

								<div className="flex justify-between">
									<p className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Last Update
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										{new Date(
											vibeMeterData[0].Response_Date
										).toLocaleDateString('en-GB', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
										})}
									</p>
								</div>
							</div>
						</div>
					)}

					{!vibeMeterData?.[0] && (
						<div className="flex flex-col items-center justify-center py-6 text-center">
							<div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-full mb-3">
								<BarChart className="size-10 text-muted-foreground" />
							</div>
							<p className="text-sm text-muted-foreground">
								No vibe data available yet
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
