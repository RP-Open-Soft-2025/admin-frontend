'use client'
import React, { useEffect, useState } from 'react'
import { SessionType, SessionStatus } from '@/types/sessions'
import { getSessionsData } from '@/services/profileService'
import { useRouter } from 'next/navigation'
import { CalendarIcon, Clock, Plus } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { 
	Dialog, 
	DialogContent, 
	DialogHeader, 
	DialogTitle, 
	DialogDescription,
	DialogFooter, 
	DialogTrigger,
	DialogClose
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import store from '@/redux/store'
import { API_URL } from '@/constants'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '../../components/ui/calendar'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

// Props interface
interface UserSessionsCardProps {
	employeeId: string
	role: string
}

// Modify the convertToIST function
const convertToIST = (dateString: string) => {
	const date = new Date(dateString)
	// Add 5 hours and 30 minutes to convert to IST
	date.setHours(date.getHours() + 5)
	date.setMinutes(date.getMinutes() + 30)
	return date
}

// Modify the formatDate function to use IST timezone
const formatDate = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', {
		day: 'numeric',
		month: 'long',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
		timeZone: 'Asia/Kolkata'
	})
}

// Helper function to get session status color
const getSessionStatusColor = (status: SessionStatus) => {
	switch (status) {
		case SessionStatus.ACTIVE:
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
		case SessionStatus.COMPLETED:
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
		case SessionStatus.CANCELLED:
			return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
		case SessionStatus.PENDING:
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	}
}

