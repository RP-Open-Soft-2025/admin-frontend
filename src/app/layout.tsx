'use client'
import { Outfit } from 'next/font/google'
import './globals.css'

import { SidebarProvider } from '@/components/context/SidebarContext'
import { ThemeProvider } from '@/components/context/ThemeContext'
import StateProvider from '@/components/context/ReduxContext'
import { useEffect, useState } from 'react'
import store from '@/redux/store'
import { useRouter } from 'next/navigation'

const outfit = Outfit({
	variable: '--font-outfit-sans',
	subsets: ['latin'],
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const router = useRouter()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		const { auth } = store.getState()
		if (!auth.isAuthenticated) router.push('./login')
	}, [router])

	// Don't render anything until after client-side hydration
	if (!mounted) {
		return (
			<html lang="en" suppressHydrationWarning>
				<body className={outfit.variable}>
					<div className="min-h-screen" />
				</body>
			</html>
		)
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body
				className={`${outfit.variable} dark:bg-gray-900`}
				suppressHydrationWarning
			>
				<ThemeProvider>
					<StateProvider>
						<SidebarProvider>{children}</SidebarProvider>
					</StateProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
