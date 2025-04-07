'use client'
import React from 'react'
import { Onboarding, OnboardingFeedback } from '@/types/UserProfile'

// Props interface
interface UserOnboardingCardProps {
	onboardingData?: Onboarding | null
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(new Date(dateString).getTime() + 19800000)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

// Helper function to calculate days since joining
const calculateDaysSinceJoining = (joiningDate: string) => {
	const date = new Date(joiningDate)
	const today = new Date()
	const diffTime = Math.abs(today.getTime() - date.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	return diffDays
}

// Helper function to get feedback color
const getFeedbackColor = (feedback: OnboardingFeedback) => {
	switch (feedback) {
		case OnboardingFeedback.EXCELLENT:
			return 'bg-green-500 dark:bg-green-600'
		case OnboardingFeedback.GOOD:
			return 'bg-blue-500 dark:bg-blue-600'
		case OnboardingFeedback.AVERAGE:
			return 'bg-yellow-500 dark:bg-yellow-600'
		case OnboardingFeedback.POOR:
			return 'bg-red-500 dark:bg-red-600'
		default:
			return 'bg-gray-500 dark:bg-gray-600'
	}
}

export default function UserOnboardingCard({
	onboardingData,
}: UserOnboardingCardProps) {
	if (!onboardingData) return null

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Onboarding & Integration
					</h4>

					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Joining Date
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{formatDate(onboardingData.Joining_Date)}
							</p>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								{calculateDaysSinceJoining(onboardingData.Joining_Date)} days
								ago
							</p>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Onboarding Feedback
							</p>
							<div className="mt-2 flex items-center">
								<div
									className={`h-3 w-3 rounded-full ${getFeedbackColor(onboardingData.Onboarding_Feedback)}`}
								></div>
								<p className="ml-2 text-base font-medium text-gray-800 dark:text-white/90">
									{onboardingData.Onboarding_Feedback}
								</p>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Onboarding Status
						</h5>
						<div className="space-y-3">
							<div className="flex items-center">
								<div
									className={`flex h-6 w-6 items-center justify-center rounded-full border ${
										onboardingData.Mentor_Assigned
											? 'border-green-500 bg-green-100 dark:border-green-500 dark:bg-green-900/30'
											: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
									}`}
								>
									{onboardingData.Mentor_Assigned && (
										<svg
											className="h-4 w-4 text-green-500 dark:text-green-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</div>
								<p
									className={`ml-3 text-sm ${
										onboardingData.Mentor_Assigned
											? 'text-gray-800 dark:text-white/90'
											: 'text-gray-500 dark:text-gray-400'
									}`}
								>
									Mentor Assigned
								</p>
							</div>

							<div className="flex items-center">
								<div
									className={`flex h-6 w-6 items-center justify-center rounded-full border ${
										onboardingData.Initial_Training_Completed
											? 'border-green-500 bg-green-100 dark:border-green-500 dark:bg-green-900/30'
											: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
									}`}
								>
									{onboardingData.Initial_Training_Completed && (
										<svg
											className="h-4 w-4 text-green-500 dark:text-green-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</div>
								<p
									className={`ml-3 text-sm ${
										onboardingData.Initial_Training_Completed
											? 'text-gray-800 dark:text-white/90'
											: 'text-gray-500 dark:text-gray-400'
									}`}
								>
									Initial Training Completed
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
