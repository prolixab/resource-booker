import { Booking } from "@/lib/bookingSchema";
import Moment from "moment";
import {
  Session,
  SupabaseClient,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "@/lib/schema";

export default async function checker(
  booking: Booking,
  supabase: SupabaseClient
) {
  let response = { error: false, errorText: "" };

  console.log("Entered checker!");
  const setErrorText = (text) => {
    response.errorText = text;
  };

  const setCheckerError = (result) => {
    response.error = result;
  };

  if (booking.resource.id === -1) {
    setErrorText("Please choose a resource.");
    setCheckerError(true);
  }

  let difference = Moment(booking.end_time).diff(
    Moment(booking.start_time),
    "hours"
  ); // returns difference in seconds

  console.log(difference);

  if (difference < 0) {
    setErrorText("End time is before start time.");
    setCheckerError(true);
  } else if (difference < 1) {
    setErrorText("Minimum booking time is one hour.");
    setCheckerError(true);
  } else if (difference > 12) {
    setErrorText("Maximum booking time is 12 hours.");
    setCheckerError(true);
  }

  console.log(response);
  const { data: todo, error } = await supabase
    .from("bookings")
    .select()
    .eq("resource", booking.resource.id);
  // .gte('start_time',startDate)
  // .lte('end_time',endDate)

  if (error) {
    setErrorText("There was an error fetching booking information.");
    setCheckerError(true);
  }

  if (todo?.length === 0 || todo == null) {
    setErrorText(
      "This resource is already booked during the selected time period."
    );
    setCheckerError(true);
  }
  console.log(response);
  return response;
}
