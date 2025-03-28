import React from 'react'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface SessionStatusChartProps {
	activeSessions: number | 'UNAVAILABLE'
	pendingSessions: number | 'UNAVAILABLE'
	completedSessions: number | 'UNAVAILABLE'
	isLoading?: boolean
}

const SessionStatusChart = ({
	activeSessions,
	pendingSessions,
	completedSessions,
	isLoading = false,
}: SessionStatusChartProps) => {
	// Process data for the chart
	const getChartData = () => {
		// Default to 0 if unavailable
		const active = activeSessions === 'UNAVAILABLE' ? 0 : activeSessions
		const pending = pendingSessions === 'UNAVAILABLE' ? 0 : pendingSessions
		const completed =
			completedSessions === 'UNAVAILABLE' ? 0 : completedSessions

		return {
			series: [
				{
					name: 'Sessions',
					data: [active, pending, completed],
				},
			],
			categories: ['Active', 'Pending', 'Completed'],
		}
	}

	const { series, categories } = getChartData()

	const options: ApexOptions = {
		chart: {
			type: 'radar' as const,
			toolbar: {
				show: false,
			},
			dropShadow: {
				enabled: true,
				blur: 1,
				left: 1,
				top: 1,
			},
		},
		colors: ['#4F46E5'],
		markers: {
			size: 5,
			colors: ['#4F46E5'],
			strokeColors: '#FFFFFF',
			strokeWidth: 1,
		},
		stroke: {
			width: 2,
		},
		fill: {
			opacity: 0.2,
		},
		xaxis: {
			categories: categories,
			labels: {
				style: {
					fontSize: '14px',
					fontWeight: 500,
				},
			},
		},
		yaxis: {
			show: false,
		},
		plotOptions: {
			radar: {
				polygons: {
					strokeColors: '#E5E7EB',
					strokeWidth: '1px',
					connectorColors: '#E5E7EB',
					fill: {
						colors: ['#F9FAFB', '#F3F4F6'],
					},
				},
			},
		},
		dataLabels: {
			enabled: true,
			background: {
				enabled: true,
				borderRadius: 4,
				borderWidth: 1,
				borderColor: '#FFFFFF',
				padding: 4,
			},
			style: {
				fontSize: '14px',
				fontWeight: 'bold',
			},
			formatter: function (val: number) {
				return val.toString()
			},
		},
		tooltip: {
			y: {
				formatter: function (val: number) {
					return val.toString() + ' sessions'
				},
			},
		},
		theme: {
			mode: 'light' as const,
		},
	}

	if (isLoading) {
		return (
			<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Session Status Distribution
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
					Session Status Distribution
				</h3>
			</div>
			<div className="h-80">
				{typeof window !== 'undefined' && (
					<Chart options={options} series={series} type="radar" height="100%" />
				)}
			</div>
		</div>
	)
}

export default SessionStatusChart
