'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { cn } from '@/lib/utils'

import 'react-day-picker/dist/style.css'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 w-full", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex flex-row items-center",
        caption_label: "text-sm font-medium mr-auto",
        nav: "flex space-x-1",
        nav_button: cn(
          "flex items-center justify-center h-8 w-8 rounded-md"
        ),
        nav_button_previous: "order-1",
        nav_button_next: "order-2",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray-500 dark:text-gray-400 rounded-md w-8 font-medium text-[0.8rem] py-2",
        row: "flex w-full mt-2",
        cell: "h-8 w-8 text-center text-sm relative p-0 [&:has([aria-selected])]:bg-gray-100 dark:[&:has([aria-selected])]:bg-gray-800 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700",
        day_today: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-200 font-semibold",
        day_outside: "text-gray-400 dark:text-gray-500 opacity-50",
        day_disabled: "text-gray-300 dark:text-gray-600 opacity-50",
        day_range_middle:
          "aria-selected:bg-gray-100 aria-selected:text-gray-900 dark:aria-selected:bg-gray-800 dark:aria-selected:text-gray-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 