import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import Moment from "moment";
import Booking from "@/components/ViewAll/Booking";
import ResourceDropDown from "./ResourceDropdown";
import CreateBookingModal from "../CreateBookingModal/CreateBookingModal";
import { Button, Label } from "flowbite-react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import DateViewChooser from "./DateViewChooser";
import MessageToast from "@/components/MessageToast";

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
  const [todos, setTodos] = useState<AltTodo[]>([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState<Number>(-1);
  const [bookings, setBookings] = useState<AltTodo[]>([]);
  const [mappedBookings, setMappedBookings] = useState<GridRowsProp>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [view, setView] = useState("day");
  const [baseDay, setBaseDay] = useState(Moment());
  const [toastText, setToastText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState<string | undefined>();

  const user = session.user;

  useEffect(() => {
    setLoading(true);
    fetchBookings().then((bookings) => {
      console.log(bookings);
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
        //  console.log('day');
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
        // console.log('week');
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
        // console.log('month');
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
      .lt("end_time", endTime)
      .gte("start_time", startTime)
      .order("start_time", { ascending: true });

    if (error) console.log("error", error);
    else {
      type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>>;
      return bookings;
    }
  };

  const updateMappedBookingsFilter = (bookings, id) => {
    let tempBookings;

    console.log(id);
    if (id == -1) tempBookings = bookings;
    else tempBookings = bookings.filter((book) => book.resource.id == id);

    console.log(tempBookings);

    let provMappedBookings = tempBookings.map((book) => {
      return {
        id: book.id,
        start_time: book.start_time,
        end_time: book.end_time,
        resource_name: book.resource.name,
        resource_model: book.resource.model,
        user_name: book.user.first_name + " " + book.user.last_name,
      };
    });

    if (provMappedBookings.length == 0) setMappedBookings([]);
    else setMappedBookings(provMappedBookings);
  };

  const successfullySubmitted = () => {
    setToastText("Successfully added booking");
    setShowToast(true);
    setOpenModal(undefined);
    fetchBookings();
  };

  return (
    <div className="w-full">
      <h1 className="mb-12">Bookings.</h1>
      <div>
        <Button onClick={() => setOpenModal("create-booking")}>
          Create new booking
        </Button>
      </div>
      <Button.Group>
        <Button
          color="gray"
          onClick={() => {
            setView("day");
          }}
        >
          Day
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setView("week");
          }}
        >
          Week
        </Button>
        <Button
          color="gray"
          onClick={() => {
            setView("month");
          }}
        >
          Month
        </Button>
      </Button.Group>
      <div>
        <div>
          <Label
            htmlFor="resource"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Filter by resource
          </Label>
        </div>
        <ResourceDropDown
          session={session}
          setSelectedResourceId={presetSelectedResourceId}
        />
      </div>
      <DateViewChooser
        baseDay={baseDay}
        view={view}
        setBaseDay={setBaseDay}
      ></DateViewChooser>

      <div className="bg-white shadow overflow-hidden rounded-md">
        {loading ? (
          <p>Loading</p>
        ) : (
          <DataGrid
            // selectedResourceId={mappedBookings}
            rows={mappedBookings}
            columns={columns}
          />
        )}
      </div>

      <CreateBookingModal
        session={session}
        openModal={openModal}
        setOpenModal={setOpenModal}
        successfullySubmitted={successfullySubmitted}
      ></CreateBookingModal>
      <MessageToast
        toastText={toastText}
        showToast={showToast}
        setShowToast={setShowToast}
      ></MessageToast>
    </div>
  );
}
