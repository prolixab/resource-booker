import React from "react";
import FullCalendar from "@fullcalendar/react";
import EventInput from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EditBookingModal from "@/components/EditBookingModal/EditBookingModal";
import { useState } from "react";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import Moment from "moment";

type AltTodo = {
  created_at: string | null;
  end_time: string;
  id: number;
  note: string | null;
  resource: number;
  start_time: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
};

export default function Calendar({
  events,
  handleDateClick,
  handleEventClick,
  session,
  bookingId,
  successfullySubmitted,
}: {
  events: EventInput.EventSourceInput | undefined;
  handleDateClick: ((arg: any) => void) | undefined;
  handleEventClick: ((arg: any) => void) | undefined;
  bookingId: string | undefined;
  session: Session;
  successfullySubmitted: Function;
}) {
  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        initialView="timeGridWeek"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        weekNumbers={true}
        events={events}
      />
    </>
  );
}
