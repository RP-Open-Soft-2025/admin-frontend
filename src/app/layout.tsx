'use client'
import { Outfit } from 'next/font/google'
import './globals.css'

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
	return (
		<html lang="en">
			<title>Admin - Vibemeter</title>
			<body className={`${outfit.variable} dark:bg-gray-900`}>
				<ThemeProvider>
					<StateProvider>
						<SidebarProvider>{children}</SidebarProvider>
						<Toaster />
					</StateProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
