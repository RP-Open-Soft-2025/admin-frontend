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
			<head>
				<meta charSet="UTF-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
				<link rel="icon" href="/images/favicon.ico" />
			</head>
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
