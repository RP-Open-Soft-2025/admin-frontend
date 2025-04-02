'use client'
import React, { useState, useRef, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useModal } from '@/hooks/useModal'
import store from '@/redux/store'
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

interface CalendarEvent extends EventInput {
	extendedProps: {
		calendar: string
	}
}

const RenderEventContent = (eventInfo: EventContentArg) => {
	const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`
	const redirectUrl = eventInfo.event.extendedProps.redirectUrl
	return (
		<a
			className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm w-full`}
			href={redirectUrl}
		>
			<div className="fc-daygrid-event-dot"></div>
			<div className="fc-event-time">{eventInfo.timeText}</div>
			<div className="fc-event-title">{eventInfo.event.title}</div>
		</a>
	)
}

const Calendar: React.FC = () => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventTitle, setEventTitle] = useState('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventStartDate, setEventStartDate] = useState('')
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [eventLevel, setEventLevel] = useState('')
	const [events, setEvents] = useState<CalendarEvent[]>([])
	const calendarRef = useRef<FullCalendar>(null)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { isOpen, openModal, closeModal } = useModal()
	const { auth } = store.getState()

	useEffect(() => {
		const fetchMeetings = async () => {
			if (!auth.user || !auth.user.accessToken) return
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
				const [activeResponse, completedResponse, pendingResponse] = await Promise.all([
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

				if (!meetingsResponse.ok || !activeResponse.ok || !completedResponse.ok || !pendingResponse.ok) {
					throw new Error('Failed to fetch calendar data')
				}

				const meetingsData = await meetingsResponse.json()
				const [activeSessions, completedSessions, pendingSessions] = await Promise.all([
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
						},
					}
				}

				const formattedSessions = [
					...activeSessions.map((session: SessionType) => formatSession(session, SessionStatus.ACTIVE)),
					...completedSessions.map((session: SessionType) => formatSession(session, SessionStatus.COMPLETED)),
					...pendingSessions.map((session: SessionType) => formatSession(session, SessionStatus.PENDING)),
				]

				setEvents([...formattedMeetings, ...formattedSessions])
			} catch (error) {
				console.error('Error fetching calendar data:', error)
			}
		}
		fetchMeetings()
	}, [auth.user])

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
			<div className="custom-calendar">
				<FullCalendar
					ref={calendarRef}
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth"
					headerToolbar={{
						left: 'prev,next addEventButton',
						center: 'title',
						right: 'dayGridMonth,timeGridWeek,timeGridDay',
					}}
					events={events}
					selectable={true}
					select={handleDateSelect}
					eventClick={handleEventClick}
					eventContent={RenderEventContent}
				/>
			</div>

			{/* MODAL FOR ADDING/EDITING EVENTS */}
		</div>
	)
}

export default Calendar
