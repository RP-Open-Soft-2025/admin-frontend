'use client'
import React from 'react'
import { Onboarding, OnboardingFeedback } from '@/types/employee'

// Props interface
interface UserOnboardingCardProps {
	onboardingData?: Onboarding | null
}

// Dummy data for development
const dummyOnboardingData: Onboarding = {
	joiningDate: '2023-01-10',
	onboardingFeedback: OnboardingFeedback.GOOD,
	mentorAssigned: true,
	initialTrainingCompleted: true,
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserOnboardingCard({
	onboardingData,
}: UserOnboardingCardProps) {
	// Use provided data or fall back to dummy data
	const displayData = onboardingData || dummyOnboardingData

	// Calculate days since joining
	const daysSinceJoining = () => {
		const joiningDate = new Date(displayData.joiningDate)
		const today = new Date()
		const diffTime = Math.abs(today.getTime() - joiningDate.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	// Additional onboarding steps for display
	const onboardingSteps = [
		{ label: 'Documentation Completed', completed: true },
		{ label: 'Access Granted', completed: true },
		{ label: 'Mentor Assigned', completed: displayData.mentorAssigned },
		{
			label: 'Initial Training',
			completed: displayData.initialTrainingCompleted,
		},
		{ label: 'Team Introduction', completed: true },
		{ label: '30-Day Review', completed: daysSinceJoining() > 30 },
	]

	const completedSteps = onboardingSteps.filter(step => step.completed).length
	const progress = Math.round((completedSteps / onboardingSteps.length) * 100)

	// Get color based on onboarding feedback
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

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Onboarding & Integration
					</h4>

					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Joining Date
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{formatDate(displayData.joiningDate)}
							</p>
							<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
								{daysSinceJoining()} days ago
							</p>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Onboarding Feedback
							</p>
							<div className="mt-2 flex items-center">
								<div
									className={`h-3 w-3 rounded-full ${getFeedbackColor(displayData.onboardingFeedback)}`}
								></div>
								<p className="ml-2 text-base font-medium text-gray-800 dark:text-white/90">
									{displayData.onboardingFeedback}
								</p>
							</div>
						</div>

						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Onboarding Progress
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{progress}% Complete
							</p>
							<div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									className="h-2 rounded-full bg-green-500 dark:bg-green-600"
									style={{ width: `${progress}%` }}
								></div>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Onboarding Steps
						</h5>
						<div className="space-y-3">
							{onboardingSteps.map((step, index) => (
								<div key={index} className="flex items-center">
									<div
										className={`flex h-6 w-6 items-center justify-center rounded-full border ${
											step.completed
												? 'border-green-500 bg-green-100 dark:border-green-500 dark:bg-green-900/30'
												: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'
										}`}
									>
										{step.completed && (
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
											step.completed
												? 'text-gray-800 dark:text-white/90'
												: 'text-gray-500 dark:text-gray-400'
										}`}
									>
										{step.label}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
