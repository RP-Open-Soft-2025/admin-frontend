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
				const response1 = await fetch(
					`${API_URL}/${auth.user.userRole}/meets`,
					{
						headers: {
							Authorization: `Bearer ${auth.user.accessToken}`,
						},
					}
				)
				const response2 = await fetch(
					`${API_URL}/${auth.user.userRole}/sessions`,
					{
						headers: {
							Authorization: `Bearer ${auth.user.accessToken}`,
						},
					}
				)
				const data1 = await response1.json()
				const data2 = await response2.json()
				const formattedEvents1 = data1.map((meet: Meeting) => {
					const time = meet.scheduled_at.split('T')[1].split('+')[0].trim()
					return {
						id: meet.meet_id,
						title: ` meet at ${time}`,
						start: meet.scheduled_at,
						url: meet.meeting_link,
						extendedProps: {
							calendar: 'primary',
							redirectUrl: meet.meeting_link,
						},
					}
				})
				const formattedEvents2 = data2.map((meet: SessionType) => {
					const time = meet.scheduled_at.split('T')[1].split('+')[0].trim()
					return {
						id: meet.session_id,
						title: ` session at ${time}`,
						start: meet.scheduled_at,
						url: meet.employee_id,
						extendedProps: {
							calendar: 'Success',
							redirectUrl: `/chat-page/${meet.chat_id}`,
						},
					}
				})

				setEvents([...formattedEvents1, ...formattedEvents2])
			} catch (error) {
				console.error('Error fetching meetings:', error)
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
		// const event = clickInfo.event
		// setSelectedEvent(event as unknown as CalendarEvent)
		// setEventTitle(event.title.replace(/\d{1,2}\.\d{2}[ap]\s?/, ''))
		// setEventStartDate(event.start?.toISOString().split('T')[0] || '')
		// setEventLevel(event.extendedProps.calendar)
		// openModal()
		console.log(clickInfo)
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
