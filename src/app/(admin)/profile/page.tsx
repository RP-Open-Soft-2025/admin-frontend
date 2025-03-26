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
import { Metadata } from 'next'
import React, { useEffect, useState } from 'react'
import { getProfileData, ProfileApiResponse, getUserMetaData, getUserInfoData, getVibeMeterData, getActivityData, getLeaveData, getPerformanceData, getRewardsData, getOnboardingData } from '@/services/profileService'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { toast } from '@/components/ui/sonner'

// Use a separate metadata file or export metadata from another file
// since we're converting this to a client component
const metadata = {
	title: 'Next.js Profile | TailAdmin - Next.js Dashboard Template',
	description:
		'This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template',
};

export default function Profile() {
	const [profileData, setProfileData] = useState<ProfileApiResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const auth = useSelector((state: RootState) => state.auth);

	useEffect(() => {
		// Check if user is authenticated
		if (!auth.isAuthenticated) {
			console.log('User is not authenticated, redirecting to login');
			router.push('/login');
			return;
		}
		
		async function fetchProfileData() {
			try {
				const data = await getProfileData();
				setProfileData(data);
				setLoading(false);
				
				// Debug logs for component data
				console.log('Profile Data:', {
					onboarding: data.company_data.onboarding,
					activity: data.company_data.activity,
					performance: data.company_data.performance,
					rewards: data.company_data.rewards,
					vibemeter: data.company_data.vibemeter
				});
				
				// Debug logs for transformed data
				console.log('Transformed Data:', {
					onboarding: getOnboardingData(data),
					activity: getActivityData(data),
					performance: getPerformanceData(data),
					rewards: getRewardsData(data),
					vibemeter: getVibeMeterData(data)
				});
			} catch (err: any) {
				const errorMessage = err?.message || 'Failed to load profile data. Please try again later.';
				setError(errorMessage);
				setLoading(false);
				console.error('Error fetching profile:', err);
				
				// Show toast notification for error
				toast({
					type: 'error',
					description: errorMessage
				});
				
				// If authentication error, redirect to login
				if (errorMessage.includes('Authentication') || 
					errorMessage.includes('log in') ||
					errorMessage.includes('401') ||
					errorMessage.includes('expired')) {
					console.log('Authentication error, redirecting to login');
					router.push('/login');
				}
			}
		}

		fetchProfileData();
	}, [auth.isAuthenticated, router]);

	if (loading) {
		return <div className="flex items-center justify-center min-h-screen">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
		</div>;
	}

	if (error) {
		return <div className="flex items-center justify-center min-h-screen">
			<div className="text-red-500">{error}</div>
		</div>;
	}

	if (!profileData) {
		return <div className="flex items-center justify-center min-h-screen">
			<div className="text-gray-500">No profile data available</div>
		</div>;
	}

	return (
		<div>
			<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
				<h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
					Profile
				</h3>
				<div className="space-y-6">
					<UserMetaCard userData={getUserMetaData(profileData)} />
					<UserInfoCard userData={getUserInfoData(profileData)} />
					{/* No address data in API response, but keeping component with dummy data */}
					<UserAddressCard />

					{/* Only render components with data */}
					{profileData.company_data.onboarding.length > 0 && (
						<UserOnboardingCard onboardingData={getOnboardingData(profileData)} />
					)}
					
					{profileData.company_data.activity.length > 0 && (
						<UserActivityCard activityData={getActivityData(profileData)} />
					)}
					
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{profileData.company_data.performance.length > 0 && (
							<UserPerformanceCard performanceData={getPerformanceData(profileData)} />
						)}
						{profileData.company_data.rewards.length > 0 && (
							<UserRewardsCard rewardsData={getRewardsData(profileData)} />
						)}
					</div>

					<UserLeaveCard leaveData={getLeaveData(profileData)} />
					
					{profileData.company_data.vibemeter.length > 0 && (
						<UserVibeMeterCard vibeMeterData={getVibeMeterData(profileData)} />
					)}
				</div>
			</div>
		</div>
	)
}
