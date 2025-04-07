import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/context/ThemeContext'
import { FiMenu, FiBell, FiMoon, FiSun, FiLogOut } from 'react-icons/fi'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { useSidebar } from '@/components/context/SidebarContext'
import store from '@/redux/store'
import { logout } from '@/redux/features/auth'

const Header = () => {
	const { toggleMobileSidebar } = useSidebar()
	const [isDropdownOpen, setDropdownOpen] = useState(false)
	const [darkMode, setDarkMode] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const router = useRouter()
	const { auth } = store.getState()
	const userRole = auth.user?.userRole || 'employee'
	const isHR = userRole === 'hr'
	const isAdmin = userRole === 'admin'
	const { toggleTheme } = useTheme()

	// Handle user menu dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Check dark mode
	useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains('dark')
		setDarkMode(isDarkMode)
	}, [])

	const toggleSidebar = () => {
		toggleMobileSidebar()
	}

	const handleThemeToggle = () => {
		toggleTheme()
		setDarkMode(!darkMode)
	}

	const handleLogout = () => {
		store.dispatch(logout())
		router.push('/login')
	}

	return (
		<header className="sticky top-0 z-20 flex w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
			<div className="w-full px-4 py-2 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					{/* Left side: Toggle button & logo */}
					<div className="flex items-center gap-4">
						<button
							type="button"
							className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
							onClick={toggleSidebar}
						>
							<FiMenu className="h-6 w-6" />
						</button>

						<Link
							href="/"
							className="flex items-center text-xl font-bold text-gray-900 dark:text-white"
						>
							<Image
								src="/images/logo-color.svg"
								width={32}
								height={32}
								alt="Logo"
								className="mr-2 hidden dark:block"
							/>
							<Image
								src="/images/logo.svg"
								width={32}
								height={32}
								alt="Logo"
								className="mr-2 block dark:hidden"
							/>
							<span className="hidden sm:inline-block">Admin Dashboard</span>
						</Link>
					</div>

					{/* Right side: Navigation, Notifications & Profile */}
					<div className="flex items-center space-x-4">
						{/* Main Navigation */}
						<nav className="hidden lg:flex lg:space-x-8">
							<Link
								href="/"
								className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
							>
								Dashboard
							</Link>
							{(isAdmin || isHR) && (
								<Link
									href="/users"
									className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
								>
									Users
								</Link>
							)}
							<Link
								href="/calendar"
								className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
							>
								Calendar
							</Link>
							<Link
								href="/meets"
								className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
							>
								Meets
							</Link>
							<Link
								href="/sessions"
								className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
							>
								Sessions
							</Link>
							{isAdmin && (
								<Link
									href="/form-layout"
									className="inline-flex items-center border-b-2 border-transparent px-1 py-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
								>
									Create User
								</Link>
							)}
						</nav>

						{/* Notifications */}
						<button className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300">
							<FiBell className="h-6 w-6" />
						</button>

						{/* Theme toggle */}
						<button
							onClick={handleThemeToggle}
							className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
							aria-label="Toggle dark mode"
						>
							{darkMode ? (
								<FiSun className="h-6 w-6" />
							) : (
								<FiMoon className="h-6 w-6" />
							)}
						</button>

						{/* Profile Dropdown */}
						<div className="relative" ref={dropdownRef}>
							<button
								className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none dark:text-gray-400 dark:hover:text-gray-300"
								onClick={() => setDropdownOpen(!isDropdownOpen)}
							>
								<div className="relative h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
									<div className="absolute inset-0 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-300">
										AD
									</div>
								</div>
								<RiArrowDropDownLine
									className={`h-6 w-6 transition-transform ${
										isDropdownOpen ? 'rotate-180' : ''
									}`}
								/>
							</button>

							{isDropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all dark:bg-gray-800 dark:ring-gray-700">
									<Link
										href="/profile"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
										onClick={() => setDropdownOpen(false)}
									>
										Your Profile
									</Link>
									<Link
										href="/settings"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
										onClick={() => setDropdownOpen(false)}
									>
										Settings
									</Link>
									<button
										className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
										onClick={handleLogout}
									>
										<div className="flex items-center">
											<FiLogOut className="mr-2 h-4 w-4" />
											Sign out
										</div>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Header
