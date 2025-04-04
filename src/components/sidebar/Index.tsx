import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSidebar } from '@/components/context/SidebarContext'
import store from '@/redux/store'

interface SidebarLinkProps {
	href: string
	icon: React.FC<React.SVGProps<SVGSVGElement>>
	children: React.ReactNode
}

const SidebarLink = ({ href, icon: Icon, children }: SidebarLinkProps) => {
	const pathname = usePathname()
	const isActive = pathname === href

	return (
		<Link
			href={href}
			className={`mb-1 flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
				isActive
					? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-300'
					: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
			}`}
		>
			<Icon
				className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-300' : ''}`}
			/>
			{children}
		</Link>
	)
}

const Sidebar = () => {
	const { isMobileOpen } = useSidebar()
	const { auth } = store.getState()
	const userRole = auth.user?.userRole || 'employee'
	const isHR = userRole === 'hr'
	const isAdmin = userRole === 'admin'

	return (
		<aside
			className={`fixed left-0 top-0 z-10 h-screen w-64 -translate-x-full border-r border-gray-200 bg-white pt-16 transition-transform dark:border-gray-700 dark:bg-gray-900 lg:translate-x-0 ${
				isMobileOpen ? 'translate-x-0' : ''
			}`}
		>
			<div className="h-full overflow-y-auto px-3 py-4">
				<ul className="space-y-2">
					<li>
						<SidebarLink href="/" icon={() => <HomeIcon />}>
							Dashboard
						</SidebarLink>
					</li>

					{(isAdmin || isHR) && (
						<li>
							<SidebarLink href="/users" icon={() => <UsersIcon />}>
								Users
							</SidebarLink>
						</li>
					)}

					<li>
						<SidebarLink href="/calendar" icon={() => <CalendarIcon />}>
							Calendar
						</SidebarLink>
					</li>

					<li>
						<SidebarLink href="/meets" icon={() => <VideoIcon />}>
							Meets
						</SidebarLink>
					</li>

					<li>
						<SidebarLink href="/sessions" icon={() => <MessageCircleIcon />}>
							Sessions
						</SidebarLink>
					</li>

					{isAdmin && (
						<li>
							<SidebarLink href="/form-layout" icon={() => <PlusCircleIcon />}>
								Create User
							</SidebarLink>
						</li>
					)}
				</ul>
			</div>
		</aside>
	)
}

// Simple icon components
const HomeIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</svg>
)

const UsersIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
		/>
	</svg>
)

const CalendarIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
		/>
	</svg>
)

const VideoIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
		/>
	</svg>
)

const MessageCircleIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
		/>
	</svg>
)

const PlusCircleIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		className="h-5 w-5"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
)

export default Sidebar
