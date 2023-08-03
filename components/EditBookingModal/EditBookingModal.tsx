import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState, useRef } from "react";
import Moment from "moment";
import ResourceDropDown from "./ResourceDropdown";
import {
  Button,
  Checkbox,
  Label,
  Modal,
  TextInput,
  Spinner,
} from "flowbite-react";
import { DateTimePicker } from "@mui/x-date-pickers";

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

export default function EditBookingModal({
  session,
  bookingId,
  setOpenModal,
  openModal,
  successfullySubmitted,
  propsStartDate,
  propsEndDate,
}: {
  session: Session;
  bookingId: string;
  setOpenModal: Function;
  openModal: string;
  successfullySubmitted: Function;
  propsStartDate: moment.Moment;
  propsEndDate: moment.Moment;
}) {
  const supabase = useSupabaseClient<Database>();
  const [startDate, setStartDate] = useState(propsStartDate);
  const [endDate, setEndDate] = useState(propsEndDate);
  const [selectedResourceId, setSelectedResourceId] = useState(-1);
  const [booking, setBooking] = useState<AltTodo[]>([]);
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const props = { openModal, setOpenModal, session, successfullySubmitted };

  const user = session.user;

  const ref = useRef(null);

  useEffect(() => {
    ref.current = document.body;
    if (bookingId) {
      setLoading(true);
      fetchBooking()
        .then((book) => {
          setBooking(book);
          setSelectedResourceId(book?.resource?.id);
          setDescriptionText(book?.note);
          setStartDate(Moment(book?.start_time));
          setEndDate(Moment(book?.end_time));
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [supabase, bookingId]);

  const fetchBooking = async () => {
    const { data: booking, error } = await supabase
      .from("bookings")
      .select("id,created_at,start_time,end_time,user(*),resource(*), note")
      .eq("id", bookingId);

    if (error) console.log("error", error);
    else {
      type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>>;
      return booking[0];
    }
  };

  const runChecks = async () => {
    setErrorText("");

    if (selectedResourceId === -1) {
      setErrorText("Please choose a resource.");
      return false;
    }

    let difference = endDate.diff(startDate, "hours"); // returns difference in seconds

    if (difference < 0) {
      setErrorText("End time is before start time.");
      return false;
    } else if (difference < 1) {
      setErrorText("Minimum booking time is one hour.");
      return false;
    } else if (difference > 12) {
      setErrorText("Maximum booking time is 12 hours.");
      return false;
    }

    const { data: todo, error } = await supabase
      .from("bookings")
      .select()
      .eq("resource", selectedResourceId);
    // .gte('start_time',startDate)
    // .lte('end_time',endDate)

    console.log(todo);

    if (error) {
      setErrorText("There was an error fetching booking information.");
      return false;
    }
    if (todo?.length === 0 || todo == null) {
      setErrorText(
        "This resource is already booked during the selected time period."
      );
      return false;
    }

    return true;
  };

  const updateBooking = async () => {
    let description = descriptionText.trim();

    const { data: todo, error } = await supabase
      .from("bookings")
      .update({
        start_time: startDate,
        end_time: endDate,
        resource: selectedResourceId,
        note: description,
        user: user.id,
      })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      setErrorText(error.message);
    } else {
      console.log("Success in editing booking");

      clearModal();
      props.successfullySubmitted();
      props.setOpenModal(undefined);
    }
  };

  const clearModal = () => {
    setDescriptionText("");
    setLoading(false);
  };

  const handleDescriptionChange = (e) => {
    setDescriptionText(e.target.value);
  };

  if (loading === true) {
    return (
      <Modal
        root={ref.current || undefined}
        show={props.openModal === "edit-booking"}
        size="xl"
        popup
        onClose={() => {
          clearModal();
          props.setOpenModal(undefined);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <Spinner aria-label="Extra small spinner example" size="xs" />
        </Modal.Body>
      </Modal>
    );
  } else {
    return (
      <>
        <Modal
          root={ref.current || undefined}
          show={props.openModal === "edit-booking"}
          size="xl"
          popup
          onClose={() => {
            clearModal();
            props.setOpenModal(undefined);
          }}
        >
          <Modal.Header />
          <Modal.Body>
            <form
              key="create-form"
              onSubmit={(e) => {
                e.preventDefault();
                updateBooking();
              }}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                  Edit Booking
                </h3>

                <div className="mb-2 block">
                  <DateTimePicker
                    label="Start time"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                  />
                </div>

                <div className="mb-2 block">
                  <DateTimePicker
                    label="End time"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                  />
                </div>
                <div>
                  <div>
                    <Label htmlFor="resource">Select your resource</Label>
                  </div>
                  <ResourceDropDown
                    id="resource"
                    selectedResourceId={selectedResourceId}
                    session={session}
                    setSelectedResourceId={setSelectedResourceId}
                  />
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="description" value="Description" />
                  </div>

                  <TextInput
                    key="description"
                    id="description"
                    type="text"
                    placeholder=""
                    value={descriptionText}
                    onChange={handleDescriptionChange}
                  />
                </div>

                <div className="w-full">
                  <Button type="submit">Save</Button>
                  {!!errorText && <Alert text={errorText} />}
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
