'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

// Export the Dialog component directly
const Dialog = DialogPrimitive.Root

// Avoid ref forwarding for DialogTrigger to prevent React 19 warnings
const DialogTrigger = ({
	asChild = false,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger> & {
	asChild?: boolean
}) => {
	// Return to a more standard implementation that lets Radix UI handle the asChild logic
	// This preserves the Dialog state management while still avoiding nested buttons
	return (
		<DialogPrimitive.Trigger
			data-slot="dialog-trigger"
			{...props}
			asChild={asChild}
		/>
	)
}
DialogTrigger.displayName = 'DialogTrigger'

// Use a function component for DialogPortal to avoid ref issues
const DialogPortal = ({
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>) => {
	return <DialogPrimitive.Portal {...props} />
}
DialogPortal.displayName = 'DialogPortal'

// Use a function component for DialogOverlay to avoid ref issues
const DialogOverlay = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				'fixed inset-0  bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[100000]',
				className
			)}
			{...props}
		/>
	)
}
DialogOverlay.displayName = 'DialogOverlay'

// Use a function component for DialogContent to avoid ref issues
const DialogContent = ({
	className,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				className={cn(
					'fixed left-[50%] top-[50%] grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg z-[100001]',
					className
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
					<X className="h-4 w-4" />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}
DialogContent.displayName = 'DialogContent'

// Use function components for the remaining dialog components to avoid ref issues
const DialogHeader = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col space-y-1.5 text-center sm:text-left',
			className
		)}
		{...props}
	/>
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => (
	<div
		className={cn(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className
		)}
		{...props}
	/>
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
	<DialogPrimitive.Title
		className={cn(
			'text-lg font-semibold leading-none tracking-tight',
			className
		)}
		{...props}
	/>
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
	<DialogPrimitive.Description
		className={cn('text-sm text-muted-foreground', className)}
		{...props}
	/>
)
DialogDescription.displayName = 'DialogDescription'

export {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
}
