'use client'
import React from 'react'

// Props interface
interface UserAddressCardProps {
	addressData?: {
		country: string
		city: string
		state: string
		postalCode: string
		taxId: string
	}
}

// Dummy data for development
const dummyAddressData = {
	country: 'United States',
	city: 'Phoenix',
	state: 'Arizona',
	postalCode: 'ERT 2489',
	taxId: 'AS4568384',
}

export default function UserAddressCard({ addressData }: UserAddressCardProps) {
	// Use provided data or fall back to dummy data
	const displayData = addressData || dummyAddressData

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
						Address
					</h4>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Country
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{displayData.country}
							</p>
						</div>

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								City/State
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{displayData.city}, {displayData.state}, {displayData.country}
							</p>
						</div>

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								Postal Code
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{displayData.postalCode}
							</p>
						</div>

						<div>
							<p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
								TAX ID
							</p>
							<p className="text-sm font-medium text-gray-800 dark:text-white/90">
								{displayData.taxId}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
