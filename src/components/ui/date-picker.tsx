'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Calendar from '@/components/ui/calendar'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
	date?: Date
	onSelect?: (date: Date | undefined) => void
	disabled?: boolean
	placeholder?: string
	formatString?: string
	minDate?: Date
	className?: string
	classNames?: {
		popover?: string
		trigger?: string
		calendar?: string
	}
}

function DatePicker({
	date,
	onSelect,
	disabled = false,
	placeholder = 'Select date',
	formatString = 'PPP',
	minDate,
	className,
	classNames = {},
}: DatePickerProps) {
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
	const [open, setOpen] = React.useState(false)

	// Update internal state when the external date prop changes
	React.useEffect(() => {
		if (date !== selectedDate) {
			setSelectedDate(date)
		}
	}, [date, selectedDate])

	const handleSelect = (date: Date | undefined) => {
		setSelectedDate(date)
		setOpen(false)
		if (onSelect) {
			onSelect(date)
		}
	}

	const isDateDisabled = (date: Date) => {
		if (minDate) {
			return date < new Date(minDate.setHours(0, 0, 0, 0))
		}
		return false
	}

	return (
		<div className={cn('relative', className)}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						disabled={disabled}
						variant="outline"
						className={cn(
							'w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
							!selectedDate && 'text-muted-foreground',
							classNames.trigger
						)}
						type="button"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{selectedDate ? (
							format(selectedDate, formatString)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className={cn('w-auto p-0', classNames.popover)}
					align="start"
					sideOffset={8}
					onClick={e => e.stopPropagation()}
				>
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={date => {
							if (date) {
								// Stop any parent click events from firing
								const event = window.event
								if (event) {
									event.stopPropagation()
								}
								handleSelect(date)
							}
						}}
						disabled={isDateDisabled}
						initialFocus
						className={cn('border-none', classNames.calendar)}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}

export { DatePicker }
