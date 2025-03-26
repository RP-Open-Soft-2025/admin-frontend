'use client'
import React from 'react'
import { departmentAverages } from '@/data/wellbeingData'
import dynamic from 'next/dynamic'
import { ApexOptions } from 'apexcharts'

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
	ssr: false,
})

const DepartmentHeatmap: React.FC = () => {
	// Sort departments by average score
	const sortedDepartments = [...departmentAverages].sort(
		(a, b) => b.averageScore - a.averageScore
	)

	// Get department names and scores for the heatmap
	const departments = sortedDepartments.map(dept => dept.department)
	const scores = sortedDepartments.map(dept => dept.averageScore)
	//const employeeCounts = sortedDepartments.map(dept => dept.employeeCount)

	// Heatmap chart options
	const options: ApexOptions = {
		chart: {
			fontFamily: 'Outfit, sans-serif',
			type: 'heatmap',
			toolbar: {
				show: false,
			},
		},
		dataLabels: {
			enabled: true,
			formatter: function (val: number) {
				return val.toFixed(0)
			},
			style: {
				fontSize: '14px',
				fontWeight: 600,
				colors: ['#fff'],
			},
		},
		stroke: {
			width: 1,
			colors: ['#fff'],
		},
		tooltip: {
			y: {
				formatter: function (val: number) {
					return val.toFixed(0) + ' / 100'
				},
			},
		},
		plotOptions: {
			heatmap: {
				radius: 4,
				enableShades: true,
				shadeIntensity: 0.5,
				colorScale: {
					ranges: [
						{
							from: 0,
							to: 25,
							name: 'Critical',
							color: '#EF4444',
						},
						{
							from: 26,
							to: 50,
							name: 'High Risk',
							color: '#F97316',
						},
						{
							from: 51,
							to: 75,
							name: 'Medium Risk',
							color: '#F59E0B',
						},
						{
							from: 76,
							to: 100,
							name: 'Low Risk',
							color: '#10B981',
						},
					],
				},
			},
		},
		xaxis: {
			categories: ['Wellbeing Score'],
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
				style: {
					fontSize: '13px',
					fontWeight: 500,
				},
			},
		},
		title: {
			text: '',
		},
	}

	// Series data for heatmap
	const series = departments.map((dept, index) => {
		return {
			name: dept,
			data: [
				{
					x: 'Wellbeing Score',
					y: scores[index],
				},
			],
		}
	})

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
			<div className="mb-6">
				<h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
					Department Wellbeing
				</h3>
				<p className="mt-1 text-gray-500 text-sm dark:text-gray-400">
					Average wellbeing scores by department
				</p>
			</div>

			<div className="h-80">
				{typeof window !== 'undefined' && (
					<ReactApexChart
						options={options}
						series={series}
						type="heatmap"
						height={300}
					/>
				)}
			</div>

			<div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
				{sortedDepartments.slice(0, 4).map(dept => (
					<div key={dept.department} className="flex flex-col">
						<span className="text-sm font-medium text-gray-500">
							{dept.department}
						</span>
						<div className="mt-1 flex items-center gap-2">
							<div
								className={`h-2.5 w-2.5 rounded-full ${
									dept.averageScore >= 75
										? 'bg-green-500'
										: dept.averageScore >= 50
											? 'bg-amber-500'
											: dept.averageScore >= 25
												? 'bg-orange-500'
												: 'bg-red-500'
								}`}
							></div>
							<span className="text-base font-semibold text-gray-900 dark:text-white">
								{dept.averageScore}
							</span>
							<span className="text-xs text-gray-500">
								({dept.employeeCount} emp.)
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default DepartmentHeatmap
