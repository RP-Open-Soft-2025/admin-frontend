'use client'
import React from 'react'
import {
	calculateOverallMetrics,
	engagementHistory,
} from '@/data/wellbeingData'
import { Bar } from 'react-chartjs-2'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'
import { ArrowUpIcon } from '@heroicons/react/24/solid'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const EngagementRate: React.FC = () => {
	const metrics = calculateOverallMetrics()

	// Chart options
	const options: ApexOptions = {
		chart: {
			fontFamily: 'Outfit, sans-serif',
			toolbar: {
				show: false,
			},
			zoom: {
				enabled: false,
			},
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				horizontal: true,
				barHeight: '70%',
				distributed: false,
			},
		},
		dataLabels: {
			enabled: false,
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar'],
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			labels: {
				show: false,
			},
		},
		grid: {
			show: false,
		},
		colors: ['#4F46E5', '#818CF8', '#A5B4FC'],
		tooltip: {
			enabled: true,
			y: {
				formatter: function (val) {
					return val + '%'
				},
			},
		},
		legend: {
			show: false,
		},
	}

	// Last 3 months of engagement data for the chart
	const lastThreeMonths = engagementHistory.slice(-3)
	const series = [
		{
			name: 'Engagement Rate',
			data: lastThreeMonths.map(item => item.rate),
		},
	]

	// Calculate stats
	const currentRate = metrics.avgEngagementRate
	const previousRate = engagementHistory[engagementHistory.length - 2].rate
	const changePercentage = Math.round(
		((currentRate - previousRate) / previousRate) * 100
	)
	const isPositive = changePercentage >= 0

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4">
				<div className="flex items-center justify-between">
					<h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
						Engagement Rate
					</h3>
					<div className="flex items-center gap-1">
						<span
							className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}
						>
							{isPositive ? '+' : ''}
							{changePercentage}%
						</span>
						{isPositive && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
					</div>
				</div>
				<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
					Employee session activity metrics
				</p>
			</div>

			<div className="mt-3">
				<div className="flex items-center justify-between">
					<span className="text-4xl font-bold text-indigo-600">
						{currentRate}%
					</span>
					<span className="text-sm text-gray-500">Last 30 days</span>
				</div>
			</div>

			<div className="mt-6">
				<div className="mb-2 flex items-center justify-between">
					<span className="text-sm font-medium text-gray-500">
						Last 3 months trend
					</span>
				</div>
				<div className="h-40">
					{typeof window !== 'undefined' && (
						<ReactApexChart
							options={options}
							series={series}
							type="bar"
							height={160}
						/>
					)}
				</div>
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4">
				<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Active Users
					</p>
					<p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
						{Math.round(metrics.totalEmployees * (currentRate / 100))}
					</p>
				</div>
				<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/30">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Inactive Users
					</p>
					<p className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
						{Math.round(metrics.totalEmployees * (1 - currentRate / 100))}
					</p>
				</div>
			</div>
		</div>
	)
}

export default EngagementRate
