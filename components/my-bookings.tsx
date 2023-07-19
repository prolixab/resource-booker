import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
import Datepicker from "tailwind-datepicker-react";
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import DateCalendar from "@/components/DateCalendar";
import Booking from '@/components/Booking'
import ResourceDropDown from './ResourceDropdown';

//type Todos = Database['public']['Tables']['bookings']['Row']
type AltTodo= { created_at: string | null
end_time: string
id: number
note: string | null
resource: number
start_time: string
user:{
  id:number,
  first_name:string,
  last_name:string
}
}

export default function MyBookings({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<AltTodo[]>([])
  const [startDate, setStartDate] = useState([])
  const [endDate, setEndDate] = useState([])
  const [selectedResourceId, setSelectedResourceId] = useState([])
  const [bookings, setBookings] = useState<AltTodo[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

  const user = session.user

  useEffect(() => {

    const fetchBookings = async () => {
      console.log(user)
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('id,created_at,start_time,end_time,user!inner(*),resource(*), note')
        .eq('user.id', user.id)
        .order('start_time', { ascending: true })

      if (error) console.log('error', error)
      else {console.log(bookings);

       type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>> 
        setBookings(bookings)
      }
    }

    fetchBookings()
  }, [supabase])

  const addBooking = async (taskText: string) => {
    let task = taskText.trim()
    if (task.length) {
      const { data: todo, error } = await supabase
        .from('bookings')
        .insert({ start_time:startDate, end_time:endDate, resource:1, note: task, user: user.id })
        .select()
        .single()

      if (error) {
        setErrorText(error.message)
      } else {
        setBookings([...bookings, todo])
        setNewTaskText('')
      }
    }
  }

  const deleteBooking = async (id: number) => {
    try {
      await supabase.from('bookings').delete().eq('id', id).throwOnError()
      setBookings(bookings.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div className="w-full">
      <h1 className="mb-12">My Bookings</h1>
      {!!errorText && <Alert text={errorText} />}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul>
          {bookings.map((booking) => (
            <Booking key={booking.id} booking={booking} onDelete={() => deleteBooking(booking.id)} />
          ))}
        </ul>
      </div>
    </div>
  )
}


const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)
