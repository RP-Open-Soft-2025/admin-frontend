import React, { useEffect, useState } from 'react'
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
	// State to track the current theme
	const [isDarkMode, setIsDarkMode] = useState(false)

	// Effect to detect and watch for theme changes
	useEffect(() => {
		// Check initial theme
		setIsDarkMode(document.documentElement.classList.contains('dark'))

		// Create observer to watch for theme changes
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (
					mutation.attributeName === 'class' &&
					mutation.target === document.documentElement
				) {
					setIsDarkMode(document.documentElement.classList.contains('dark'))
				}
			})
		})

		// Start observing
		observer.observe(document.documentElement, { attributes: true })

		// Cleanup
		return () => observer.disconnect()
	}, [])

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

	// Color settings based on theme
	const lineColor = isDarkMode ? '#818cf8' : '#4F46E5' // Lighter indigo in dark mode
	const markerColor = isDarkMode ? '#818cf8' : '#4F46E5'
	const fillOpacity = isDarkMode ? 0.3 : 0.2 // Slightly higher opacity in dark mode

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
				opacity: isDarkMode ? 0.2 : 0.1,
				color: isDarkMode ? '#ffffff' : '#000000',
			},
			background: isDarkMode ? '#1f2937' : '#ffffff',
		},
		colors: [lineColor],
		markers: {
			size: 6, // Slightly larger markers for better visibility
			colors: [markerColor],
			strokeColors: isDarkMode ? '#ffffff' : '#FFFFFF',
			strokeWidth: isDarkMode ? 2 : 1, // Thicker stroke in dark mode
		},
		stroke: {
			width: isDarkMode ? 3 : 2, // Thicker lines in dark mode
			colors: [lineColor],
		},
		fill: {
			opacity: fillOpacity,
			colors: [lineColor],
		},
		xaxis: {
			categories: categories,
			labels: {
				style: {
					fontSize: '14px',
					fontWeight: 500,
					colors: isDarkMode ? '#171716' : undefined, // Lighter gray for better contrast
				},
			},
		},
		yaxis: {
			show: false,
		},
		plotOptions: {
			radar: {
				polygons: {
					strokeColors: isDarkMode ? '#4b5563' : '#E5E7EB',
					strokeWidth: isDarkMode ? '1.5px' : '1px', // Slightly thicker in dark mode
					connectorColors: isDarkMode ? '#4b5563' : '#E5E7EB',
					fill: {
						colors: isDarkMode
							? ['#1f2937', '#1f2937'] // Less contrast in dark mode polygons
							: ['#F9FAFB', '#F3F4F6'],
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
				borderColor: isDarkMode ? '#4b5563' : '#FFFFFF',
				opacity: 0.9,
				padding: 4,
				dropShadow: {
					enabled: isDarkMode,
					top: 1,
					left: 1,
					blur: 1,
					opacity: 0.2,
				},
			},
			style: {
				fontSize: '14px',
				fontWeight: 'bold',
				colors: [isDarkMode ? '#171716' : undefined], // Black text in dark mode
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
			theme: isDarkMode ? 'dark' : 'light',
		},
		theme: {
			mode: isDarkMode ? 'dark' : 'light',
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
