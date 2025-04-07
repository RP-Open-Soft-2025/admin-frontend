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
	// Create ref for portal container
	const portalRef = React.useRef<HTMLDivElement | null>(null);
	
	// Create portal container if it doesn't exist
	React.useEffect(() => {
		if (!portalRef.current && typeof document !== 'undefined') {
			const div = document.createElement('div');
			div.id = 'popover-portal-container';
			div.style.position = 'absolute';
			div.style.top = '0';
			div.style.left = '0';
			div.style.zIndex = '999999';
			document.body.appendChild(div);
			portalRef.current = div;
		}
		return () => {
			if (portalRef.current && typeof document !== 'undefined') {
				document.body.removeChild(portalRef.current);
				portalRef.current = null;
			}
		};
	}, []);

	return (
		<PopoverPrimitive.Portal container={portalRef.current}>
			<PopoverPrimitive.Content
				align={align}
				sideOffset={sideOffset}
				className={cn(
					'z-[99999] w-72 rounded-md border border-gray-200 bg-white p-4 text-gray-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50',
					className
				)}
				style={{ position: 'fixed', zIndex: 99999 }}
				{...props}
			/>
		</PopoverPrimitive.Portal>
	)
}
PopoverContent.displayName = 'PopoverContent'

export { Popover, PopoverTrigger, PopoverContent }
