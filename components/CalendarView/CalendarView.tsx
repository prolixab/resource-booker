import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Moment from "moment";
import CreateBookingModal from "../CreateBookingModal/CreateBookingModal";

import { Button } from "flowbite-react";
import { GridRowsProp, GridColDef } from "@mui/x-data-grid";
import Calendar from "@/components/Calendar";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

//type Todos = Database['public']['Tables']['bookings']['Row']
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
  const [bookings, setBookings] = useState<AltTodo[]>([]);
  const [mappedBookings, setMappedBookings] = useState<GridRowsProp>([]);
  const [view, setView] = useState("day");
  const [baseDay, setBaseDay] = useState(Moment());
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState<string | undefined>();

  const user = session.user;

  useEffect(() => {
    setLoading(true);
    fetchBookings().then((bookings) => {
      setBookings(bookings);
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
      type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>>;
      return bookings;
    }
  };

  const updateMappedBookingsFilter = (bookings, id) => {
    let tempBookings;

    if (id == -1) tempBookings = bookings;
    else tempBookings = bookings.filter((book) => book.resource.id == id);

    let provMappedBookings = tempBookings.map((book) => {
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
      setBookings(bookings);
      updateMappedBookingsFilter(bookings, selectedResourceId);
    });
  };

  const handleDateClick = (date) => {
    console.log(date);
    setStartDate(Moment(date.dateStr));
    setEndDate(Moment(date.dateStr).add(2, "hours"));
    setOpenModal("create-booking");
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">Bookings.</h1>
      <div>
        <Button className="mb-2" onClick={() => setOpenModal("create-booking")}>
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
        events={mappedBookings}
        handleDateClick={handleDateClick}
        successfullySubmitted={successfullySubmitted}
      ></Calendar>
    </div>
  );
}
