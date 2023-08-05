export type Booking = {
  created_at: string | null;
  end_time: string;
  id: number;
  note: string | null;
  resource: {
    id: number;
    name: string;
    model: string;
  };
  start_time: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
  };
};
