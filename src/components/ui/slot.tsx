'use client'

import * as React from 'react'

type SlotProps = {
	children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

/**
 * A simple Slot component implementation
 */
const Slot = React.forwardRef<HTMLElement, SlotProps>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(props, _forwardedRef) => {
		const { children, ...slotProps } = props

		// Return null if children is not a valid element
		if (!React.isValidElement(children)) {
			return null
		}

		// Just do a simple clone without ref forwarding for now
		// This avoids all the complex type issues with refs
		return React.cloneElement(children, slotProps)
	}
)

Slot.displayName = 'Slot'

export { Slot }