// Create a new session 
const createSession = async (userId: string, data: { scheduled_at: string, notes: string }, role: string) => {
	try {
		// Get auth token from Redux store
		const { auth } = store.getState()
		const token = auth.user?.accessToken

		if (!token) {
			throw new Error('Authentication token not found')
		}

		const response = await fetch(`${API_URL}/${role}/session/${userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(data),
		})

		if (!response.ok) {
			throw new Error(`Error creating session: ${response.statusText}`)
		}

		return await response.json()
	} catch (error) {
		console.error('Failed to create session:', error)
		throw error
	}
}

export default function UserSessionsCard({
	employeeId,
	role,
}: UserSessionsCardProps) {
	const [sessionsData, setSessionsData] = useState<SessionType[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [hoveredRow, setHoveredRow] = useState<string | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [scheduledDate, setScheduledDate] = useState('')
	const [scheduledTime, setScheduledTime] = useState('')
	const [notes, setNotes] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const fetchSessions = async () => {
			try {
				const data = await getSessionsData(employeeId)
				console.log(data)
				setSessionsData(data)
			} catch (err) {
				setError('Failed to load sessions data')
				console.error('Error fetching sessions:', err)
			} finally {
				setLoading(false)
			}
		}

		fetchSessions()
	}, [employeeId])

	const handleCreateSession = async () => {
		if (!scheduledDate || !scheduledTime) {
			toast({
				description: "Please select a date and time for the session",
				type: "error"
			})
			return
		}

		try {
			setIsSubmitting(true)
			// Combine date and time
			const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`)
			
			// Call API to create session
			await createSession(employeeId, {
				scheduled_at: scheduledAt.toISOString(),
				notes: notes
			}, role)

			// Refresh sessions data
			const data = await getSessionsData(employeeId)
			setSessionsData(data)
			
			// Close dialog and reset form
			setIsDialogOpen(false)
			setScheduledDate('')
			setScheduledTime('')
			setNotes('')
			
			toast({
				description: "Session created successfully",
				type: "success"
			})
		} catch (err) {
			console.error('Error creating session:', err)
			toast({
				description: "Failed to create session", 
				type: "error"
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	if (loading) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Session History
					</h4>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button 
								size="sm" 
								className="flex items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
							>
								<Plus className="h-4 w-4 mr-1" /> Add Session
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle className="text-gray-900 dark:text-white">Schedule a New Session</DialogTitle>
								<DialogDescription className="text-gray-500 dark:text-gray-400">
									Create a new session for this employee. Pick a date and time.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-2">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{scheduledDate ? format(new Date(scheduledDate), "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start" className="w-auto p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" sideOffset={8}>
											<Calendar
												mode="single"
												selected={scheduledDate ? new Date(scheduledDate) : undefined}
												onSelect={(date: Date | undefined) => date && setScheduledDate(format(date, "yyyy-MM-dd"))}
												initialFocus
												disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
												className="border-none bg-white dark:bg-gray-900"
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Time
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledTime && "text-muted-foreground"
												)}
											>
												<Clock className="mr-2 h-4 w-4" />
												{scheduledTime ? scheduledTime : <span>Select a time</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
											<div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
												{Array.from({ length: 24 }).map((_, hour) =>
													['00', '30'].map((minute) => {
														const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
														return (
															<Button
																key={timeString}
																variant="outline"
																size="sm"
																onClick={() => setScheduledTime(timeString)}
																className={cn(
																	"hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700",
																	scheduledTime === timeString && "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800"
																)}
															>
																{timeString}
															</Button>
														);
													})
												)}
											</div>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Notes (Optional)
									</label>
									<Textarea
										id="notes"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Add any additional notes about this session"
										rows={3}
										className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button 
									variant="outline" 
									onClick={() => setIsDialogOpen(false)}
									className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
								>
									Cancel
								</Button>
								<Button 
									onClick={handleCreateSession} 
									disabled={isSubmitting || !scheduledDate || !scheduledTime}
									className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
								>
									{isSubmitting ? 'Creating...' : 'Create Session'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
						Session History
					</h4>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button 
								size="sm" 
								className="flex items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
							>
								<Plus className="h-4 w-4 mr-1" /> Add Session
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle className="text-gray-900 dark:text-white">Schedule a New Session</DialogTitle>
								<DialogDescription className="text-gray-500 dark:text-gray-400">
									Create a new session for this employee. Pick a date and time.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-2">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{scheduledDate ? format(new Date(scheduledDate), "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start" className="w-auto p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" sideOffset={8}>
											<Calendar
												mode="single"
												selected={scheduledDate ? new Date(scheduledDate) : undefined}
												onSelect={(date: Date | undefined) => date && setScheduledDate(format(date, "yyyy-MM-dd"))}
												initialFocus
												disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
												className="border-none bg-white dark:bg-gray-900"
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Time
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledTime && "text-muted-foreground"
												)}
											>
												<Clock className="mr-2 h-4 w-4" />
												{scheduledTime ? scheduledTime : <span>Select a time</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
											<div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
												{Array.from({ length: 24 }).map((_, hour) =>
													['00', '30'].map((minute) => {
														const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
														return (
															<Button
																key={timeString}
																variant="outline"
																size="sm"
																onClick={() => setScheduledTime(timeString)}
																className={cn(
																	"hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700",
																	scheduledTime === timeString && "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800"
																)}
															>
																{timeString}
															</Button>
														);
													})
												)}
											</div>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Notes (Optional)
									</label>
									<Textarea
										id="notes"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Add any additional notes about this session"
										rows={3}
										className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button 
									variant="outline" 
									onClick={() => setIsDialogOpen(false)}
									className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
								>
									Cancel
								</Button>
								<Button 
									onClick={handleCreateSession} 
									disabled={isSubmitting || !scheduledDate || !scheduledTime}
									className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
								>
									{isSubmitting ? 'Creating...' : 'Create Session'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="text-red-500 text-center">{error}</div>
			</div>
		)
	}

	if (!sessionsData || sessionsData.length === 0) {
		return (
			<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
						Session History
					</h4>
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button 
								size="sm" 
								className="flex items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
							>
								<Plus className="h-4 w-4 mr-1" /> Add Session
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
							<DialogHeader>
								<DialogTitle className="text-gray-900 dark:text-white">Schedule a New Session</DialogTitle>
								<DialogDescription className="text-gray-500 dark:text-gray-400">
									Create a new session for this employee. Pick a date and time.
								</DialogDescription>
							</DialogHeader>
							<div className="space-y-4 py-2">
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Date
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{scheduledDate ? format(new Date(scheduledDate), "PPP") : <span>Pick a date</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent align="start" className="w-auto p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" sideOffset={8}>
											<Calendar
												mode="single"
												selected={scheduledDate ? new Date(scheduledDate) : undefined}
												onSelect={(date: Date | undefined) => date && setScheduledDate(format(date, "yyyy-MM-dd"))}
												initialFocus
												disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
												className="border-none bg-white dark:bg-gray-900"
											/>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Time
									</label>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant="outline"
												className={cn(
													"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
													!scheduledTime && "text-muted-foreground"
												)}
											>
												<Clock className="mr-2 h-4 w-4" />
												{scheduledTime ? scheduledTime : <span>Select a time</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
											<div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
												{Array.from({ length: 24 }).map((_, hour) =>
													['00', '30'].map((minute) => {
														const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
														return (
															<Button
																key={timeString}
																variant="outline"
																size="sm"
																onClick={() => setScheduledTime(timeString)}
																className={cn(
																	"hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700",
																	scheduledTime === timeString && "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800"
																)}
															>
																{timeString}
															</Button>
														);
													})
												)}
											</div>
										</PopoverContent>
									</Popover>
								</div>
								<div className="space-y-2">
									<label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
										Notes (Optional)
									</label>
									<Textarea
										id="notes"
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder="Add any additional notes about this session"
										rows={3}
										className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button 
									variant="outline" 
									onClick={() => setIsDialogOpen(false)}
									className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
								>
									Cancel
								</Button>
								<Button 
									onClick={handleCreateSession} 
									disabled={isSubmitting || !scheduledDate || !scheduledTime}
									className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
								>
									{isSubmitting ? 'Creating...' : 'Create Session'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
				<div className="text-gray-500 text-center">No sessions found</div>
			</div>
		)
	}

	const activeSessions = sessionsData.filter(
		session => session.status === SessionStatus.ACTIVE
	)
	const completedSessions = sessionsData.filter(
		session => session.status === SessionStatus.COMPLETED
	)
	// const pendingSessions = sessionsData.filter(
	// 	session => session.status === SessionStatus.PENDING
	// )

	return (
		<div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 transition-all duration-300 hover:shadow-lg">
			<div className="flex flex-col gap-6">
				<div>
					<div className="flex justify-between items-center mb-4">
						<h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
							Session History
						</h4>
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button 
									size="sm" 
									className="flex items-center bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
								>
									<Plus className="h-4 w-4 mr-1" /> Add Session
								</Button>
							</DialogTrigger>
							<DialogContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
								<DialogHeader>
									<DialogTitle className="text-gray-900 dark:text-white">Schedule a New Session</DialogTitle>
									<DialogDescription className="text-gray-500 dark:text-gray-400">
										Create a new session for this employee. Pick a date and time.
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-2">
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Date
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
														!scheduledDate && "text-muted-foreground"
													)}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{scheduledDate ? format(new Date(scheduledDate), "PPP") : <span>Pick a date</span>}
												</Button>
											</PopoverTrigger>
											<PopoverContent align="start" className="w-auto p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg" sideOffset={8}>
												<Calendar
													mode="single"
													selected={scheduledDate ? new Date(scheduledDate) : undefined}
													onSelect={(date: Date | undefined) => date && setScheduledDate(format(date, "yyyy-MM-dd"))}
													initialFocus
													disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
													className="border-none bg-white dark:bg-gray-900"
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="space-y-2">
										<label className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Time
										</label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
														!scheduledTime && "text-muted-foreground"
													)}
												>
													<Clock className="mr-2 h-4 w-4" />
													{scheduledTime ? scheduledTime : <span>Select a time</span>}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
												<div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto">
													{Array.from({ length: 24 }).map((_, hour) =>
														['00', '30'].map((minute) => {
															const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
															return (
																<Button
																	key={timeString}
																	variant="outline"
																	size="sm"
																	onClick={() => setScheduledTime(timeString)}
																	className={cn(
																		"hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 dark:border-gray-700",
																		scheduledTime === timeString && "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800"
																	)}
																>
																	{timeString}
																</Button>
															);
														})
													)}
												</div>
											</PopoverContent>
										</Popover>
									</div>
									<div className="space-y-2">
										<label htmlFor="notes" className="text-sm font-medium text-gray-700 dark:text-gray-300">
											Notes (Optional)
										</label>
										<Textarea
											id="notes"
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
											placeholder="Add any additional notes about this session"
											rows={3}
											className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
										/>
									</div>
								</div>
								<DialogFooter>
									<Button 
										variant="outline" 
										onClick={() => setIsDialogOpen(false)}
										className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
									>
										Cancel
									</Button>
									<Button 
										onClick={handleCreateSession} 
										disabled={isSubmitting || !scheduledDate || !scheduledTime}
										className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
									>
										{isSubmitting ? 'Creating...' : 'Create Session'}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					{activeSessions.length > 0 && (
					<div 
						onClick={() => router.push('/chat-page/'+activeSessions[0].chat_id)} 
						className="mt-2 mb-4 p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-all duration-200 flex items-center"
					>
						<div className="h-2 w-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
						<span>You have an active session pending to join</span>
					</div>
					)}

					{/* Session Summary */}
					<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						
						<div
							onClick={() => router.push(`/${role}/sessions/pending`)}
							className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer"
						>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Completed Sessions
							</p>
							<p className="mt-1 text-base font-medium text-gray-800 dark:text-white/90">
								{completedSessions.length}
							</p>
						</div>
					</div>

					{/* Sessions Table */}
					<div>
						<h5 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
							Session Records
						</h5>
						<div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
							<table className="w-full min-w-full divide-y divide-gray-200 dark:divide-gray-700">
								<thead className="bg-gray-50 dark:bg-gray-800">
									<tr>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[200px]"
										>
											Status
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[300px]"
										>
											Scheduled At
										</th>
										<th
											scope="col"
											className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[200px]"
										>
											Chat ID
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
									{sessionsData
										.sort(
											(a: SessionType, b: SessionType) =>
												new Date(b.scheduled_at).getTime() -
												new Date(a.scheduled_at).getTime()
										)
										.map(session => (
											<tr
												key={session.session_id}
												onClick={() =>
													router.push(`/chat-page/${session.chat_id}`)
												}
												onMouseEnter={() => setHoveredRow(session.session_id)}
												onMouseLeave={() => setHoveredRow(null)}
												className={`cursor-pointer transition-all duration-200 ${
													hoveredRow === session.session_id
														? 'bg-gray-50 dark:bg-gray-800 shadow-sm'
														: 'hover:bg-gray-50 dark:hover:bg-gray-800'
												}`}
											>
												<td className="px-6 py-4 whitespace-nowrap text-sm w-[200px]">
													<span
														className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${getSessionStatusColor(
															session.status as SessionStatus
														)}`}
													>
														{session.status}
													</span>
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 w-[300px]">
													{formatDate(session.scheduled_at)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-white/90 w-[200px]">
													{session.chat_id}
												</td>
											</tr>
										))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
