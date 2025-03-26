'use client'
import React from 'react'
import { employeeData } from '@/data/wellbeingData'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const RiskAssessment: React.FC = () => {
	// Calculate risk categories
	const criticalCount = employeeData.filter(
		emp => emp.riskLevel === 'Critical'
	).length
	const highCount = employeeData.filter(emp => emp.riskLevel === 'High').length
	const mediumCount = employeeData.filter(
		emp => emp.riskLevel === 'Medium'
	).length
	const lowCount = employeeData.filter(emp => emp.riskLevel === 'Low').length

	// Pie chart options
	const options: ApexOptions = {
		chart: {
			fontFamily: 'Outfit, sans-serif',
			type: 'donut',
		},
		labels: ['Critical', 'High', 'Medium', 'Low'],
		colors: ['#EF4444', '#F97316', '#F59E0B', '#10B981'],
		plotOptions: {
			pie: {
				donut: {
					size: '65%',
					labels: {
						show: true,
						name: {
							show: true,
							fontSize: '14px',
							fontWeight: 600,
						},
						value: {
							show: true,
							fontSize: '16px',
							fontWeight: 600,
							formatter: function (val) {
								return val.toString()
							},
						},
						total: {
							show: true,
							label: 'Total',
							formatter: function (w) {
								return w.globals.seriesTotals
									.reduce((a: number, b: number) => a + b, 0)
									.toString()
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
			position: 'bottom',
			horizontalAlign: 'center',
			fontSize: '14px',
			markers: {
				radius: 12,
			},
			itemMargin: {
				horizontal: 8,
				vertical: 8,
			},
		},
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 250,
					},
					legend: {
						position: 'bottom',
					},
				},
			},
		],
		tooltip: {
			y: {
				formatter: function (val) {
					return val + ' employees'
				},
			},
		},
	}

	// Pie chart series data
	const series = [criticalCount, highCount, mediumCount, lowCount]

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-4">
				<h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
					Risk Assessment
				</h3>
				<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
					Classification based on Vibemeter scores
				</p>
			</div>

			<div className="h-80">
				{typeof window !== 'undefined' && (
					<ReactApexChart
						options={options}
						series={series}
						type="donut"
						height={280}
					/>
				)}
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4">
				<div className="flex items-center space-x-2">
					<div className="h-3 w-3 rounded-full bg-red-500"></div>
					<span className="text-sm font-medium">Critical: Score &lt; 25</span>
				</div>
				<div className="flex items-center space-x-2">
					<div className="h-3 w-3 rounded-full bg-orange-500"></div>
					<span className="text-sm font-medium">High: Score 25-49</span>
				</div>
				<div className="flex items-center space-x-2">
					<div className="h-3 w-3 rounded-full bg-amber-500"></div>
					<span className="text-sm font-medium">Medium: Score 50-74</span>
				</div>
				<div className="flex items-center space-x-2">
					<div className="h-3 w-3 rounded-full bg-green-500"></div>
					<span className="text-sm font-medium">Low: Score 75+</span>
				</div>
			</div>
		</div>
	)
}

export default RiskAssessment
