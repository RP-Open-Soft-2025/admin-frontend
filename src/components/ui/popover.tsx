'use client'

import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/lib/utils'

// Use the Popover root component directly
const Popover = PopoverPrimitive.Root

// Create a custom implementation of PopoverTrigger that avoids the React 19 ref handling issue
const PopoverTrigger = ({
	asChild = false,
	...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger> & {
	asChild?: boolean
}) => {
	// Return to a more standard implementation that lets Radix UI handle the asChild logic
	// This preserves the Popover state management while still avoiding nested buttons
	return (
		<PopoverPrimitive.Trigger
			data-slot="popover-trigger"
			{...props}
			asChild={asChild}
		/>
	)
}
PopoverTrigger.displayName = 'PopoverTrigger'

// Create a custom implementation of PopoverContent that avoids the React 19 ref handling issue
const PopoverContent = ({
	className,
	align = 'center',
	sideOffset = 4,
	...props
}: React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>) => {
	return (
		<PopoverPrimitive.Portal>
			<PopoverPrimitive.Content
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'z-50 w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
					className
				)}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
