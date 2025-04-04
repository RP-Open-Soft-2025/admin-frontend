'use client'
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSidebar } from '../context/SidebarContext'
import {
	Calendar,
	ChevronDownIcon,
	Gauge,
	GridIcon,
	LogOut,
	MessageSquare,
	PlusCircle,
	Users,
	Video,
} from 'lucide-react'
import DeloitteLogo from './deloitte-logo.png'
import DeloitteLogoDark from './deloitte-logo-dark.png'
import { logout } from '@/redux/features/auth'
import { useDispatch } from 'react-redux'
import store from '@/redux/store'

type NavItem = {
	name: string
	icon: React.ReactNode
	path?: string
	subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[]
}

// Static base navigation items
const baseNavItems: NavItem[] = [
	{
		icon: <Gauge />,
		name: 'Dashboard',
		path: '/',
	},
	{
		icon: <Calendar />,
		name: 'Calendar',
		path: '/calendar',
	},
	{
		name: 'Sessions',
		icon: <MessageSquare />,
		path: '/sessions',
	},
	{
		name: 'Meetings',
		icon: <Video />,
		path: '/meets',
	},
]

const AppSidebar: React.FC = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
	const pathname = usePathname()
	const [isMobileSize, setIsMobileSize] = useState(false)
	const [navItems, setNavItems] = useState<NavItem[]>(baseNavItems)

	// Set up navigation items based on user role - client-side only to avoid hydration errors
	useEffect(() => {
		const { auth } = store.getState()
		const userRole = auth.user?.userRole || 'employee'
		const isAdmin = userRole === 'admin'
		const isHR = userRole === 'hr'

		// Create the full navigation set based on user role
		const fullNavItems = [
			...baseNavItems.slice(0, 2), // Dashboard and Calendar

			// Only add Add Employee for admin
			...(isAdmin
				? [
						{
							name: 'Add Employee',
							icon: <PlusCircle />,
							path: '/form-layout',
						},
					]
				: []),

			// Add Users for both admin and HR
			...(isAdmin || isHR
				? [
						{
							name: 'Users',
							icon: <Users />,
							path: '/users',
						},
					]
				: []),

			// Add the remaining base items
			...baseNavItems.slice(2),
		]

		setNavItems(fullNavItems)
	}, [])

	// Wrap othersItems in useMemo to prevent unnecessary re-renders
	const othersItems = useMemo(() => [], [])

	const renderMenuItems = (
		navItems: NavItem[],
		menuType: 'main' | 'others'
	) => (
		<ul className="flex flex-col gap-4">
			{navItems.map((nav, index) => (
				<li key={nav.name}>
					{nav.subItems ? (
						<button
							onClick={() => handleSubmenuToggle(index, menuType)}
							className={`menu-item group  ${
								openSubmenu?.type === menuType && openSubmenu?.index === index
									? 'menu-item-active'
									: 'menu-item-inactive'
							} cursor-pointer ${
								!isExpanded && !isHovered
									? 'lg:justify-center'
									: 'lg:justify-start'
							}`}
						>
							<span
								className={` ${
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? 'menu-item-icon-active'
										: 'menu-item-icon-inactive'
								}`}
							>
								{nav.icon}
							</span>
							{(isExpanded || isHovered || isMobileOpen) && (
								<span className={`menu-item-text`}>{nav.name}</span>
							)}
							{(isExpanded || isHovered || isMobileOpen) && (
								<ChevronDownIcon
									className={`ml-auto w-5 h-5 transition-transform duration-200  ${
										openSubmenu?.type === menuType &&
										openSubmenu?.index === index
											? 'rotate-180 text-brand-500'
											: ''
									}`}
								/>
							)}
						</button>
					) : (
						nav.path && (
							<Link
								href={nav.path}
								className={`menu-item group ${
									isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
								}`}
							>
								<span
									className={`${
										isActive(nav.path)
											? 'menu-item-icon-active'
											: 'menu-item-icon-inactive'
									}`}
								>
									{nav.icon}
								</span>
								{(isExpanded || isHovered || isMobileOpen) && (
									<span className={`menu-item-text`}>{nav.name}</span>
								)}
							</Link>
						)
					)}
					{nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
						<div
							ref={el => {
								subMenuRefs.current[`${menuType}-${index}`] = el
							}}
							className="overflow-hidden transition-all duration-300"
							style={{
								height:
									openSubmenu?.type === menuType && openSubmenu?.index === index
										? `${subMenuHeight[`${menuType}-${index}`]}px`
										: '0px',
							}}
						>
							<ul className="mt-2 space-y-1 ml-9">
								{nav.subItems.map(subItem => (
									<li key={subItem.name}>
										<Link
											href={subItem.path}
											className={`menu-dropdown-item ${
												isActive(subItem.path)
													? 'menu-dropdown-item-active'
													: 'menu-dropdown-item-inactive'
											}`}
										>
											{subItem.name}
											<span className="flex items-center gap-1 ml-auto">
												{subItem.new && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? 'menu-dropdown-badge-active'
																: 'menu-dropdown-badge-inactive'
														} menu-dropdown-badge `}
													>
														new
													</span>
												)}
												{subItem.pro && (
													<span
														className={`ml-auto ${
															isActive(subItem.path)
																? 'menu-dropdown-badge-active'
																: 'menu-dropdown-badge-inactive'
														} menu-dropdown-badge `}
													>
														pro
													</span>
												)}
											</span>
										</Link>
									</li>
								))}
							</ul>
						</div>
					)}
				</li>
			))}
		</ul>
	)

	const [openSubmenu, setOpenSubmenu] = useState<{
		type: 'main' | 'others'
		index: number
	} | null>(null)
	const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({})
	const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({})

	// const isActive = (path: string) => path === pathname;
	const isActive = useCallback((path: string) => path === pathname, [pathname])

	useEffect(() => {
		// Check if the current path matches any submenu item
		let submenuMatched = false
		;['main', 'others'].forEach(menuType => {
			const items = menuType === 'main' ? navItems : othersItems
			items.forEach((nav, index) => {
				if (nav.subItems) {
					nav.subItems.forEach(subItem => {
						if (isActive(subItem.path)) {
							setOpenSubmenu({
								type: menuType as 'main' | 'others',
								index,
							})
							submenuMatched = true
						}
					})
				}
			})
		})

		// If no submenu item matches, close the open submenu
		if (!submenuMatched) {
			setOpenSubmenu(null)
		}
	}, [pathname, isActive])

	useEffect(() => {
		// Set the height of the submenu items when the submenu is opened
		if (openSubmenu !== null) {
			const key = `${openSubmenu.type}-${openSubmenu.index}`
			if (subMenuRefs.current[key]) {
				setSubMenuHeight(prevHeights => ({
					...prevHeights,
					[key]: subMenuRefs.current[key]?.scrollHeight || 0,
				}))
			}
		}
	}, [openSubmenu])

	useEffect(() => {
		// Set initial value
		setIsMobileSize(window.innerWidth < 1024)

		// Update on resize
		const handleResize = () => {
			setIsMobileSize(window.innerWidth < 1024)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
		setOpenSubmenu(prevOpenSubmenu => {
			if (
				prevOpenSubmenu &&
				prevOpenSubmenu.type === menuType &&
				prevOpenSubmenu.index === index
			) {
				return null
			}
			return { type: menuType, index }
		})
	}

	const handleLogout = () => {
		dispatch(logout())
		router.push('/login')
	}

	// Calculate heights for all submenus on resize
	useEffect(() => {
		// We need to update the submenu heights whenever the window is resized
		const updateSubMenuHeights = () => {
			// Get all submenus
			Object.keys(subMenuRefs.current).forEach(key => {
				const subMenu = subMenuRefs.current[key]
				if (subMenu) {
					// Set the height for each submenu
					subMenuHeight[key] = subMenu.scrollHeight
					setSubMenuHeight({ ...subMenuHeight })
				}
			})
		}

		// Initial calculation of submenu heights
		updateSubMenuHeights()

		// Add event listener for window resize
		window.addEventListener('resize', updateSubMenuHeights)

		// Cleanup the event listener
		return () => {
			window.removeEventListener('resize', updateSubMenuHeights)
		}
	}, [subMenuHeight, navItems, othersItems])

	return (
		<aside
			className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 overflow-hidden
        ${
					isExpanded || isMobileOpen
						? 'w-[290px]'
						: isHovered
							? 'w-[290px]'
							: 'w-[90px]'
				}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
			onMouseEnter={() => !isExpanded && setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Only show logo in desktop view */}
			<div
				className={`py-8 hidden lg:flex ${
					!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
				}`}
			>
				<Link href="/">
					{isExpanded || isHovered || isMobileOpen ? (
						<>
							<Image
								className="dark:hidden"
								src={DeloitteLogo}
								alt="Logo"
								width={150}
								height={40}
								priority
							/>
							<Image
								className="hidden dark:block"
								src={DeloitteLogoDark}
								alt="Logo"
								width={150}
								height={40}
								style={{ height: 'auto' }}
								priority
							/>
						</>
					) : (
						<>
							<Image
								src={DeloitteLogo}
								alt="Logo"
								width={32}
								height={32}
								className="dark:hidden"
								style={{ height: 'auto' }}
							/>
							<Image
								src={DeloitteLogoDark}
								alt="Logo"
								width={32}
								height={32}
								className="hidden dark:block"
								style={{ height: 'auto' }}
							/>
						</>
					)}
				</Link>
			</div>

			{/* Add padding for mobile view without logo */}
			<div className="pt-6 lg:hidden"></div>

			<div className="flex flex-col overflow-y-auto h-full">
				<nav className="mb-6">
					<div className="flex flex-col gap-4">
						<div>
							<h2
								className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
									!isExpanded && !isHovered
										? 'lg:justify-center'
										: 'justify-start'
								}`}
							>
								{isExpanded || isHovered || isMobileOpen ? (
									'Menu'
								) : (
									<GridIcon />
								)}
							</h2>
							{renderMenuItems(navItems, 'main')}
						</div>

						{/* User profile section - only visible in mobile/tablet view */}
						{(isExpanded || isHovered || isMobileOpen) && isMobileSize && (
							<div className="mb-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 lg:hidden">
								<h2 className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start">
									Profile
								</h2>
								<div
									onClick={handleLogout}
									className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-lg dark:text-red-300 dark:hover:from-red-900/30 dark:hover:to-orange-900/30 cursor-pointer mt-1 transition-all duration-200"
								>
									<LogOut className="w-4 h-4" />
									<div>
										<p className="font-medium">Logout</p>
										<p className="text-xs text-red-500/80 dark:text-red-300/80">
											Sign out of your account
										</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		</aside>
	)
}

export default AppSidebar
