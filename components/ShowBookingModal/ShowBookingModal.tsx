import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import Moment from "moment";
import { Button, Label, Modal } from "flowbite-react";
import { Booking } from "@/lib/bookingSchema";

export default function ShowBookingModal({
  session,
  booking,
  setOpenModal,
  openModal,
}: {
  session: Session;
  booking: Booking | undefined;
  setOpenModal: Function;
  openModal: string | undefined;
}) {
  const supabase = useSupabaseClient<Database>();
  const props = { openModal, setOpenModal, session, booking };

  useEffect(() => {}, [supabase]);

  return (
    <>
      <Modal
        show={props.openModal === "show-booking"}
        size="xl"
        popup
        onClose={() => {
          props.setOpenModal(undefined);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <form key="show-form">
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Booking
              </h3>

              <div className="mb-2 block">
                <p>
                  <span>Start: {booking?.start_time.toLocaleUpperCase()} </span>
                </p>
              </div>

              <div className="mb-2 block">
                <p>
                  <span>End: {booking?.end_time.toLocaleUpperCase()} </span>
                </p>
              </div>

              <div>
                <div>
                  <Label htmlFor="resource">Resource</Label>
                </div>
                <p>
                  <span>
                    {booking?.resource.name} {booking?.resource.model}
                  </span>
                </p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="description" value="Description" />
                </div>
                <p>{booking?.note}</p>
              </div>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="booked-by" value="Booked by" />
                </div>
                <p>
                  {booking?.user.first_name} {booking?.user.last_name}
                </p>
              </div>

              <div className="w-full">
                <Button type="submit">Close</Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
