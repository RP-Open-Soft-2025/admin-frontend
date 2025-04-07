import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface UserRoleChartProps {
	users: {
		total_admins: number
		total_hrs: number
		total_employees: number
		active_employees: number
	}
	isLoading: boolean
}

const UserRoleChart = ({ users, isLoading = false }: UserRoleChartProps) => {
	const series = [users.total_employees, users.total_hrs, users.total_admins]
	const labels = ['Employees', 'HRs', 'Admins']

	const options: ApexOptions = {
		chart: {
			type: 'donut' as const,
		},
		labels,
		colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
		plotOptions: {
			pie: {
				donut: {
					size: '55%',
					labels: {
						show: true,
						name: {
							show: true,
						},
						value: {
							show: true,
							formatter: (val: string) => val,
						},
						total: {
							show: true,
							showAlways: true,
							label: 'Total Employees',
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							formatter: (w: any) => {
								return w.globals.seriesTotals.reduce(
									(a: number, b: number) => a + b,
									0
								)
							},
						},
					},
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: 'bottom' as const,
			horizontalAlign: 'center' as const,
			fontSize: '14px',
			markers: {
				size: 12,
				strokeWidth: 12,
			},
			itemMargin: {
				horizontal: 10,
				vertical: 0,
			},
		},
		tooltip: {
			enabled: true,
			y: {
				formatter: (val: number) => `${val} users`,
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 300,
					},
					legend: {
						position: 'bottom',
					},
				},
			},
		],
	}

	if (isLoading) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Employees Distribution by Role
					</h3>
				</div>
				<div className="flex h-80 items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
				</div>
			</div>
		)
	}

	return (
		<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Employees Distribution by Role
				</h3>
			</div>
			<div className="h-80">
				{typeof window !== 'undefined' && (
					<Chart options={options} series={series} type="donut" height="100%" />
				)}
			</div>
		</div>
	)
}

export default UserRoleChart
