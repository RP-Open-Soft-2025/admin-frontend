'use client'
import React from 'react'
import { getPriorityEmployees } from '@/data/wellbeingData'
import {
	ArrowUpRightIcon,
	ArrowDownRightIcon,
	MinusIcon,
} from '@heroicons/react/24/solid'

const PriorityEmployees: React.FC = () => {
	const priorityEmployees = getPriorityEmployees()

	// Helper function to get badge color based on risk level
	const getRiskBadgeColor = (riskLevel: string) => {
		switch (riskLevel) {
			case 'Critical':
				return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
			case 'High':
				return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
			case 'Medium':
				return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
			default:
				return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
		}
	}

	// Helper function to format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		})
	}

	// Helper function to get trend icon
	const getTrendIcon = (trend: string) => {
		switch (trend) {
			case 'up':
				return <ArrowUpRightIcon className="h-4 w-4 text-green-500" />
			case 'down':
				return <ArrowDownRightIcon className="h-4 w-4 text-red-500" />
			default:
				return <MinusIcon className="h-4 w-4 text-gray-500" />
		}
	}

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
					Priority Employees
				</h3>
				<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
					Employees with concerning wellbeing scores
				</p>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead>
						<tr>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Employee
							</th>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Department
							</th>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Score
							</th>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Risk Level
							</th>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Trend
							</th>
							<th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
								Last Active
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{priorityEmployees.map(employee => (
							<tr
								key={employee.id}
								className="hover:bg-gray-50 dark:hover:bg-white/[0.02]"
							>
								<td className="whitespace-nowrap px-3 py-4 text-sm">
									<div className="font-medium text-gray-900 dark:text-white">
										{employee.name}
									</div>
									<div className="text-gray-500 dark:text-gray-400">
										{employee.role}
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
									{employee.department}
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm">
									<div
										className={`font-medium ${employee.vibemeterScore < 25 ? 'text-red-600' : 'text-orange-500'}`}
									>
										{employee.vibemeterScore}/100
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm">
									<span
										className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getRiskBadgeColor(employee.riskLevel)}`}
									>
										{employee.riskLevel}
									</span>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
									<div className="flex items-center">
										{getTrendIcon(employee.recentTrend)}
										<span className="ml-1">{employee.recentTrend}</span>
									</div>
								</td>
								<td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
									{formatDate(employee.lastActive)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4 flex justify-end">
				<button className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
					View all employees →
				</button>
			</div>
		</div>
	)
}

export default PriorityEmployees
