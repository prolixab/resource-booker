import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState, useRef } from "react";
import ResourceDropDown from "./ResourceDropdown";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { DateTimePicker } from "@mui/x-date-pickers";

//type Todos = Database['public']['Tables']['bookings']['Row']
type AltTodo = {
  created_at: string | null;
  start_time: string;
  end_time: string;
  id: number;
  note: string | null;
  resource: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
};

export default function CreateBookingModal({
  session,
  setOpenModal,
  openModal,
  successfullySubmitted,
  propsStartDate,
  propsEndDate,
}: {
  session: Session;
  setOpenModal: Function;
  openModal: string | undefined;
  successfullySubmitted: Function;
  propsStartDate: moment.Moment;
  propsEndDate: moment.Moment;
}) {
  const supabase = useSupabaseClient<Database>();
  const [startDate, setStartDate] = useState<moment.Moment | null>(
    propsStartDate
  );
  const [endDate, setEndDate] = useState<moment.Moment | null>(propsEndDate);
  const [selectedResourceId, setSelectedResourceId] = useState(-1);
  const [bookings, setBookings] = useState<AltTodo[]>([]);
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [errorText, setErrorText] = useState("");

  const props = {
    openModal,
    setOpenModal,
    session,
    successfullySubmitted,
    propsStartDate,
    propsEndDate,
  };

  const user = session.user;

  const ref = useRef(null);

  useEffect(() => {
    ref.current = document.body;
    setStartDate(props.propsStartDate);
    setEndDate(props.propsEndDate);
  }, [supabase, propsStartDate, propsEndDate]);

  const addBooking = async () => {
    if (await runChecks()) {
      insertBooking();
    } else {
      console.log("Checker returned error");
    }
  };

  const runChecks = async () => {
    setErrorText("");

    if (selectedResourceId === -1) {
      setErrorText("Please choose a resource.");
      return false;
    }

    if (endDate === null) {
      setErrorText("No end dtae chosen.");
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

  const insertBooking = async () => {
    let description = descriptionText.trim();

    if (startDate === null || endDate === null) {
      setErrorText("Start date or end date is null");
      return;
    }

    const { data: insertedBooking, error } = await supabase
      .from("bookings")
      .insert({
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        resource: selectedResourceId,
        note: description,
        user: user.id,
      })
      .select()
      .single();

    if (error) {
      setErrorText(error.message);
    } else {
      console.log("Success in adding booking");
      setBookings([...bookings, insertedBooking]);
      setDescriptionText("");
      props.successfullySubmitted();
      props.setOpenModal(undefined);
    }
  };

  const handleDescriptionChange = (e: any) => {
    setDescriptionText(e.target.value);
  };

  return (
    <>
      <Modal
        root={ref.current || undefined}
        show={props.openModal === "create-booking"}
        size="xl"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <form
            key="create-form"
            onSubmit={(e) => {
              e.preventDefault();
              addBooking();
            }}
          >
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Create Booking
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
                <Button type="submit">Add</Button>
                {!!errorText && <Alert text={errorText} />}
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
