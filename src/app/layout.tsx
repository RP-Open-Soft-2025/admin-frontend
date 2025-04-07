'use client'
import { Outfit } from 'next/font/google'
import './globals.css'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SidebarProvider } from '@/components/context/SidebarContext'
import { ThemeProvider } from '@/components/context/ThemeContext'
import StateProvider from '@/components/context/ReduxContext'
import { Toaster } from 'sonner'

const outfit = Outfit({
	variable: '--font-outfit-sans',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [loading, setLoading] = useState(false)
	const [loadingItemName, setLoadingItemName] = useState('')
	const pathname = usePathname()

	// Listen for navigation start events
	useEffect(() => {
		const handleStartNavigation = (event: Event) => {
			const customEvent = event as CustomEvent
			if (customEvent.detail && customEvent.detail.name) {
				setLoadingItemName(customEvent.detail.name)
			} else {
				// Fallback to pathname
				setLoadingItemName(getPageTitle(pathname))
			}
			setLoading(true)
		}

		window.addEventListener('startNavigation', handleStartNavigation)

		return () => {
			window.removeEventListener('startNavigation', handleStartNavigation)
		}
	}, [pathname])

	// Reset loading state when path changes (navigation completes)
	useEffect(() => {
		setLoading(false)
	}, [pathname])

	return (
		<html lang="en">
			<body
				className={`${outfit.variable} dark:bg-gray-900 transition-colors duration-150`}
			>
				<ThemeProvider>
					<StateProvider>
						<SidebarProvider>
							{/* Loading Overlay */}
							{loading && (
								<div className="fixed inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[999999] flex flex-col items-center justify-center">
									<div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-brand-500 dark:border-t-brand-400 animate-spin"></div>
									<div className="mt-6 text-center">
										<p className="text-gray-800 dark:text-gray-200 font-semibold text-xl">
											Loading{' '}
											<span className="text-brand-500 dark:text-brand-400">
												{loadingItemName}
											</span>
										</p>
										<p className="text-gray-500 dark:text-gray-400 mt-2">
											Please wait while we prepare your content...
										</p>
									</div>
								</div>
							)}
							{children}
						</SidebarProvider>
						<Toaster />
					</StateProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}

// Helper function to get page title from pathname
function getPageTitle(path: string): string {
	const routes: Record<string, string> = {
		'/': 'Dashboard',
		'/calendar': 'Calendar',
		'/form-layout': 'Add Employee',
		'/employees': 'Employees',
		'/sessions': 'Sessions',
		'/escalated-chains': 'Escalated Chains',
	}

	return routes[path] || 'Page'
}
