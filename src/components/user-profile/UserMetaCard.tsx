'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { EmployeeAPI } from '@/types/UserProfile'
import { blockUser, unblockUser } from '@/services/adminService'
import { toast } from '@/components/ui/sonner'
import store from '@/redux/store'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

// Props interface
interface UserMetaCardProps {
	userData?: EmployeeAPI
}

// Helper function to format dates consistently
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-GB') // Use consistent locale (DD/MM/YYYY)
}

export default function UserMetaCard({ userData }: UserMetaCardProps) {
	const [isLoading, setIsLoading] = useState(false)
	const [showBlockModal, setShowBlockModal] = useState(false)
	const [showUnblockModal, setShowUnblockModal] = useState(false)
	const [reason, setReason] = useState('')
	const { auth } = store.getState()

	// Check if current user can modify users
	const canModifyUsers =
		auth.user?.userRole === 'admin' || auth.user?.userRole === 'hr'

	if (!userData) return null

	const handleBlock = async () => {
		if (!reason.trim()) {
			toast({
				type: 'error',
				description: 'Please provide a reason for blocking this user.',
			})
			return
		}

		setIsLoading(true)
		try {
			const result = await blockUser(userData.employee_id, reason)
			toast({
				type: 'success',
				description: result.message || 'User blocked successfully',
			})
			setShowBlockModal(false)
			// Refresh the page to show updated user status
			window.location.reload()
		} catch (error) {
			toast({
				type: 'error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to block user. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleUnblock = async () => {
		if (!reason.trim()) {
			toast({
				type: 'error',
				description: 'Please provide a reason for unblocking this user.',
			})
			return
		}

		setIsLoading(true)
		try {
			const result = await unblockUser(userData.employee_id, reason)
			toast({
				type: 'success',
				description: result.message || 'User unblocked successfully',
			})
			setShowUnblockModal(false)
			// Refresh the page to show updated user status
			window.location.reload()
		} catch (error) {
			toast({
				type: 'error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to unblock user. Please try again.',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const openBlockModal = () => {
		setReason('')
		setShowBlockModal(true)
	}

	const openUnblockModal = () => {
		setReason('')
		setShowUnblockModal(true)
	}

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
			<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col items-center w-full gap-4 md:flex-row md:gap-5">
					<div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 shrink-0">
						<Image
							width={80}
							height={80}
							src="/images/user/owner.jpg"
							alt={userData.name}
							className="object-cover"
						/>
					</div>
					<div className="order-3 md:order-2 flex-grow w-full">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="w-full text-center md:text-left">
								<h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90 2xl:text-lg xl:text-base lg:text-sm md:text-sm">
									{userData.name}
								</h4>
								<div className="flex flex-col items-center gap-2 md:flex-row md:gap-3 md:items-center">
									<p className="text-sm text-gray-500 dark:text-gray-400 2xl:text-sm xl:text-xs lg:text-xs md:text-xs truncate max-w-[250px] xl:max-w-[200px] lg:max-w-[180px]">
										{userData.email}
									</p>
									<span
										className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap 2xl:text-xs xl:text-[10px] lg:text-[10px] md:text-[10px] ${
											userData.is_blocked
												? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
												: userData.account_activated
													? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
													: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
										}`}
									>
										{userData.is_blocked
											? 'Blocked'
											: userData.account_activated
												? 'Active'
												: 'Pending'}
									</span>
								</div>
								<div className="mt-2 flex flex-col items-center gap-1 md:flex-row md:gap-3 md:flex-wrap">
									<p className="text-sm text-gray-500 dark:text-gray-400 2xl:text-sm xl:text-xs lg:text-xs md:text-xs whitespace-nowrap">
										Role: <span className="font-medium">{userData.role}</span>
									</p>
									{userData.manager_id && (
										<p className="text-sm text-gray-500 dark:text-gray-400 2xl:text-sm xl:text-xs lg:text-xs md:text-xs whitespace-nowrap">
											Manager ID:{' '}
											<span className="font-medium">{userData.manager_id}</span>
										</p>
									)}
									<p className="text-sm text-gray-500 dark:text-gray-400 2xl:text-sm xl:text-xs lg:text-xs md:text-xs whitespace-nowrap">
										Last Active:{' '}
										<span className="font-medium">
											{formatDate(userData.last_ping)}
										</span>
									</p>
								</div>
							</div>

							{canModifyUsers && (
								<div className="flex justify-center mt-3 md:mt-0 md:justify-end shrink-0">
									{userData.is_blocked ? (
										<Button
											onClick={openUnblockModal}
											variant="outline"
											size="sm"
											className="bg-white dark:bg-gray-800 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 dark:text-green-500 dark:hover:text-green-400 dark:border-green-800 dark:hover:border-green-700 flex items-center gap-2 2xl:text-sm xl:text-xs lg:text-xs md:text-xs whitespace-nowrap h-8 md:h-7 px-3"
										>
											<ShieldCheck
												size={16}
												className="2xl:w-4 2xl:h-4 xl:w-3 xl:h-3 lg:w-3 lg:h-3 md:w-3 md:h-3"
											/>
											<span>Unblock User</span>
										</Button>
									) : (
										<Button
											onClick={openBlockModal}
											variant="outline"
											size="sm"
											className="bg-white dark:bg-gray-800 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 dark:text-red-500 dark:hover:text-red-400 dark:border-red-800 dark:hover:border-red-700 flex items-center gap-2 2xl:text-sm xl:text-xs lg:text-xs md:text-xs whitespace-nowrap h-8 md:h-7 px-3"
										>
											<ShieldAlert
												size={16}
												className="2xl:w-4 2xl:h-4 xl:w-3 xl:h-3 lg:w-3 lg:h-3 md:w-3 md:h-3"
											/>
											<span>Block User</span>
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Block User Modal */}
			<Dialog open={showBlockModal} onOpenChange={setShowBlockModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Block User</DialogTitle>
						<DialogDescription>
							You are about to block {userData.name}. This will prevent them
							from accessing the system.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<label
							htmlFor="reason"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Reason for blocking
						</label>
						<Textarea
							id="reason"
							value={reason}
							onChange={e => setReason(e.target.value)}
							placeholder="Please provide a reason for blocking this user"
							className="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
							rows={4}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowBlockModal(false)}
							disabled={isLoading}
							className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
						>
							Cancel
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleBlock}
							disabled={isLoading}
							className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:text-white"
						>
							{isLoading ? 'Blocking...' : 'Block User'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Unblock User Modal */}
			<Dialog open={showUnblockModal} onOpenChange={setShowUnblockModal}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Unblock User</DialogTitle>
						<DialogDescription>
							You are about to unblock {userData.name}. This will allow them to
							access the system again.
						</DialogDescription>
					</DialogHeader>

					<div className="py-4">
						<label
							htmlFor="reason"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
						>
							Reason for unblocking
						</label>
						<Textarea
							id="reason"
							value={reason}
							onChange={e => setReason(e.target.value)}
							placeholder="Please provide a reason for unblocking this user"
							className="w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
							rows={4}
						/>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => setShowUnblockModal(false)}
							disabled={isLoading}
							className="bg-white text-gray-800 border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
						>
							Cancel
						</Button>
						<Button
							type="button"
							onClick={handleUnblock}
							disabled={isLoading}
							className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 dark:text-white"
						>
							{isLoading ? 'Unblocking...' : 'Unblock User'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
