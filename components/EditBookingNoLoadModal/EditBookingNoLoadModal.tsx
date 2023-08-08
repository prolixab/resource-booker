import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState, useRef } from "react";
import Moment from "moment";
import ResourceDropDown from "./ResourceDropdown";
import { Button, Label, Modal, TextInput, Spinner } from "flowbite-react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Booking } from "@/lib/bookingSchema";
import Checker from "@/components/Checker";

export default function EditBookingNoLoadModal({
  session,
  booking,
  setOpenModal,
  openModal,
  successfullySubmitted,
}: {
  session: Session;
  booking: Booking;
  setOpenModal: Function;
  openModal: string | undefined;
  successfullySubmitted: Function;
}) {
  const supabase = useSupabaseClient<Database>();
  const [localBooking, setLocalBooking] = useState<Booking>(booking);
  const [errorText, setErrorText] = useState("");

  const props = {
    openModal,
    booking,
    setOpenModal,
    session,
    successfullySubmitted,
  };

  const user = session.user;

  useEffect(() => {
    console.log(booking);
    console.log("Entered no-load");
    //Is booking id same as lcoalbooking id? If not update!
    if (booking.id != localBooking.id) {
      setLocalBooking(booking);
    }
  }, [supabase, booking]);

  const runChecks = async () => {
    let result = await Checker(localBooking, supabase);

    console.log(result);
    if (result?.error === true) {
      setErrorText(result.errorText);
      return false;
    } else return true;

    // setErrorText("");

    // if (localBooking.resource.id === -1) {
    //   setErrorText("Please choose a resource.");
    //   return false;
    // }

    // let difference = Moment(localBooking.end_time).diff(
    //   Moment(localBooking.start_time),
    //   "hours"
    // ); // returns difference in seconds

    // if (difference < 0) {
    //   setErrorText("End time is before start time.");
    //   return false;
    // } else if (difference < 1) {
    //   setErrorText("Minimum booking time is one hour.");
    //   return false;
    // } else if (difference > 12) {
    //   setErrorText("Maximum booking time is 12 hours.");
    //   return false;
    // }

    // const { data: todo, error } = await supabase
    //   .from("bookings")
    //   .select()
    //   .eq("resource", localBooking.resource.id);
    // // .gte('start_time',startDate)
    // // .lte('end_time',endDate)

    // console.log(todo);

    // if (error) {
    //   setErrorText("There was an error fetching booking information.");
    //   return false;
    // }
    // if (todo?.length === 0 || todo == null) {
    //   setErrorText(
    //     "This resource is already booked during the selected time period."
    //   );
    //   return false;
    // }

    // return true;
  };

  const updateBooking = async () => {
    let description = localBooking.note!.trim();

    let result = await runChecks();
    if (result === false) return;
    const { data: AltTodo, error } = await supabase
      .from("bookings")
      .update({
        start_time: localBooking.start_time,
        end_time: localBooking.end_time,
        resource: localBooking.resource.id,
        note: localBooking.note,
        user: user.id,
      })
      .eq("id", booking.id)
      .select()
      .single();

    if (error) {
      setErrorText(error.message);
    } else {
      props.successfullySubmitted("Booking successfully updated.");
      props.setOpenModal(undefined);
    }
  };

  const updateStartTime = (e: any) => {
    console.log(e);
    setLocalBooking((current) => ({
      ...current,
      start_time: e,
    }));
  };

  const updateEndTime = (e: any) => {
    setLocalBooking((current) => ({
      ...current,
      end_time: e,
    }));
  };

  const updateDescription = (e: any) => {
    setLocalBooking((current) => ({
      ...current,
      note: e.target.value,
    }));
  };

  const setSelectedResourceId = (value) => {
    setLocalBooking((current) => ({
      ...current,
      resource: {
        ...current.resource,
        id: value,
      },
    }));
  };

  return (
    <>
      <Modal
        show={props.openModal === "edit-no-load-booking"}
        size="xl"
        popup
        onClose={() => {
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
                Edit No-Load Booking
              </h3>

              <div className="mb-2 block">
                <DateTimePicker
                  label="Start time"
                  value={Moment(localBooking.start_time)}
                  onChange={(newValue) => updateStartTime(newValue!)}
                />
              </div>

              <div className="mb-2 block">
                <DateTimePicker
                  label="End time"
                  value={Moment(localBooking.end_time)}
                  onChange={(newValue) => updateEndTime(newValue!)}
                />
              </div>
              <div>
                <div>
                  <Label htmlFor="resource">Select your resource</Label>
                </div>
                <ResourceDropDown
                  selectedResourceId={localBooking.resource.id}
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
                  value={localBooking.note as string}
                  onChange={(value) => {
                    updateDescription(value);
                  }}
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

const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
);
