import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Moment from "moment";
import ShowBookingModal from "@/components/ShowBookingModal/ShowBookingModal";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import OpenCalendar from "@/components/Calendar";
import { Booking } from "@/lib/bookingSchema";
import FullCalendar from "@fullcalendar/react";
import EventInput from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "react-toastify/dist/ReactToastify.css";

const columns: GridColDef[] = [
  { field: "start_time", headerName: "Start" },
  { field: "end_time", headerName: "End" },
  { field: "resource_name", headerName: "Resource" },
  { field: "resource_model", headerName: "Resource" },
  { field: "user_name", headerName: "User" },
];

export default function OpenCalendarView({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [selectedResourceId, setSelectedResourceId] = useState<Number>(-1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mappedBookings, setMappedBookings] = useState<GridRowsProp>([]);
  const [booking, setBooking] = useState<Booking>();
  const [openModal, setOpenModal] = useState<string | undefined>();

  useEffect(() => {
    fetchBookings().then((bookings) => {
      setBookings(bookings!);
      updateMappedBookingsFilter(bookings, selectedResourceId);
    });
  }, [supabase]);

  const fetchBookings = async () => {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id,created_at,start_time,end_time,user(*),resource(*), note")
      .order("start_time", { ascending: true });

    if (error) console.log("error", error);
    else {
      return bookings as unknown as Booking[];
    }
  };

  const updateMappedBookingsFilter = (bookings, id) => {
    let tempBookings: Booking[];

    if (id == -1) tempBookings = bookings;
    else tempBookings = bookings.filter((book) => book.resource.id == id);

    let provMappedBookings = tempBookings.map((book: Booking) => {
      return {
        id: book.id,
        start: book.start_time,
        end: book.end_time,
        title: book.resource.name,
        resource_model: book.resource.model,
        user_name: book.user.first_name + " " + book.user.last_name,
      };
    });

    if (provMappedBookings.length == 0) setMappedBookings([]);
    else setMappedBookings(provMappedBookings);
  };

  const handleEventClick = (date: any) => {
    console.log(date);
    //IF this is the users show edit modal
    //If this is someone elses show only display modal.
    let isUsers = false;
    //find date in bookings
    let booking = bookings.find((b) => b.id == date.event.id);

    setBooking(booking);
    setOpenModal("show-booking");
  };

  return (
    <>
      <div className="w-full">
        <h1 className="mb-12">Bookings.</h1>
        <ShowBookingModal
          session={session}
          booking={booking}
          openModal={openModal}
          setOpenModal={setOpenModal}
        ></ShowBookingModal>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          initialView="timeGridDay"
          eventClick={handleEventClick}
          weekNumbers={true}
          events={mappedBookings as EventInput.EventSourceInput}
        />
      </div>
    </>
  );
}
