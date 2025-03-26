'use client'
import { Outfit } from 'next/font/google'
import './globals.css'

import { SidebarProvider } from '@/components/context/SidebarContext'
import { ThemeProvider } from '@/components/context/ThemeContext'
import StateProvider from '@/components/context/ReduxContext'
import { useEffect } from 'react'
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
	useEffect(() => {
		const { auth } = store.getState()
		if (!auth.isAuthenticated) router.push('./login')
	})
	return (
		<html lang="en">
			<body className={`${outfit.variable} dark:bg-gray-900`}>
				<ThemeProvider>
					<StateProvider>
						<SidebarProvider>{children}</SidebarProvider>
					</StateProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
