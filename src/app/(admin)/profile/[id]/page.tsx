'use client'
import UserAddressCard from '@/components/user-profile/UserAddressCard'
import UserInfoCard from '@/components/user-profile/UserInfoCard'
import UserMetaCard from '@/components/user-profile/UserMetaCard'
import UserActivityCard from '@/components/user-profile/UserActivityCard'
import UserLeaveCard from '@/components/user-profile/UserLeaveCard'
import UserRewardsCard from '@/components/user-profile/UserRewardsCard'
import UserPerformanceCard from '@/components/user-profile/UserPerformanceCard'
import UserOnboardingCard from '@/components/user-profile/UserOnboardingCard'
import UserVibeMeterCard from '@/components/user-profile/UserVibeMeterCard'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function Profile() {
	const params = useParams()
	const id = params.id as string
	useEffect(() => {}, [])
	return (
		<div>
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
					Profile {id}
				</h3>
				<div className="space-y-6">
					<UserMetaCard />
					<UserInfoCard />
					<UserAddressCard />
					<UserOnboardingCard />
					<UserActivityCard />
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<UserPerformanceCard />
						<UserRewardsCard />
					</div>
					<UserLeaveCard />
					<UserVibeMeterCard />
				</div>
			</div>
		</div>
	)
}
