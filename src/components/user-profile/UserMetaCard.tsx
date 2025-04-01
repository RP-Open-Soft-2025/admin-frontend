'use client'
import React from 'react'
import Image from 'next/image'

// Props interface
interface UserMetaCardProps {
	userData?: {
		name: string
		bio: string
		location: {
			city: string
			country: string
		}
		email: string
		socialLinks: {
			facebook: string
			twitter: string
			linkedin: string
			instagram: string
		}
		profileImage?: string
	}
}

// Dummy data for development
const dummyUserData = {
	name: 'Musharof Chowdhury',
	bio: 'Team Manager',
	location: {
		city: 'Arizona',
		country: 'United States',
	},
	email: '',
	socialLinks: {
		facebook: 'https://www.facebook.com/PimjoHQ',
		twitter: 'https://x.com/PimjoHQ',
		linkedin: 'https://www.linkedin.com/company/pimjo',
		instagram: 'https://instagram.com/PimjoHQ',
	},
}

export default function UserMetaCard({ userData }: UserMetaCardProps) {
	// Use provided data or fall back to dummy data
	const displayData = userData || dummyUserData

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex flex-col items-center w-full gap-6 xl:flex-row">
					<div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
						<Image
							width={80}
							height={80}
							src="/images/user/owner.jpg"
							alt={displayData.name}
						/>
					</div>
					<div className="order-3 xl:order-2">
						<h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
							{displayData.name}
						</h4>
						<div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								{displayData.email}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
