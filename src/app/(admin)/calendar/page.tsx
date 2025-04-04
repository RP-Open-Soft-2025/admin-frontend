'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useModal } from '@/hooks/useModal'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import {
	EventApi,
	EventInput,
	DateSelectArg,
	EventClickArg,
	EventContentArg,
} from '@fullcalendar/core'
import { API_URL } from '@/constants'
import { Meeting } from '@/types/meets'
import { SessionType } from '@/types/sessions'
import { SessionStatus } from '@/types/sessions'
import { useRouter } from 'next/navigation'

interface CalendarEvent extends EventInput {
	extendedProps: {
		calendar: string
		redirectUrl: string
		eventType: 'meeting' | 'session'
	}
}

// Add this interface after the CalendarEvent interface
interface TodayEvent {
    title: string
    time: string
    type: 'meeting' | 'session'
    status: string
    redirectUrl: string
}

// Add CSS for event styling
const calendarStyles = `
.fc-bg-primary {
	background-color: #4338ca !important;
	color: white !important;
	border-color: #4338ca !important;
}
.fc-bg-success {
	background-color: #10b981 !important;
	color: white !important;
	border-color: #10b981 !important;
}
.fc-bg-info {
	background-color: #3b82f6 !important;
	color: white !important;
	border-color: #3b82f6 !important;
}
.fc-bg-warning {
	background-color: #f59e0b !important;
	color: white !important;
	border-color: #f59e0b !important;
}
.fc-bg-error {
	background-color: #ef4444 !important;
	color: white !important;
	border-color: #ef4444 !important;
}
.fc-daygrid-more-link {
	font-weight: bold;
	color: #6b7280;
}
.fc-event {
	cursor: pointer;
	border-radius: 4px;
	padding: 2px 4px;
	margin-bottom: 2px;
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	box-shadow: 0 1px 2px rgba(0,0,0,0.05);
	transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.fc-event:hover {
	box-shadow: 0 2px 4px rgba(0,0,0,0.1);
	transform: translateY(-1px);
}
.event-fc-color {
	display: flex;
	align-items: center;
	gap: 4px;
	cursor: pointer;
	max-width: 100%;
	overflow: hidden;
}

/* Text styling for event titles */
.fc-event-title {
    font-size: 0.75rem !important;
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    max-width: 100% !important;
    display: block !important;
}

/* Fix popover scrolling */
.fc-more-popover {
    max-height: 80vh !important;
    overflow-y: auto !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
    border-radius: 8px !important;
    border: 1px solid rgba(0,0,0,0.1) !important;
}

.fc-popover-body {
    max-height: calc(80vh - 40px) !important;
    overflow-y: auto !important;
    padding: 8px !important;
}

.fc-popover-header {
    padding: 8px !important;
    font-weight: 600 !important;
}

/* Prevent body scrolling when popover is open */
body.fc-popover-open {
    overflow: hidden !important;
}

/* Custom filter dropdown styles */
.filter-dropdown {
	position: relative;
	display: inline-block;
	margin-left: 10px;
}

.filter-dropdown select {
	appearance: none;
	background-color: #ffffff;
	border: 1px solid #e5e7eb;
	border-radius: 4px;
	padding: 4px 28px 4px 10px;
	font-size: 14px;
	cursor: pointer;
	color: #374151;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 8px center;
	background-size: 16px;
}

.dark .filter-dropdown select {
	background-color: #1f2937;
	border-color: #374151;
	color: #e5e7eb;
	background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e5e7eb'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
}

.filter-dropdown select:focus {
	outline: none;
	border-color: #4f46e5;
	box-shadow: 0 0 0 1px #4f46e5;
}

/* Enhanced timegrid styles */
.fc-timegrid-event {
	border-radius: 6px !important;
	padding: 2px !important;
	border: none !important;
	box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
	transition: box-shadow 0.2s ease, opacity 0.2s ease !important;
	opacity: 0.9 !important;
}

.fc-timegrid-event:hover {
	box-shadow: 0 4px 8px rgba(0,0,0,0.12) !important;
	opacity: 1 !important;
	z-index: 10 !important;
}

.fc-timegrid-event .fc-event-main {
	padding: 3px 6px !important;
}

.fc-timegrid-event .fc-event-title {
	font-weight: 500 !important;
	line-height: 1.2 !important;
}

/* Handle overlapping events better */
.fc-timegrid-col-events {
	margin: 0 2px !important;
}

.fc-v-event {
	border: none !important;
	background-color: transparent !important;
}

/* Better day headers */
.fc-col-header-cell {
	padding: 8px 0 !important;
	font-weight: 600 !important;
}

.fc-col-header-cell-cushion {
	padding: 6px !important;
	color: #4b5563 !important;
}

.dark .fc-col-header-cell-cushion {
	color: #e5e7eb !important;
}

/* Improve the time slots */
.fc-timegrid-slot {
	height: 48px !important;
	border-color: rgba(0,0,0,0.06) !important;
}

.dark .fc-timegrid-slot {
	border-color: rgba(255,255,255,0.06) !important;
}

.fc-timegrid-slot-label {
	color: #6b7280 !important;
}

.dark .fc-timegrid-slot-label {
	color: #9ca3af !important;
}

/* Override header toolbar buttons */
.fc-toolbar {
	margin-bottom: 1.5rem !important;
	flex-wrap: wrap !important;
	gap: 8px !important;
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
	position: relative !important;
}

.fc-toolbar-chunk {
	display: flex !important;
	align-items: center !important;
	flex-wrap: wrap !important;
	gap: 8px !important;
}

/* Center the title */
.fc-toolbar-chunk:nth-child(2) {
	position: absolute !important;
	left: 50% !important;
	transform: translateX(-50%) !important;
	z-index: 1 !important;
}

.fc-toolbar-title {
	font-size: 1.25rem !important;
	font-weight: 600 !important;
	color: #374151 !important;
	white-space: nowrap !important;
}

.dark .fc-toolbar-title {
	color: #e5e7eb !important;
}

/* Position the side buttons */
.fc-toolbar-chunk:first-child {
	margin-right: auto !important;
}

.fc-toolbar-chunk:last-child {
	margin-left: auto !important;
}

.fc-toolbar button {
	text-transform: capitalize !important;
	border-radius: 6px !important;
	padding: 6px 12px !important;
	font-weight: 500 !important;
	box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
	border: 1px solid #e5e7eb !important;
	background-color: white !important;
	color: #374151 !important;
	transition: all 0.2s ease !important;
}

.dark .fc-toolbar button {
	background-color: #1f2937 !important;
	border-color: #374151 !important;
	color: #e5e7eb !important;
}

.fc-toolbar button:hover {
	background-color: #f9fafb !important;
	border-color: #d1d5db !important;
}

.dark .fc-toolbar button:hover {
	background-color: #374151 !important;
	border-color: #4b5563 !important;
}

.fc-toolbar button.fc-button-active {
	background-color: #4f46e5 !important;
	border-color: #4f46e5 !important;
	color: white !important;
}

.dark .fc-toolbar button.fc-button-active {
	background-color: #6366f1 !important;
	border-color: #6366f1 !important;
}

.fc-today-button {
	text-transform: capitalize !important;
}

/* Custom filter toolbar button */
.fc-filterEvents-button {
	position: relative !important;
}

/* Improve today highlighting */
.fc-day-today {
	background-color: rgba(79, 70, 229, 0.06) !important;
}

.dark .fc-day-today {
	background-color: rgba(99, 102, 241, 0.08) !important;
}

/* Improve cell hover effect */
.fc-daygrid-day:hover {
	background-color: rgba(0,0,0,0.02) !important;
}

.dark .fc-daygrid-day:hover {
	background-color: rgba(255,255,255,0.02) !important;
}
`

