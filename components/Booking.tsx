import Moment from "moment";

//type Todos = Database['public']['Tables']['bookings']['Row']
type AltTodo = {
  created_at: string | null;
  end_time: string;
  id: number;
  note: string | null;
  resource: {
    id: number;
    name: string;
  };
  start_time: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
};

export default function Booking({
  booking,
  onDelete,
}: {
  booking: AltTodo;
  onDelete: () => void;
}) {
  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
          <span className="text-sm leading-5 font-medium truncate">
            {" "}
            {Moment(booking.start_time).format("ddd DD/MM HH:mm")} -{" "}
            {Moment(booking.end_time).format("ddd DD/MM HH:mm")}{" "}
            {booking.resource.name} {booking.user.first_name}{" "}
            {booking.user.last_name}
          </span>

          {/* <div className="text-sm leading-5 font-medium truncate">{booking.note}</div> */}
        </div>
        <button
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  );
}
