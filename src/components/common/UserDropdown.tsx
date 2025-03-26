'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDispatch } from 'react-redux'
import { User, Settings, Info, LogOut } from 'lucide-react'
import { logout } from '@/redux/features/auth'

export default function UserDropdown() {
	const dispatch = useDispatch()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center text-gray-700 dark:text-gray-400 focus:outline-none">
				<span className="mr-3 overflow-hidden rounded-full h-11 w-11">
					<Image
						width={44}
						height={44}
						src="/images/user/owner.jpg"
						alt="User"
					/>
				</span>

				<span className="block mr-1 font-medium text-theme-sm">Musharof</span>

				<svg
					className="stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200"
					width="18"
					height="20"
					viewBox="0 0 18 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</DropdownMenuTrigger>

			<DropdownMenuContent className="w-[260px] p-3 rounded-2xl bg-white">
				<div className="px-1 py-1">
					<span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
						Musharof Chowdhury
					</span>
					<span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
						randomuser@pimjo.com
					</span>
				</div>

				<DropdownMenuSeparator className="my-3" />

				<DropdownMenuItem asChild className="py-2 cursor-pointer">
					<Link
						href="/profile"
						className="flex items-center gap-3 px-1 font-medium"
					>
						<User className="w-5 h-5 text-gray-500" />
						Edit profile
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild className="py-2 cursor-pointer">
					<Link
						href="/profile"
						className="flex items-center gap-3 px-1 font-medium"
					>
						<Settings className="w-5 h-5 text-gray-500" />
						Account settings
					</Link>
				</DropdownMenuItem>

				<DropdownMenuItem asChild className="py-2 cursor-pointer">
					<Link
						href="/profile"
						className="flex items-center gap-3 px-1 font-medium"
					>
						<Info className="w-5 h-5 text-gray-500" />
						Support
					</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className="my-2" />

				<DropdownMenuItem asChild className="py-2 cursor-pointer">
					<Link
						onClick={() => dispatch(logout())}
						href="/login"
						className="flex items-center gap-3 px-1 font-medium"
					>
						<LogOut className="w-5 h-5 text-gray-500" />
						Sign out
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
