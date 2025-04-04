'use client'

import React, { useState } from 'react'
import { DatePicker } from '@/components/ui/date-picker'

export default function DatePickerDemo() {
	const [date, setDate] = useState<Date | undefined>(new Date())
	const [secondDate, setSecondDate] = useState<Date | undefined>(undefined)
	const [startDate, setStartDate] = useState<Date | undefined>(undefined)
	const [endDate, setEndDate] = useState<Date | undefined>(undefined)

	const handleDateSelect = (date: Date | undefined) => {
		setDate(date)
		console.log('Selected date:', date)
	}

	return (
		<div className="p-8 max-w-4xl mx-auto space-y-10">
			<div>
				<h1 className="text-3xl font-bold mb-6">Date Picker Demo</h1>
				<p className="mb-4 text-gray-600 dark:text-gray-400">
					This page demonstrates the new date picker component.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<div className="space-y-6">
					<div>
						<h2 className="text-xl font-semibold mb-4">Basic Date Picker</h2>
						<DatePicker date={date} onSelect={handleDateSelect} />
						<div className="mt-2 text-sm">
							Selected: {date ? date.toLocaleDateString() : 'None'}
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-4">With Placeholder</h2>
						<DatePicker
							date={secondDate}
							onSelect={setSecondDate}
							placeholder="Choose event date"
						/>
						<div className="mt-2 text-sm">
							Selected: {secondDate ? secondDate.toLocaleDateString() : 'None'}
						</div>
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<h2 className="text-xl font-semibold mb-4">
							With Min Date (Today)
						</h2>
						<DatePicker
							date={startDate}
							onSelect={setStartDate}
							minDate={new Date()}
							placeholder="Start date"
						/>
						<div className="mt-2 text-sm">
							Selected: {startDate ? startDate.toLocaleDateString() : 'None'}
						</div>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-4">Custom Format</h2>
						<DatePicker
							date={endDate}
							onSelect={setEndDate}
							formatString="dd/MM/yyyy"
							placeholder="End date"
						/>
						<div className="mt-2 text-sm">
							Selected: {endDate ? endDate.toLocaleDateString() : 'None'}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
