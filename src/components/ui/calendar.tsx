'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Simple date picker that doesn't rely on external libraries
// This will work reliably with React 19

interface CalendarProps {
	mode?: 'single' | 'range'
	selected?: Date
	onSelect?: (date: Date) => void
	disabled?: (date: Date) => boolean
	initialFocus?: boolean
	className?: string
	showOutsideDays?: boolean
}

export default function Calendar({
	selected,
	onSelect,
	disabled,
	className = '',
	showOutsideDays = true,
}: CalendarProps) {
	const [currentDate, setCurrentDate] = useState<Date>(selected || new Date())
	const [localSelected, setLocalSelected] = useState<Date | undefined>(selected)
	const [mounted, setMounted] = useState(false)

	// Handle client-side only rendering
	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		if (selected) {
			setLocalSelected(selected)
			setCurrentDate(selected)
		}
	}, [selected])

	if (!mounted) {
		return (
			<div
				className={cn(
					'p-3 w-full h-[350px] bg-gray-50 dark:bg-gray-900 rounded-md',
					className
				)}
			/>
		)
	}

	// Get days in month
	const getDaysInMonth = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate()
	}

	// Get day of week of first day in month (0 = Sunday, 6 = Saturday)
	const getFirstDayOfMonth = (year: number, month: number) => {
		return new Date(year, month, 1).getDay()
	}

	// Get array of dates for the current month view
	const getDates = () => {
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth()

		const daysInMonth = getDaysInMonth(year, month)
		const firstDayOfMonth = getFirstDayOfMonth(year, month)

		// Previous month days to show
		const prevMonthDays = []
		if (showOutsideDays) {
			const prevMonth = month === 0 ? 11 : month - 1
			const prevMonthYear = month === 0 ? year - 1 : year
			const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth)

			for (let i = 0; i < firstDayOfMonth; i++) {
				prevMonthDays.push({
					date: new Date(
						prevMonthYear,
						prevMonth,
						daysInPrevMonth - firstDayOfMonth + i + 1
					),
					isCurrentMonth: false,
					isOutside: true,
				})
			}
		}

		// Current month days
		const currentMonthDays = []
		for (let i = 1; i <= daysInMonth; i++) {
			currentMonthDays.push({
				date: new Date(year, month, i),
				isCurrentMonth: true,
				isOutside: false,
			})
		}

		// Next month days to fill the remaining cells
		const nextMonthDays = []
		if (showOutsideDays) {
			const totalDays = prevMonthDays.length + currentMonthDays.length
			const remainingDays = 42 - totalDays // 6 rows x 7 days

			const nextMonth = month === 11 ? 0 : month + 1
			const nextMonthYear = month === 11 ? year + 1 : year

			for (let i = 1; i <= remainingDays; i++) {
				nextMonthDays.push({
					date: new Date(nextMonthYear, nextMonth, i),
					isCurrentMonth: false,
					isOutside: true,
				})
			}
		}

		return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
	}

	const handlePrevMonth = () => {
		setCurrentDate(prev => {
			const prevMonth = prev.getMonth() === 0 ? 11 : prev.getMonth() - 1
			const prevYear =
				prev.getMonth() === 0 ? prev.getFullYear() - 1 : prev.getFullYear()
			return new Date(prevYear, prevMonth, 1)
		})
	}

	const handleNextMonth = () => {
		setCurrentDate(prev => {
			const nextMonth = prev.getMonth() === 11 ? 0 : prev.getMonth() + 1
			const nextYear =
				prev.getMonth() === 11 ? prev.getFullYear() + 1 : prev.getFullYear()
			return new Date(nextYear, nextMonth, 1)
		})
	}

	const handleDateSelect = (date: Date) => {
		if (disabled && disabled(date)) {
			return
		}

		// Prevent propagation
		const event = window.event
		if (event) {
			event.stopPropagation()
		}

		setLocalSelected(date)
		if (onSelect) {
			onSelect(date)
		}
	}

	const isSelected = (date: Date) => {
		if (!localSelected) return false
		return (
			date.getDate() === localSelected.getDate() &&
			date.getMonth() === localSelected.getMonth() &&
			date.getFullYear() === localSelected.getFullYear()
		)
	}

	const isToday = (date: Date) => {
		const today = new Date()
		return (
			date.getDate() === today.getDate() &&
			date.getMonth() === today.getMonth() &&
			date.getFullYear() === today.getFullYear()
		)
	}

	const isDisabled = (date: Date) => {
		return disabled ? disabled(date) : false
	}

	const dates = getDates()
	const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	return (
		<div className={cn('p-3 w-full', className)}>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="text-sm font-medium">
						{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
					</div>
					<div className="flex space-x-1">
						<button
							onClick={handlePrevMonth}
							className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
							aria-label="Previous month"
						>
							<ChevronLeft className="h-4 w-4" />
						</button>
						<button
							onClick={handleNextMonth}
							className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
							aria-label="Next month"
						>
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-1">
					{daysOfWeek.map((day, i) => (
						<div
							key={i}
							className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 h-8 flex items-center justify-center"
						>
							{day}
						</div>
					))}

					{dates.map((dateObj, i) => {
						const { date, isCurrentMonth, isOutside } = dateObj
						return (
							<button
								key={i}
								disabled={isDisabled(date)}
								onClick={e => {
									e.stopPropagation()
									handleDateSelect(date)
								}}
								className={cn(
									'text-center text-sm rounded-md h-8 w-8 p-0 flex items-center justify-center focus:outline-none focus-visible:ring focus-visible:ring-blue-500',
									isSelected(date) &&
										'bg-blue-600 text-white hover:bg-blue-700',
									isToday(date) &&
										!isSelected(date) &&
										'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-semibold',
									!isCurrentMonth &&
										isOutside &&
										'text-gray-400 dark:text-gray-500 opacity-50',
									!isSelected(date) &&
										!isToday(date) &&
										isCurrentMonth &&
										'hover:bg-gray-100 dark:hover:bg-gray-800',
									isDisabled(date) && 'opacity-25 cursor-not-allowed'
								)}
							>
								{date.getDate()}
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}

Calendar.displayName = 'Calendar'

export type { CalendarProps }
