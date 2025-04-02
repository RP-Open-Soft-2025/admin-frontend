'use client'
import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useModal } from '@/hooks/useModal'
import store from '@/redux/store'
import { toast } from '@/components/ui/sonner'
import {
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
}
.event-fc-color {
	display: flex;
	align-items: center;
	gap: 4px;
	cursor: pointer;
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

/* Fix for time grid views */
.fc-timegrid-event {
	border-radius: 4px !important;
	padding: 2px !important;
}

.fc-timegrid-event .fc-event-main {
	padding: 2px 4px !important;
}

.fc-timegrid-event .fc-event-title {
	font-weight: 500 !important;
}

.fc-v-event {
	border: none !important;
}

/* Override header toolbar buttons */
.fc-toolbar button {
	text-transform: capitalize !important;
}

.fc-today-button {
	text-transform: capitalize !important;
}

/* Custom filter toolbar button */
.fc-filterEvents-button {
	position: relative !important;
}
`

const RenderEventContent = (eventInfo: EventContentArg) => {
	const calendarType = eventInfo.event.extendedProps.calendar.toLowerCase()
	const isTimeGridView = eventInfo.view.type.includes('timeGrid')
	
	if (isTimeGridView) {
		return (
			<div className={`fc-event-main fc-bg-${calendarType} p-1 rounded-sm w-full h-full`}>
				<div className="text-white font-medium">{eventInfo.event.title}</div>
			</div>
		)
	}
	
	return (
		<a
			className={`event-fc-color flex fc-event-main fc-bg-${calendarType} p-1 rounded-sm w-full`}
			href={eventInfo.event.extendedProps.redirectUrl}
		>
			<div className="fc-daygrid-event-dot"></div>
			<div className="text-white">{eventInfo.event.title}</div>
		</a>
	)
}

type FilterType = 'all' | 'meetings' | 'sessions';

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [activeFilter, setActiveFilter] = useState<FilterType>('all')
	const calendarRef = useRef<FullCalendar>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { isOpen, openModal, closeModal } = useModal()
	const { auth } = store.getState()

	const handleAuthError = () => {
		toast({
			type: 'error',
			description: 'Your session has expired. Please login again.',
		})
		router.push('/login')
	}


	useEffect(() => {
		const fetchMeetings = async () => {
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
					const time = meet.scheduled_at.split('T')[1].split('+')[0].trim()
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
					const time = session.scheduled_at.split('T')[1].split('+')[0].trim()
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
			}
		}
		fetchMeetings()
	}, [auth.user])
	
	// Filter events when activeFilter changes
	useEffect(() => {
		if (activeFilter === 'all') {
			setEvents(allEvents);
		} else if (activeFilter === 'meetings') {
			setEvents(allEvents.filter(event => event.extendedProps.eventType === 'meeting'));
		} else if (activeFilter === 'sessions') {
			setEvents(allEvents.filter(event => event.extendedProps.eventType === 'session'));
		}
	}, [activeFilter, allEvents]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		resetModalFields()
		setEventStartDate(selectInfo.startStr)
		openModal()
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

	return (
		<div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
			<style>{calendarStyles}</style>
			
			<div className="custom-calendar">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					headerToolbar={{
						left: 'prev,next customFilterContainer',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay',
					}}
					events={events}
					selectable={true}
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventContent={RenderEventContent}
					dayMaxEvents={5}
					moreLinkClick="popover"
					customButtons={{
						customFilterContainer: {
							text: '',
							click: function() {
								// This function is needed but will not be used
							},
							// We'll use the DOM API to create our dropdown in the componentDidMount lifecycle
							// Remove the 'render' property and handle the dropdown creation after the calendar mounts
						}
					}}
				/>
			</div>

			{/* MODAL FOR ADDING/EDITING EVENTS */}
		</div>
	)
}

export default Calendar
