'use client'

// import UserAddressCard from '@/components/user-profile/UserAddressCard'
import UserInfoCard from '@/components/user-profile/UserInfoCard'
import UserMetaCard from '@/components/user-profile/UserMetaCard'
import UserActivityCard from '@/components/user-profile/UserActivityCard'
import UserLeaveCard from '@/components/user-profile/UserLeaveCard'
import UserRewardsCard from '@/components/user-profile/UserRewardsCard'
import UserPerformanceCard from '@/components/user-profile/UserPerformanceCard'
import UserOnboardingCard from '@/components/user-profile/UserOnboardingCard'
import UserVibeMeterCard from '@/components/user-profile/UserVibeMeterCard'
import UserSessionsCard from '@/components/user-profile/UserSessionsCard'
import React, { useEffect, useState } from 'react'
import {
	getUserProfileData,
	getVibeMeterData,
	getActivityData,
	getPerformanceData,
	getRewardsData,
	getOnboardingData,
} from '@/services/profileService'
import { useParams, useRouter } from 'next/navigation'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import { EmployeeAPI } from '@/types/UserProfile'
import { DEL_TIME } from '@/constants'

export default function Profile() {
	const [profileData, setProfileData] = useState<EmployeeAPI | null>()
	const params = useParams()
	const id = params.id as string
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const { auth } = store.getState()

	useEffect(() => {
		const fetchData = async () => {
			if (!auth.isAuthenticated) {
				router.push('/login')
				return
			}

			if (!id) {
				console.error('No ID provided')
				return
			}

			setLoading(true)
			try {
				const data = await getUserProfileData(id)
				setProfileData(data)
				setLoading(false)

				// Debug logs for component data
				console.log('Profile Data:', {
					onboarding: data.company_data.onboarding,
					activity: data.company_data.activity,
					performance: data.company_data.performance,
					rewards: data.company_data.rewards,
					vibemeter: data.company_data.vibemeter,
					leave: data.company_data.leave,
				})

				// Debug logs for transformed data
				console.log('Transformed Data:', {
					onboarding: getOnboardingData(data),
					activity: getActivityData(data),
					performance: getPerformanceData(data),
					rewards: getRewardsData(data),
					vibemeter: getVibeMeterData(data),
				})
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (err: any) {
				const errorMessage =
					err?.message || 'Failed to load profile data. Please try again later.'
				setError(errorMessage)
				setLoading(false)
				console.error('Error fetching profile:', err)

				// Show toast notification for error
				toast({
					type: 'error',
					description: errorMessage,
				})

				// If authentication error, redirect to login
				if (
					errorMessage.includes('Authentication') ||
					errorMessage.includes('log in') ||
					errorMessage.includes('401') ||
					errorMessage.includes('expired')
				) {
					console.log('Authentication error, redirecting to login')
					router.push('/login')
				}
			}
		}

		// Initial fetch
		fetchData()

		const intervalId = setInterval(() => {
			fetchData()
		}, DEL_TIME)

		return () => clearInterval(intervalId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading && profileData == null) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-red-500">{error}</div>
			</div>
		)
	}

	if (!profileData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-gray-500">No profile data available</div>
			</div>
		)
	}

	return (
		<div>
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
					Profile
				</h3>
				<div className="space-y-6">
					<UserMetaCard userData={profileData} />
					{auth.user && (
						<UserSessionsCard
							employeeId={profileData.employee_id}
							role={auth.user.userRole!}
						/>
					)}
					<UserInfoCard userData={profileData} />

					{/* Only render components with data */}
					{profileData.company_data.onboarding.length > 0 && (
						<UserOnboardingCard
							onboardingData={getOnboardingData(profileData)}
						/>
					)}

					{profileData.company_data.activity.length > 0 && (
						<UserActivityCard activityData={getActivityData(profileData)} />
					)}

					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{profileData.company_data.performance.length > 0 && (
							<UserPerformanceCard
								performanceData={getPerformanceData(profileData)}
							/>
						)}
						{profileData.company_data.rewards.length > 0 && (
							<UserRewardsCard rewardsData={getRewardsData(profileData)} />
						)}
					</div>

					{profileData.company_data.leave.length > 0 && (
						<UserLeaveCard leaveData={profileData.company_data.leave} />
					)}

					{profileData.company_data.vibemeter.length > 0 && (
						<>
							<UserVibeMeterCard
								vibeMeterData={getVibeMeterData(profileData)}
							/>
						</>
					)}

					{/* Sessions Section */}
				</div>
			</div>
		</div>
	)
}
