import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Moment from "moment";
import CreateBookingModal from "../CreateBookingModal/CreateBookingModal";
import ShowBookingModal from "@/components/ShowBookingModal/ShowBookingModal";
import EditBookingModal from "@/components/EditBookingModal/EditBookingModal";
import { Button } from "flowbite-react";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Calendar from "@/components/Calendar";
import { ToastContainer, toast } from "react-toastify";
import EventInput from "@fullcalendar/core";
import { Booking } from "@/lib/bookingSchema";

import "react-toastify/dist/ReactToastify.css";

const columns: GridColDef[] = [
  { field: "start_time", headerName: "Start" },
  { field: "end_time", headerName: "End" },
  { field: "resource_name", headerName: "Resource" },
  { field: "resource_model", headerName: "Resource" },
  { field: "user_name", headerName: "User" },
];

export default function ViewAll({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const [startDate, setStartDate] = useState(Moment());
  const [endDate, setEndDate] = useState(Moment());
  const [selectedResourceId, setSelectedResourceId] = useState<Number>(-1);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mappedBookings, setMappedBookings] = useState<GridRowsProp>([]);
  const [view, setView] = useState("day");
  const [baseDay, setBaseDay] = useState(Moment());
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | undefined>();
  const [booking, setBooking] = useState<Booking>();

  const [openModal, setOpenModal] = useState<string | undefined>();

  const user = session.user;

  useEffect(() => {
    setLoading(true);
    fetchBookings().then((bookings) => {
      setBookings(bookings!);
      updateMappedBookingsFilter(bookings, selectedResourceId);
      setLoading(false);
    });
  }, [supabase, view, baseDay]);

  const presetSelectedResourceId = (id) => {
    console.log("SelectedResrouceUpdated");
    console.log(bookings);
    console.log(id);
    setSelectedResourceId(id);
    updateMappedBookingsFilter(bookings, id);
    console.log(mappedBookings);
  };

  const fetchBookings = async () => {
    let startTime;
    let endTime;
    switch (view) {
      case "day":
        startTime = Moment(baseDay)
          .startOf("day")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        endTime = Moment(baseDay)
          .endOf("day")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        break;
      case "week":
        startTime = Moment(baseDay)
          .startOf("week")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        endTime = Moment(baseDay)
          .endOf("week")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        break;
      case "month":
        startTime = Moment(baseDay)
          .startOf("month")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        endTime = Moment(baseDay)
          .endOf("month")
          .format("YYYY/MM/DD HH:mm:ss")
          .toString();
        break;
      default:
    }

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("id,created_at,start_time,end_time,user(*),resource(*), note")
      // .lt('end_time', endTime)
      // .gte('start_time', startTime)
      .order("start_time", { ascending: true });

    if (error) console.log("error", error);
    else {
      //type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>>;
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

  const successfullySubmitted = () => {
    toast("Booking successfully added.");
    setOpenModal(undefined);
    fetchBookings().then((bookings) => {
      setBookings(bookings!);
      updateMappedBookingsFilter(bookings, selectedResourceId);
    });
  };

  const handleDateClick = (date) => {
    console.log(date);
    setStartDate(Moment(date.dateStr));
    setEndDate(Moment(date.dateStr).add(2, "hours"));
    setOpenModal("create-booking");
  };

  const handleEventClick = (date: any) => {
    console.log(date);
    //IF this is the users show edit modal
    //If this is someone elses show only display modal.
    let isUsers = false;
    //find date in bookings
    let booking = bookings.find((b) => b.id == date.event.id);
    console.log(user.id);
    console.log(booking?.user.id);
    if ((booking?.user.id as unknown as string) == user.id) {
      isUsers = true;
    }

    if (isUsers) {
      console.log("Is users");
      setBookingId(date.event.id);
      setOpenModal("edit-booking");
    } else {
      setBooking(booking);
      setBookingId(date.event.id);
      setOpenModal("show-booking");
    }
  };

  return (
    <>
      <div className="w-full">
        <h1 className="mb-12">Bookings.</h1>
        <div>
          <Button
            className="mb-2"
            onClick={() => setOpenModal("create-booking")}
          >
            Create new booking
          </Button>
        </div>
        <CreateBookingModal
          session={session}
          propsStartDate={startDate}
          propsEndDate={endDate}
          openModal={openModal}
          setOpenModal={setOpenModal}
          successfullySubmitted={successfullySubmitted}
        ></CreateBookingModal>
        <ShowBookingModal
          session={session}
          booking={booking}
          openModal={openModal}
          setOpenModal={setOpenModal}
        ></ShowBookingModal>
        <EditBookingModal
          bookingId={bookingId}
          session={session}
          openModal={openModal}
          setOpenModal={setOpenModal}
          successfullySubmitted={successfullySubmitted}
          propsStartDate={Moment()}
          propsEndDate={Moment()}
        ></EditBookingModal>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Calendar
          session={session}
          bookingId={bookingId}
          events={mappedBookings as EventInput.EventSourceInput}
          handleDateClick={handleDateClick}
          handleEventClick={handleEventClick}
          successfullySubmitted={successfullySubmitted}
        ></Calendar>
      </div>
    </>
  );
}