const RenderEventContent = (eventInfo: EventContentArg) => {
	const calendarType = eventInfo.event.extendedProps.calendar.toLowerCase()
	const isTimeGridView = eventInfo.view.type.includes('timeGrid')
	const timeText = eventInfo.timeText || ''
	const title = eventInfo.event.title

	if (isTimeGridView) {
		return (
			<div
				className={`fc-event-main fc-bg-${calendarType} p-1 rounded-sm w-full h-full flex flex-col`}
			>
				{timeText && (
					<div className="text-white text-[10px] opacity-90 font-medium mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap">
						{timeText}
					</div>
				)}
				<div className="text-white font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap">
					{title}
				</div>
			</div>
		)
	}

	return (
		<a
			className={`event-fc-color fc-event-main fc-bg-${calendarType} p-1 rounded-sm w-full flex items-center`}
			href={eventInfo.event.extendedProps.redirectUrl}
		>
			<div className="text-white text-xs overflow-hidden text-ellipsis whitespace-nowrap">
				{title}
			</div>
		</a>
	)
}

type FilterType = 'all' | 'meetings' | 'sessions'

const formatTimeInIST = (dateString: string) => {
	const date = new Date(dateString)
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
		timeZone: 'Asia/Kolkata'
	})
}

const Calendar: React.FC = () => {
	const router = useRouter()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventTitle, setEventTitle] = useState('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventStartDate, setEventStartDate] = useState('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventLevel, setEventLevel] = useState('')
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const [allEvents, setAllEvents] = useState<CalendarEvent[]>([])
	const [activeFilter, setActiveFilter] = useState<FilterType>('all')
	const [isLoading, setIsLoading] = useState(true)
	const calendarRef = useRef<FullCalendar>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { isOpen, openModal, closeModal } = useModal()
	const { auth } = store.getState()
	const [showDateModal, setShowDateModal] = useState(false)
	const [selectedDateEvents, setSelectedDateEvents] = useState<TodayEvent[]>([])
	const [selectedDate, setSelectedDate] = useState<string>('')
	const [showTodayModal, setShowTodayModal] = useState(false)
	const [todayEvents, setTodayEvents] = useState<TodayEvent[]>([])

	const handleAuthError = useCallback(() => {
		toast({
			description: 'Your session has expired. Please login again.',
			type: 'error',
		})
		router.push('/login')
	}, [router])

	useEffect(() => {
		const fetchMeetings = async () => {
			setIsLoading(true)
			if (!auth.user || !auth.user.accessToken) {
				handleAuthError()
				return
			}
			try {
				// Fetch meetings
				const meetingsResponse = await fetch(
					`${API_URL}/${auth.user.userRole}/meets`,
					{
						headers: {
							Authorization: `Bearer ${auth.user.accessToken}`,
						},
					}
				)

				// Fetch all session types
				const [activeResponse, completedResponse, pendingResponse] =
					await Promise.all([
						fetch(`${API_URL}/${auth.user.userRole}/sessions/active`, {
							headers: {
								Authorization: `Bearer ${auth.user.accessToken}`,
							},
						}),
						fetch(`${API_URL}/${auth.user.userRole}/sessions/completed`, {
							headers: {
								Authorization: `Bearer ${auth.user.accessToken}`,
							},
						}),
						fetch(`${API_URL}/${auth.user.userRole}/sessions/pending`, {
							headers: {
								Authorization: `Bearer ${auth.user.accessToken}`,
							},
						}),
					])

				if (
					!meetingsResponse.ok ||
					!activeResponse.ok ||
					!completedResponse.ok ||
					!pendingResponse.ok
				) {
					if (
						meetingsResponse.status === 401 ||
						activeResponse.status === 401 ||
						completedResponse.status === 401 ||
						pendingResponse.status === 401
					) {
						handleAuthError()
						return
					}
					throw new Error('Failed to fetch calendar data')
				}

				const meetingsData = await meetingsResponse.json()
				const [activeSessions, completedSessions, pendingSessions] =
					await Promise.all([
						activeResponse.json(),
						completedResponse.json(),
						pendingResponse.json(),
					])

				// Format meetings
				const formattedMeetings = meetingsData.map((meet: Meeting) => {
					const time = formatTimeInIST(meet.scheduled_at)
					return {
						id: meet.meet_id,
						title: `Meeting at ${time}`,
						start: meet.scheduled_at,
						url: meet.meeting_link,
						extendedProps: {
							calendar: 'primary',
							redirectUrl: meet.meeting_link,
							eventType: 'meeting',
						},
					}
				})

				// Format sessions with different colors based on status
				const formatSession = (session: SessionType, status: SessionStatus) => {
					const time = formatTimeInIST(session.scheduled_at)
					const colorMap: Record<SessionStatus, string> = {
						[SessionStatus.ACTIVE]: 'success',
						[SessionStatus.COMPLETED]: 'info',
						[SessionStatus.PENDING]: 'warning',
						[SessionStatus.CANCELLED]: 'error',
					}
					return {
						id: session.session_id,
						title: `Session at ${time}`,
						start: session.scheduled_at,
						url: session.employee_id,
						extendedProps: {
							calendar: colorMap[status],
							redirectUrl: `/chat-page/${session.chat_id}`,
							eventType: 'session',
						},
					}
				}

				const formattedSessions = [
					...activeSessions.map((session: SessionType) =>
						formatSession(session, SessionStatus.ACTIVE)
					),
					...completedSessions.map((session: SessionType) =>
						formatSession(session, SessionStatus.COMPLETED)
					),
					...pendingSessions.map((session: SessionType) =>
						formatSession(session, SessionStatus.PENDING)
					),
				]

				const combinedEvents = [...formattedMeetings, ...formattedSessions]
				setAllEvents(combinedEvents)
				setEvents(combinedEvents)
			} catch (error) {
				console.error('Error fetching calendar data:', error)
				if (error instanceof Error && error.message.includes('401')) {
					handleAuthError()
				}
			} finally {
				setIsLoading(false)
			}
		}
		fetchMeetings()
	}, [auth.user, handleAuthError])

	// Filter events when activeFilter changes
	useEffect(() => {
		if (activeFilter === 'all') {
			setEvents(allEvents)
		} else if (activeFilter === 'meetings') {
			setEvents(
				allEvents.filter(event => event.extendedProps.eventType === 'meeting')
			)
		} else if (activeFilter === 'sessions') {
			setEvents(
				allEvents.filter(event => event.extendedProps.eventType === 'session')
			)
		}
	}, [activeFilter, allEvents])

	const handleDateSelect = (info: DateSelectArg) => {
		const selectedDate = info.start
		const formattedDate = selectedDate.toISOString()
		const events = getEventsForDate(selectedDate)
		setSelectedDateEvents(events)
		setSelectedDate(formattedDate)
		setShowDateModal(true)
	}

	const handleEventClick = (clickInfo: EventClickArg) => {
		const event = clickInfo.event
		const redirectUrl = event.extendedProps.redirectUrl
		if (redirectUrl) {
			window.location.href = redirectUrl
		}
	}

	const resetModalFields = () => {
		setEventTitle('')
		setEventStartDate('')
		setEventLevel('')
		setSelectedEvent(null)
	}

	useEffect(() => {
		// Skip if calendarRef isn't available
		if (!calendarRef.current) return

		// Access the DOM element
		const calendarEl = document.querySelector('.fc')
		if (!calendarEl) return

		// Get the toolbar container
		const toolbarContainer = calendarEl.querySelector(
			'.fc-toolbar-chunk:first-child'
		)
		if (!toolbarContainer) return

		// Create filter dropdown
		const select = document.createElement('select')
		select.className =
			'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 ml-2 text-sm text-gray-700 dark:text-gray-200'

		// Add options
		const options = [
			{ value: 'all', label: 'All Events' },
			{ value: 'meetings', label: 'Meetings Only' },
			{ value: 'sessions', label: 'Sessions Only' },
		]

		options.forEach(option => {
			const optionEl = document.createElement('option')
			optionEl.value = option.value
			optionEl.text = option.label
			optionEl.selected = activeFilter === option.value
			select.appendChild(optionEl)
		})

		// Add change event listener
		select.addEventListener('change', e => {
			setActiveFilter((e.target as HTMLSelectElement).value as FilterType)
		})

		// Add the select to the toolbar
		toolbarContainer.appendChild(select)

		// Cleanup function
		return () => {
			if (toolbarContainer.contains(select)) {
				toolbarContainer.removeChild(select)
			}
		}
	}, [activeFilter, events])

	// Add this useEffect to handle body scrolling when popover opens/closes
	useEffect(() => {
		// Skip if calendarRef isn't available
		if (!calendarRef.current) return

		const handlePopoverOpen = () => {
			document.body.classList.add('fc-popover-open')
		}

		const handlePopoverClose = () => {
			document.body.classList.remove('fc-popover-open')
		}

		// Check for popover elements
		const observer = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (mutation.addedNodes.length) {
					// Check if a popover was added
					const popover = document.querySelector('.fc-more-popover')
					if (popover) {
						handlePopoverOpen()

						// Add a click event listener to the close button
						const closeButton = popover.querySelector('.fc-popover-close')
						if (closeButton) {
							closeButton.addEventListener('click', handlePopoverClose)
						}

						// Also handle clicking outside the popover
						document.addEventListener(
							'click',
							e => {
								if (
									e.target instanceof Element &&
									!popover.contains(e.target)
								) {
									handlePopoverClose()
								}
							},
							{ once: true }
						)
					}
				}
			})
		})

		// Start observing the document for popover elements
		observer.observe(document.body, { childList: true, subtree: true })

		return () => {
			observer.disconnect()
			handlePopoverClose() // Clean up when component unmounts
		}
	}, [])

	// Function to get events for a specific date
	const getEventsForDate = useCallback((date: Date) => {
		const startOfDay = new Date(date)
		startOfDay.setHours(0, 0, 0, 0)
		
		const endOfDay = new Date(date)
		endOfDay.setHours(23, 59, 59, 999)

		const dateEvents = events.filter(event => {
			const eventDate = new Date(event.start as string)
			return eventDate >= startOfDay && eventDate <= endOfDay
		}).map(event => ({
			title: event.title || 'Untitled Event',
			time: formatTimeInIST(event.start as string),
			type: event.extendedProps.eventType,
			status: event.extendedProps.calendar,
			redirectUrl: event.extendedProps.redirectUrl
		}))

		// Sort by time
		dateEvents.sort((a, b) => {
			const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
			const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
			return timeA - timeB
		})

		return dateEvents
	}, [events])

	// Function to format date for display
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-US', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		})
	}

	// Function to get today's events
	const getTodayEvents = useCallback(() => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		
		const tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		const todaysEvents = events.filter(event => {
			const eventDate = new Date(event.start as string)
			return eventDate >= today && eventDate < tomorrow
		}).map(event => ({
			title: event.title || 'Untitled Event',
			time: formatTimeInIST(event.start as string),
			type: event.extendedProps.eventType,
			status: event.extendedProps.calendar,
			redirectUrl: event.extendedProps.redirectUrl
		}))

		// Sort by time
		todaysEvents.sort((a, b) => {
			const timeA = new Date(`1970/01/01 ${a.time}`).getTime()
			const timeB = new Date(`1970/01/01 ${b.time}`).getTime()
			return timeA - timeB
		})

		setTodayEvents(todaysEvents)
		setShowTodayModal(true)
	}, [events])

	// Handle Today button click
	const handleTodayClick = useCallback(() => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi()
			calendarApi.today() // Navigate to today's date
			getTodayEvents() // Show today's events modal
		}
	}, [getTodayEvents])

	const handleDateClick = (date: Date) => {
		const events = getEventsForDate(date)
		setSelectedDateEvents(events)
		setSelectedDate(date.toISOString())
		setShowDateModal(true)
	}

	return (
		<div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] relative min-h-[400px] md:min-h-[600px]">
			<style>{calendarStyles}</style>

			{isLoading && (
				<div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 flex items-center justify-center z-50 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-3">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
						<p className="text-sm text-gray-600 dark:text-gray-300">Loading calendar events...</p>
					</div>
				</div>
			)}

			{/* Add new modal for selected date events */}
			{showDateModal && (
				<>
					<div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md" 
						onClick={() => setShowDateModal(false)} 
						style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
					/>
					<div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4" style={{ height: '500px' }}>
							<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Events for {formatDate(selectedDate)}
								</h2>
								<button
									onClick={() => setShowDateModal(false)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="h-[calc(500px-80px)] overflow-y-auto p-4">
								{selectedDateEvents.length > 0 ? (
									<div className="space-y-3">
										{selectedDateEvents.map((event, index) => (
											<a
												key={index}
												href={event.redirectUrl}
												className={`block p-3 rounded-lg border ${
													event.type === 'meeting'
														? 'bg-primary/10 border-primary/20'
														: `bg-${event.status}/10 border-${event.status}/20`
												} hover:opacity-80 transition-opacity`}
											>
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														{event.title}
													</span>
													<span className={`text-xs px-2 py-1 rounded-full ${
														event.type === 'meeting'
															? 'bg-primary/20 text-primary'
															: `bg-${event.status}/20 text-${event.status}`
													}`}>
														{event.time}
													</span>
												</div>
											</a>
										))}
									</div>
								) : (
									<p className="text-center text-gray-500 dark:text-gray-400">
										No events scheduled for this date
									</p>
								)}
							</div>
						</div>
					</div>
				</>
			)}

			{showTodayModal && (
				<>
					<div className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md" 
						onClick={() => setShowTodayModal(false)} 
						style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
					/>
					<div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden">
							<div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
								<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
									Today's Events
								</h2>
								<button
									onClick={() => setShowTodayModal(false)}
									className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
							<div className="p-4 overflow-y-auto max-h-[60vh]">
								{todayEvents.length > 0 ? (
									<div className="space-y-3">
										{todayEvents.map((event, index) => (
											<a
												key={index}
												href={event.redirectUrl}
												className={`block p-3 rounded-lg border ${
													event.type === 'meeting'
														? 'bg-primary/10 border-primary/20'
														: `bg-${event.status}/10 border-${event.status}/20`
												} hover:opacity-80 transition-opacity`}
											>
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium text-gray-900 dark:text-white">
														{event.title}
													</span>
													<span className={`text-xs px-2 py-1 rounded-full ${
														event.type === 'meeting'
															? 'bg-primary/20 text-primary'
															: `bg-${event.status}/20 text-${event.status}`
													}`}>
														{event.time}
													</span>
												</div>
											</a>
										))}
									</div>
								) : (
									<p className="text-center text-gray-500 dark:text-gray-400">
										No events scheduled for today
									</p>
								)}
							</div>
						</div>
					</div>
				</>
			)}

			<div className="custom-calendar">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					headerToolbar={{
						left: 'prev,next',
						center: 'title',
						right: 'todayCustom'
					}}
					customButtons={{
						todayCustom: {
							text: 'Today',
							click: handleTodayClick
						}
					}}
					events={events}
					selectable={true}
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventContent={RenderEventContent}
					dayMaxEvents={3}
					moreLinkClick="popover"
					height="auto"
					displayEventEnd={false}
					eventDisplay="block"
					slotDuration="00:30:00"
					slotLabelInterval="01:00"
					slotEventOverlap={false}
					allDaySlot={false}
					nowIndicator={true}
					selectMirror={true}
					unselectAuto={false}
					longPressDelay={0}
					selectLongPressDelay={0}
					eventLongPressDelay={0}
					selectMinDistance={0}
					dateClick={(info) => handleDateClick(info.date)}
				/>
			</div>
		</div>
	)
}

export default Calendar
