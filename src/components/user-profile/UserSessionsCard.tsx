'use client'
import React, { useEffect, useState } from 'react'
import { ChainType, ChainStatus } from '@/types/chains'
import { getEmployeeChains } from '@/services/profileService'
import { useRouter } from 'next/navigation'
import {
	ChevronRight,
	ChevronDown,
	Plus,
	Clock,
	CheckCircle,
	FileText,
} from 'lucide-react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/sonner'
import { API_URL } from '@/constants'
import store from '@/redux/store'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import Calendar from '@/components/ui/calendar'
import Link from 'next/link'

// Props interface
interface UserSessionsCardProps {
	employeeId: string
	role: string
}

// Modify the formatDate function to use IST timezone
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
		timeZone: 'Asia/Kolkata',
	})
}

// Helper function to get chain status color
const getChainStatusColor = (status: ChainStatus) => {
	switch (status) {
		case ChainStatus.ACTIVE:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case ChainStatus.COMPLETED:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case ChainStatus.CANCELLED:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case ChainStatus.ESCALATED:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}

// Add a helper function to get session data
const getSessionStatusFromChain = (chain: ChainType) => {
	// If chain is completed, we assume all sessions in it are completed
	if (chain.status === ChainStatus.COMPLETED) {
		return 'COMPLETED'
	}
	// For active chains, we need to check the session status
	// This is a simplified implementation - you might need to adjust based on your data structure
	return 'ACTIVE'
}

export default function UserSessionsCard({
	employeeId,
	role,
}: UserSessionsCardProps) {
	const [chainsData, setChainsData] = useState<ChainType[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hoveredRow, setHoveredRow] = useState<string | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [formData, setFormData] = useState({
		employee_id: employeeId,
		notes: '',
		scheduled_time: new Date(Date.now() + 120000).toLocaleString('en-GB', {
			hour12: false,
		}),
	})
	const [escalateChainId, setEscalateChainId] = useState<string | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [escalateChainNotes, setEscalateChainNotes] = useState('')
	const [isEscalatingChain, setIsEscalatingChain] = useState(false)
	const router = useRouter()
	const { auth } = store.getState()

	// Actually use role in a comment to avoid the unused variable warning
	// Role: ${role} is used for authorization checks

	useEffect(() => {
		const fetchChains = async () => {
			try {
				const data = await getEmployeeChains(employeeId)
				console.log('Chains data:', data)
				setChainsData(data)
			} catch (err) {
				setError('Failed to load chains data')
				console.error('Error fetching chains:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchChains()
	}, [employeeId])

	const toggleChainExpand = (chainId: string) => {
		setChainsData(prev =>
			prev
				? prev.map(chain =>
						chain.chain_id === chainId
							? { ...chain, isExpanded: !chain.isExpanded }
							: chain
					)
				: null
		)
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const onAddSession = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		// Basic validation
		if (!formData.notes.trim() || !formData.scheduled_time) {
			toast({
				description: 'Please fill in all fields',
				type: 'error',
			})
			setIsSubmitting(false)
			return
		}

		try {
			// Make sure scheduled_time is in the future
			const scheduledDate = new Date(formData.scheduled_time)
			const now = new Date(Date.now() + 120000)

			if (scheduledDate < now) {
				toast({
					description: 'Scheduled time must be in the future',
					type: 'error',
				})
				setIsSubmitting(false)
				return
			}

			// Format the data properly
			const formattedData = {
				...formData,
				scheduled_time: scheduledDate.toISOString(),
			}

			const response = await fetch(`${API_URL}/admin/chains/create`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${auth.user?.accessToken}`,
				},
				body: JSON.stringify(formattedData),
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}

			const result = await response.json()

			// Show success message
			toast({
				description: 'Session scheduled successfully',
				type: 'success',
			})

			// Refresh the chains data
			const updatedChains = await getEmployeeChains(employeeId)
			setChainsData(updatedChains)

			// Close the modal
			setIsModalOpen(false)
			setFormData({
				employee_id: employeeId,
				notes: '',
				scheduled_time: new Date().toISOString().slice(0, 16),
			})

			console.log('Chain created:', result)
		} catch (error) {
			console.error('Error creating chain:', error)
			toast({
				description: 'Failed to schedule session',
				type: 'error',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const escalateChain = async (chainId: string) => {
		if (!chainId) return

		setIsEscalatingChain(true)
		try {
			const response = await fetch(
				`${API_URL}/admin/chains/${chainId}/escalate`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${auth.user?.accessToken}`,
					},
					// No request body needed for this endpoint
				}
			)

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`)
			}

			// Show success message
			toast({
				description: 'Chain completed successfully',
				type: 'success',
			})

			// Refresh the chains data
			const updatedChains = await getEmployeeChains(employeeId)
			setChainsData(updatedChains)

			// Reset state
			setEscalateChainId(null)
			setEscalateChainNotes('')
		} catch (error) {
			console.error('Error completing chain:', error)
			toast({
				description: 'Failed to complete chain',
				type: 'error',
			})
		} finally {
			setIsEscalatingChain(false)
		}
	}

	if (loading) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
				</div>
				<div className="flex items-center justify-center h-32">
					<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
				</div>
				<div className="text-red-500 text-center">{error}</div>
			</div>
		)
	}

	if (!chainsData || chainsData.length === 0) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Sessions History
					</h4>
					{role === 'admin' || role === 'hr' ? (
						<Button
							onClick={() => setIsModalOpen(true)}
							className="flex items-center gap-1 dark:text-white bg-blue-500"
							size="sm"
						>
							<Plus className="w-4 h-4" />
							Session
						</Button>
					) : null}
				</div>
				<div className="text-gray-500 text-center mb-4">No chains found</div>

				{/* Add Session Modal */}
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 dark:border-gray-700">
						<DialogHeader>
							<DialogTitle className="dark:text-white">
								Schedule New Session
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={onAddSession} className="space-y-4">
							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="employee_id"
									className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
								>
									Employee ID
									<span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-md font-medium">
										Autofilled
									</span>
								</label>
								<Input
									id="employee_id"
									name="employee_id"
									value={formData.employee_id}
									onChange={handleInputChange}
									disabled
									className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
								/>
								<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
									Session will be scheduled for this employee profile
								</p>
							</div>

							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="scheduled_time"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Scheduled Time
								</label>
								<div className="space-y-2">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={'outline'}
												className={cn(
													'w-full justify-start text-left font-normal dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
													!formData.scheduled_time && 'text-muted-foreground'
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{formData.scheduled_time ? (
													<span>
														{format(new Date(formData.scheduled_time), 'PPP')}
													</span>
												) : (
													<span>Pick a date</span>
												)}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
											<Calendar
												mode="single"
												selected={
													formData.scheduled_time
														? new Date(formData.scheduled_time)
														: undefined
												}
												onSelect={date => {
													if (date) {
														// Preserve the time part from the existing date if there is one
														const currentDate = formData.scheduled_time
															? new Date(formData.scheduled_time)
															: new Date()
														const newDate = new Date(date)
														newDate.setHours(currentDate.getHours())
														newDate.setMinutes(currentDate.getMinutes())

														setFormData(prev => ({
															...prev,
															scheduled_time: newDate.toISOString(),
														}))
													}
												}}
												className="dark:bg-gray-800 dark:text-gray-300"
												initialFocus
											/>
										</PopoverContent>
									</Popover>

									<div className="flex gap-2 items-center">
										<div className="relative flex-1">
											<Input
												id="time"
												name="time"
												type="time"
												value={
													formData.scheduled_time
														? format(new Date(formData.scheduled_time), 'HH:mm')
														: ''
												}
												onChange={e => {
													if (e.target.value && formData.scheduled_time) {
														const [hours, minutes] = e.target.value.split(':')
														const date = new Date(formData.scheduled_time)
														date.setHours(parseInt(hours, 10))
														date.setMinutes(parseInt(minutes, 10))

														setFormData(prev => ({
															...prev,
															scheduled_time: date.toISOString(),
														}))
													}
												}}
												className="pr-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
											/>
											<Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
										</div>

										<Button
											type="button"
											variant="outline"
											size="sm"
											className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
											onClick={() => {
												const now = new Date()
												if (formData.scheduled_time) {
													const date = new Date(formData.scheduled_time)
													date.setHours(now.getHours())
													date.setMinutes(now.getMinutes())

													setFormData(prev => ({
														...prev,
														scheduled_time: date.toISOString(),
													}))
												}
											}}
										>
											Now
										</Button>
									</div>
								</div>
							</div>

							<div className="grid w-full items-center gap-2">
								<label
									htmlFor="notes"
									className="text-sm font-medium text-gray-700 dark:text-gray-300"
								>
									Notes
								</label>
								<Textarea
									id="notes"
									name="notes"
									value={formData.notes}
									onChange={handleInputChange}
									placeholder="Enter session notes here..."
									className="resize-none min-h-[100px] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:placeholder-gray-500"
								/>
							</div>

							<DialogFooter className="gap-2 sm:gap-0">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsModalOpen(false)}
									className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
								>
									Cancel
								</Button>
								<Button
									type="submit"
									disabled={isSubmitting}
									className="relative dark:bg-blue-600 dark:hover:bg-blue-700"
								>
									{isSubmitting && (
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-gray-300"></div>
										</div>
									)}
									<span className={isSubmitting ? 'opacity-0' : ''}>
										Schedule Session
									</span>
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		)
	}

	const activeChains = chainsData.filter(
		chain => chain.status === ChainStatus.ACTIVE
	)
	const completedChains = chainsData.filter(
		chain => chain.status === ChainStatus.COMPLETED
	)

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
			<div className="flex flex-col gap-6">
				<div>
					<div className="flex justify-between items-center mb-4">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Sessions History
						</h4>
						{role === 'admin' || role === 'hr' ? (
							<Button
								onClick={() => setIsModalOpen(true)}
								className="flex items-center gap-1 text-white bg-blue-500"
								size="sm"
							>
								<Plus className="w-4 h-4" />
								Add Chain
							</Button>
						) : null}
					</div>

					{/* Add Session Modal */}
					<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
						<DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle className="dark:text-white">
									Schedule New Session
								</DialogTitle>
							</DialogHeader>
							<form onSubmit={onAddSession} className="space-y-4">
								<div className="grid w-full items-center gap-2">
									<label
										htmlFor="employee_id"
										className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
									>
										Employee ID
										<span className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-0.5 rounded-md font-medium">
											Autofilled
										</span>
									</label>
									<Input
										id="employee_id"
										name="employee_id"
										value={formData.employee_id}
										onChange={handleInputChange}
										disabled
										className="bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
									/>
									<p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
										Session will be scheduled for this employee profile
									</p>
								</div>

								<div className="grid w-full items-center gap-2">
									<label
										htmlFor="scheduled_time"
										className="text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Scheduled Time
									</label>
									<div className="space-y-2">
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant={'outline'}
													className={cn(
														'w-full justify-start text-left font-normal dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
														!formData.scheduled_time && 'text-muted-foreground'
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{formData.scheduled_time ? (
														<span>
															{format(new Date(formData.scheduled_time), 'PPP')}
														</span>
													) : (
														<span>Pick a date</span>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
												<Calendar
													mode="single"
													selected={
														formData.scheduled_time
															? new Date(formData.scheduled_time)
															: undefined
													}
													onSelect={date => {
														if (date) {
															// Preserve the time part from the existing date if there is one
															const currentDate = formData.scheduled_time
																? new Date(formData.scheduled_time)
																: new Date()
															const newDate = new Date(date)
															newDate.setHours(currentDate.getHours())
															newDate.setMinutes(currentDate.getMinutes())

															setFormData(prev => ({
																...prev,
																scheduled_time: newDate.toISOString(),
															}))
														}
													}}
													className="dark:bg-gray-800 dark:text-gray-300"
													initialFocus
												/>
											</PopoverContent>
										</Popover>

										<div className="flex gap-2 items-center">
											<div className="relative flex-1">
												<Input
													id="time"
													name="time"
													type="time"
													value={
														formData.scheduled_time
															? format(
																	new Date(formData.scheduled_time),
																	'HH:mm'
																)
															: ''
													}
													onChange={e => {
														if (e.target.value && formData.scheduled_time) {
															const [hours, minutes] = e.target.value.split(':')
															const date = new Date(formData.scheduled_time)
															date.setHours(parseInt(hours, 10))
															date.setMinutes(parseInt(minutes, 10))

															setFormData(prev => ({
																...prev,
																scheduled_time: date.toISOString(),
															}))
														}
													}}
													className="pr-10 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
												/>
												<Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
											</div>

											<Button
												type="button"
												variant="outline"
												size="sm"
												className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
												onClick={() => {
													const now = new Date()
													if (formData.scheduled_time) {
														const date = new Date(formData.scheduled_time)
														date.setHours(now.getHours())
														date.setMinutes(now.getMinutes())

														setFormData(prev => ({
															...prev,
															scheduled_time: date.toISOString(),
														}))
													}
												}}
											>
												Now
											</Button>
										</div>
									</div>
								</div>

								<div className="grid w-full items-center gap-2">
									<label
										htmlFor="notes"
										className="text-sm font-medium text-gray-700 dark:text-gray-300"
									>
										Notes
									</label>
									<Textarea
										id="notes"
										name="notes"
										value={formData.notes}
										onChange={handleInputChange}
										placeholder="Enter session notes here..."
										className="resize-none min-h-[100px] dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:placeholder-gray-500"
									/>
								</div>

								<DialogFooter className="gap-2 sm:gap-0">
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsModalOpen(false)}
										className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
									>
										Cancel
									</Button>
									<Button
										type="submit"
										disabled={isSubmitting}
										className="relative dark:bg-blue-600 dark:hover:bg-blue-700"
									>
										{isSubmitting && (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-gray-300"></div>
											</div>
										)}
										<span className={isSubmitting ? 'opacity-0' : ''}>
											Schedule Session
										</span>
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</Dialog>

					{activeChains.length > 0 && (
						<Link href={`/chat-page/${activeChains[0].session_ids[0]}`}>
							<div className="mt-2 mb-4 p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 flex items-center justify-between group">
								<div className="flex items-center">
									<div className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
									<span>
										This Employee has an active session - Click to join
									</span>
								</div>
								<ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
							</div>
						</Link>
					)}

					{/* Chain Summary */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer">
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Completed Chains
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{completedChains.length}
							</p>
						</div>
					</div>

					{/* Chains Table */}
					<div>
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Chain Records
						</h5>
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[150px]"
										>
											Status
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[250px]"
										>
											Scheduled At
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
										>
											Chain ID
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[120px]"
										>
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{chainsData
										.sort(
											(a: ChainType, b: ChainType) =>
												new Date(b.created_at).getTime() -
												new Date(a.created_at).getTime()
										)
										.map(chain => (
											<React.Fragment key={chain.chain_id}>
												<tr
													onClick={() => toggleChainExpand(chain.chain_id)}
													onMouseEnter={() => setHoveredRow(chain.chain_id)}
													onMouseLeave={() => setHoveredRow(null)}
													className={`cursor-pointer transition-all duration-200 ${
														hoveredRow === chain.chain_id
															? 'bg-gray-50 dark:bg-gray-800'
															: 'hover:bg-gray-50 dark:hover:bg-gray-800'
													} ${chain.isExpanded ? 'bg-gray-50 dark:bg-gray-800 border-l-4 border-l-blue-500 dark:border-l-blue-600' : ''}`}
												>
													<td className="px-6 py-4 whitespace-nowrap text-sm">
														<span
															className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getChainStatusColor(
																chain.status
															)}`}
														>
															{chain.status === ChainStatus.ACTIVE && (
																<span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
															)}
															{chain.status}
														</span>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90">
														<div className="flex items-center">
															<CalendarIcon className="h-3.5 w-3.5 mr-2 text-gray-400" />
															{formatDate(chain.created_at)}
														</div>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 flex justify-between items-center">
														<div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
															{chain.chain_id}
														</div>
														<ChevronDown
															className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${chain.isExpanded ? 'transform rotate-180 text-blue-500' : ''}`}
															onClick={() => toggleChainExpand(chain.chain_id)}
														/>
													</td>
													<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 text-right">
														{chain.status === ChainStatus.ACTIVE &&
															(role === 'admin' || role === 'hr') && (
																<Button
																	size="sm"
																	variant="outline"
																	className="h-8 px-3 text-xs bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 border-green-200 dark:border-green-800 shadow-sm hover:shadow transition-all"
																	onClick={e => {
																		e.stopPropagation()
																		setEscalateChainId(chain.chain_id)
																	}}
																>
																	<CheckCircle className="h-3.5 w-3.5 mr-1.5" />
																	Mark as Complete
																</Button>
															)}
													</td>
												</tr>
												{chain.isExpanded && chain.session_ids.length > 0 && (
													<tr className="bg-gray-50 dark:bg-gray-800/80">
														<td colSpan={4} className="px-6 py-3">
															<div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300 flex items-center">
																<div className="h-1 w-1 bg-blue-500 rounded-full mr-2"></div>
																Sessions:
															</div>
															<div className="grid gap-2">
																{chain.session_ids.map(sessionId => {
																	const sessionStatus =
																		getSessionStatusFromChain(chain)
																	return (
																		<div
																			key={sessionId}
																			onClick={() =>
																				router.push(`/chat-page/${sessionId}`)
																			}
																			className="p-2.5 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow"
																		>
																			<span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-800 dark:text-white/90">
																				{sessionId}
																			</span>
																			<div className="flex items-center gap-2">
																				{sessionStatus === 'COMPLETED' && (
																					<Button
																						size="sm"
																						variant="outline"
																						className="h-8 px-3 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 border-blue-200 dark:border-blue-800 shadow-sm hover:shadow transition-all"
																						onClick={e => {
																							e.stopPropagation()
																							router.push(
																								`/report/${employeeId}${sessionId}${sessionStatus.toLowerCase()}`
																							)
																						}}
																					>
																						<FileText className="h-3.5 w-3.5 mr-1.5" />
																						Report
																					</Button>
																				)}
																				<Button
																					size="sm"
																					variant="ghost"
																					onClick={e => {
																						e.stopPropagation()
																						router.push(
																							`/chat-page/${sessionId}`
																						)
																					}}
																					className="h-8 w-8 p-0 rounded-full hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
																				>
																					<ChevronRight className="h-5 w-5" />
																				</Button>
																			</div>
																		</div>
																	)
																})}
															</div>
														</td>
													</tr>
												)}
											</React.Fragment>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>

			{/* Escalate Chain Modal */}
			<Dialog
				open={!!escalateChainId}
				onOpenChange={open => !open && setEscalateChainId(null)}
			>
				<DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white">
					<DialogHeader>
						<DialogTitle className="dark:text-white">
							Complete Chain
						</DialogTitle>
					</DialogHeader>
					<div className="py-3">
						<div className="mb-4">
							<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
								Chain ID
							</label>
							<div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
								{escalateChainId}
							</div>
						</div>

						<p className="text-sm text-gray-600 dark:text-gray-400">
							Are you sure you want to complete this chain? This action cannot
							be undone.
						</p>
					</div>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => setEscalateChainId(null)}
							className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
						>
							Cancel
						</Button>
						<Button
							onClick={() => escalateChainId && escalateChain(escalateChainId)}
							disabled={isEscalatingChain}
							className="relative bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
						>
							{isEscalatingChain && (
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-gray-300"></div>
								</div>
							)}
							<span className={isEscalatingChain ? 'opacity-0' : ''}>
								Complete Chain
							</span>
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
