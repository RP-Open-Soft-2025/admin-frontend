'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDispatch, useSelector } from 'react-redux'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { logout } from '@/redux/features/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfileData } from '@/services/profileService'

const UserDropdown = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const user = useSelector((state: any) => state.auth.user)
	const [userName, setUserName] = useState('User')
	
	useEffect(() => {
		// Fetch user profile data when component mounts
		const fetchUserProfile = async () => {
			try {
				const profileData = await getProfileData()
				if (profileData && profileData.name) {
					setUserName(profileData.name.split(' ')[0]) // Use first name only
				}
			} catch (error) {
				console.error('Error fetching user profile:', error)
			}
		}
		
		// Only fetch if user is authenticated
		if (user && user.accessToken) {
			fetchUserProfile()
		}
	}, [user])

	const handleLogout = () => {
		dispatch(logout())
		router.push('/login')
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center gap-2 outline-none hover:opacity-90 transition-all duration-200 bg-white/10 dark:bg-gray-800/40 px-3 py-1 rounded-full">
				<span className="mr-3 overflow-hidden rounded-full h-11 w-11 ring-2 ring-blue-200 hover:ring-blue-300 transition-all duration-200 dark:ring-blue-400 dark:hover:ring-blue-300">
					<Image
						width={44}
						height={44}
						src="/images/user/owner.jpg"
						alt="User"
						className="object-cover transform hover:scale-105 transition-transform duration-200"
					/>
				</span>
				<span className="block mr-1 font-medium text-theme-sm text-gray-700 dark:text-gray-100">
					{userName}
				</span>
				<ChevronDown className="w-4 h-4 text-gray-700 dark:text-white transition-all duration-200 group-data-[state=open]:rotate-180" />
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56 p-1.5 mt-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800/95 dark:border-gray-700/50 z-[99999] transition-all duration-200"
				align="end"
			>
				<Link href="/profile/edit" className="block">
					<DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg dark:text-gray-200 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 cursor-pointer transition-all duration-200">
						<User className="w-4 h-4 text-blue-500 dark:text-blue-300" />
						<div>
							<p className="font-medium">Edit Profile</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Manage your account
							</p>
						</div>
					</DropdownMenuItem>
				</Link>

				<DropdownMenuItem
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
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserDropdown
