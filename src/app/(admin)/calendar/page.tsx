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
	max-width: 100%;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
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
    max-height: 400px !important;
    overflow-y: auto !important;
}

.fc-popover-body {
    max-height: 350px !important;
    overflow-y: auto !important;
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
				<div className="text-white font-medium text-xs overflow-hidden text-ellipsis whitespace-nowrap">{eventInfo.event.title}</div>
			</div>
		)
	}
	
	return (
		<a
			className={`event-fc-color fc-event-main fc-bg-${calendarType} p-1 rounded-sm w-full`}
			href={eventInfo.event.extendedProps.redirectUrl}
		>
			<div className="fc-daygrid-event-dot flex-shrink-0"></div>
			<div className="text-white text-xs overflow-hidden text-ellipsis whitespace-nowrap">{eventInfo.event.title}</div>
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

	useEffect(() => {
		// Skip if calendarRef isn't available
		if (!calendarRef.current) return;
		
		// Access the DOM element
		const calendarEl = document.querySelector('.fc');
		if (!calendarEl) return;
		
		// Get the toolbar container
		const toolbarContainer = calendarEl.querySelector('.fc-toolbar-chunk:first-child');
		if (!toolbarContainer) return;
		
		// Create filter dropdown
		const select = document.createElement('select');
		select.className = 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 ml-2 text-sm text-gray-700 dark:text-gray-200';
		
		// Add options
		const options = [
			{ value: 'all', label: 'All Events' },
			{ value: 'meetings', label: 'Meetings Only' },
			{ value: 'sessions', label: 'Sessions Only' }
		];
		
		options.forEach(option => {
			const optionEl = document.createElement('option');
			optionEl.value = option.value;
			optionEl.text = option.label;
			optionEl.selected = activeFilter === option.value;
			select.appendChild(optionEl);
		});
		
		// Add change event listener
		select.addEventListener('change', (e) => {
			setActiveFilter((e.target as HTMLSelectElement).value as FilterType);
		});
		
		// Add the select to the toolbar
		toolbarContainer.appendChild(select);
		
		// Cleanup function
		return () => {
			if (toolbarContainer.contains(select)) {
				toolbarContainer.removeChild(select);
			}
		};
	}, [activeFilter, events]);

	// Add this useEffect to handle body scrolling when popover opens/closes
	useEffect(() => {
		// Skip if calendarRef isn't available
		if (!calendarRef.current) return;
		
		const handlePopoverOpen = () => {
			document.body.classList.add('fc-popover-open');
		};
		
		const handlePopoverClose = () => {
			document.body.classList.remove('fc-popover-open');
		};
		
		// Check for popover elements
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (mutation.addedNodes.length) {
					// Check if a popover was added
					const popover = document.querySelector('.fc-more-popover');
					if (popover) {
						handlePopoverOpen();
						
						// Add a click event listener to the close button
						const closeButton = popover.querySelector('.fc-popover-close');
						if (closeButton) {
							closeButton.addEventListener('click', handlePopoverClose);
						}
						
						// Also handle clicking outside the popover
						document.addEventListener('click', (e) => {
							if (e.target instanceof Element && !popover.contains(e.target)) {
								handlePopoverClose();
							}
						}, { once: true });
					}
				}
			});
		});
		
		// Start observing the document for popover elements
		observer.observe(document.body, { childList: true, subtree: true });
		
		return () => {
			observer.disconnect();
			handlePopoverClose(); // Clean up when component unmounts
		};
	}, []);

	return (
		<div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
			<style>{calendarStyles}</style>
			
			<div className="custom-calendar">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					headerToolbar={{
						left: 'prev,next',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
				/>
			</div>

			{/* MODAL FOR ADDING/EDITING EVENTS */}
		</div>
	)
}

export default Calendar
