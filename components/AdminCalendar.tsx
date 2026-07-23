'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

type CalendarEvent = {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  extendedProps: Record<string, unknown>
}

export function AdminCalendar({
  events,
  onEventClick,
}: {
  events: CalendarEvent[]
  onEventClick: (props: Record<string, unknown>) => void
}) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      events={events}
      eventClick={({ event }) => onEventClick(event.extendedProps as Record<string, unknown>)}
      height="600px"
      slotMinTime="06:00:00"
      slotMaxTime="22:00:00"
      allDaySlot={false}
    />
  )
}
