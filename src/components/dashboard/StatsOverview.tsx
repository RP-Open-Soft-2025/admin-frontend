import React from 'react'

interface StatsOverviewProps {
	totalUsers: number | 'UNAVAILABLE'
	activeUsers: number | 'UNAVAILABLE'
	totalSessions: number | 'UNAVAILABLE'
	activeSessions: number | 'UNAVAILABLE'
	pendingSessions: number | 'UNAVAILABLE'
	totalMeets: number | 'UNAVAILABLE'
	isLoading?: boolean
}

const StatsOverview = ({
	totalUsers,
	activeUsers,
	totalSessions,
	activeSessions,
	pendingSessions,
	totalMeets,
	isLoading = false,
}: StatsOverviewProps) => {
	const formatStat = (stat: number | 'UNAVAILABLE') => {
		if (stat === 'UNAVAILABLE') return 'UNAVAILABLE'
		return stat.toLocaleString()
	}

	const cards = [
		{
			title: 'Total Employees',
			value: formatStat(totalUsers),
			bgClass: 'bg-blue-500/10',
			textClass: 'text-blue-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
		},
		{
			title: 'Active Employees',
			value: formatStat(activeUsers),
			bgClass: 'bg-green-500/10',
			textClass: 'text-green-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			),
		},
		{
			title: 'Total Sessions',
			value: formatStat(totalSessions),
			bgClass: 'bg-purple-500/10',
			textClass: 'text-purple-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					<path d="M7 7h10" />
					<path d="M7 12h10" />
					<path d="M7 17h10" />
				</svg>
			),
		},
		{
			title: 'Active Sessions',
			value: formatStat(activeSessions),
			bgClass: 'bg-indigo-500/10',
			textClass: 'text-indigo-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<path d="M21 15V6" />
					<path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
					<path d="M12 12H3" />
					<path d="M16 6H3" />
					<path d="M12 18H3" />
				</svg>
			),
		},
		{
			title: 'Scheuled Sessions',
			value: formatStat(pendingSessions),
			bgClass: 'bg-amber-500/10',
			textClass: 'text-amber-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<circle cx="12" cy="12" r="10" />
					<line x1="12" x2="12" y1="8" y2="12" />
					<line x1="12" x2="12.01" y1="16" y2="16" />
				</svg>
			),
		},
		{
			title: 'Total Meetings',
			value: formatStat(totalMeets),
			bgClass: 'bg-rose-500/10',
			textClass: 'text-rose-500',
			icon: (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-5"
				>
					<rect width="18" height="18" x="3" y="3" rx="2" />
					<path d="M8 12h8" />
					<path d="M12 8v8" />
				</svg>
			),
		},
	]

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{[...Array(6)].map((_, index) => (
					<div
						key={index}
						className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
					>
						<div className="flex h-full animate-pulse flex-col justify-between">
							<div className="flex justify-between">
								<div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
								<div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
							</div>
							<div className="mt-4 h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{cards.map((card, index) => (
				<div
					key={index}
					className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
				>
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
							{card.title}
						</p>
						<div
							className={`${card.bgClass} rounded-full p-2 ${card.textClass}`}
						>
							{card.icon}
						</div>
					</div>
					<div className="mt-4">
						<h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
							{card.value}
						</h3>
					</div>
				</div>
			))}
		</div>
	)
}

export default StatsOverview
