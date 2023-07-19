import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
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

export default function ViewAll({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<AltTodo[]>([])
  const [startDate, setStartDate] = useState([])
  const [endDate, setEndDate] = useState([])
  const [selectedResourceId, setSelectedResourceId] = useState([])
  const [bookings, setBookings] = useState<AltTodo[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [view,setView] = useState('day')

  const user = session.user

  useEffect(() => {
    fetchBookings()
  }, [supabase,view])

  const fetchBookings = async () => {

    let startTime;
    let endTime;
    switch(view){
      case 'day':
        console.log('day');
        startTime= Moment().startOf('day').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime = Moment().endOf('day').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      case 'week':
        console.log('week');
        startTime= Moment().startOf('week').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime = Moment().endOf('week').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      case 'month':
        console.log('month');
        startTime= Moment().startOf('month').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime = Moment().endOf('month').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      default:
    }
    
    let thisMorning= Moment().startOf('day').format('YYYY/MM/DD HH:mm:ss').toString();
    //thisMorning=thisMorning+"-00"
    console.log(thisMorning);

    let tonight = Moment().endOf('day').format('YYYY/MM/DD HH:mm:ss').toString();

    console.log(tonight);
   
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('id,created_at,start_time,end_time,user(*),resource(*), note')
      .lt('end_time', endTime)
      .gte('start_time', startTime)
      .order('start_time', { ascending: true })

    if (error) console.log('error', error)
    else {console.log(bookings);

     type BookingsResponse = Awaited<ReturnType<typeof fetchTodos>> 
      setBookings(bookings)
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
      <h1 className="mb-12">Bookings.</h1>
      <button className={view==='day'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'} onClick={()=>{setView('day');}}>
          Day
        </button>
        <button className={view==='week'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'}  onClick={()=>{setView('week');}}>
          Week
        </button>
        <button className={view==='month'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'}  onClick={()=>{setView('month');}}>
          Month
        </button>
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
