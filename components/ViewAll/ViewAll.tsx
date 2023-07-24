import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
import Booking from '@/components/ViewAll/Booking'
import ResourceDropDown from './ResourceDropdown';
import CreateBookingModal from '../CreateBookingModal/CreateBookingModal'
import { Button,Label } from 'flowbite-react';

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
  const [selectedResourceId, setSelectedResourceId] = useState<Number>(-1)
  const [bookings, setBookings] = useState<AltTodo[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')
  const [view,setView] = useState('day')
  const [baseDay,setBaseDay]=useState(Moment());
  const [alertText,setAlertText]=useState("");
  const [showAlert,setShowAlert]=useState(false);

  const [openModal, setOpenModal] = useState<string | undefined>();

  

  const user = session.user

  useEffect(() => {
    fetchBookings()
  }, [supabase,view,baseDay])

  const fetchBookings = async () => {

    let startTime;
    let endTime;
    switch(view){
      case 'day':
        console.log('day');
        startTime= Moment(baseDay).startOf('day').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime =Moment(baseDay).endOf('day').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      case 'week':
        console.log('week');
        startTime= Moment(baseDay).startOf('week').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime = Moment(baseDay).endOf('week').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      case 'month':
        console.log('month');
        startTime= Moment(baseDay).startOf('month').format('YYYY/MM/DD HH:mm:ss').toString();
        endTime = Moment(baseDay).endOf('month').format('YYYY/MM/DD HH:mm:ss').toString();
        break;
      default:
    }
      
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

  const successfullySubmitted = () =>{
    console.log("Successfully added booking");
    setAlertText("Successfully added booking.");
    setShowAlert(true);
    setOpenModal(undefined);
    fetchBookings();
  }


  const deleteBooking = async (id: number) => {
    try {
      await supabase.from('bookings').delete().eq('id', id).throwOnError()
      setBookings(bookings.filter((x) => x.id != id))
    } catch (error) {
      console.log('error', error)
    }
  }

  const decrement=()=>{
    console.log('decrement');
   
    let newDate;
    if(view==='day'){
      newDate= Moment(baseDay).subtract(1, 'days');}
      else if(view==="week"){
        newDate= Moment(baseDay).subtract(1, 'week');}
      else if(view==="month"){
        newDate= Moment(baseDay).subtract(1, 'month');}
      
    setBaseDay((prev)=>{
      return newDate;
  });
  }

  const increment=()=>{
    console.log('increment');
    let newDate;
    if(view==='day'){
      newDate= Moment(baseDay).add(1, 'days');}
      else if(view==="week"){
        newDate= Moment(baseDay).add(1, 'week');}
      else if(view==="month"){
        newDate= Moment(baseDay).add(1, 'month');}

    setBaseDay((prev)=>{
      return newDate
  });
  }

  const DateDisplay=()=>{
    let displayElement;

    if(view==='day'){
      displayElement= <span>{baseDay.format('dddd DD/MM/YY')}</span>}
      else if(view==="week"){
        displayElement= <span>Week {baseDay.week()}</span>}
      else if(view==="month"){
        displayElement= <span>{baseDay.format('MMMM')}</span>}

        return displayElement;
  }

  return (
    <div className="w-full">
      <h1 className="mb-12">Bookings.</h1>
      <div>
      <Button onClick={() => setOpenModal('form-elements')}>Create new booking</Button>
      </div>
      <button className={view==='day'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'} onClick={()=>{setView('day');}}>
          Day
        </button>
        <button className={view==='week'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'}  onClick={()=>{setView('week');}}>
          Week
        </button>
        <button className={view==='month'?'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded':'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'}  onClick={()=>{setView('month');}}>
          Month
        </button>
        <div>
        <div>
            <Label htmlFor="resource" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Filter by resource</Label>
            </div>
        <ResourceDropDown session={session} setSelectedResourceId={setSelectedResourceId}/>
        </div>
        <div>
      <span onClick={()=>{decrement()}}>&lt;&lt;</span> <DateDisplay/><span onClick={()=>{increment()}}>&gt;&gt;</span>
      </div>
   
      <div className="bg-white shadow overflow-hidden rounded-md">
    
        <ul>
          {bookings.map((booking) => {
            console.log(booking.resource.id);
            console.log(selectedResourceId)
            if(selectedResourceId==-1) {return <Booking key={booking.id} booking={booking} resource={selectedResourceId} onDelete={() => deleteBooking(booking.id)} />}
            else if(booking.resource.id==selectedResourceId){
              return <Booking key={booking.id} booking={booking} resource={selectedResourceId} onDelete={() => deleteBooking(booking.id)} />
            }
          })
          }
        </ul>
      </div>
      <CreateBookingModal session={session} openModal={openModal} setOpenModal={setOpenModal} successfullySubmitted={successfullySubmitted}></CreateBookingModal>
      {showAlert? <></>:(<Alert text={alertText}></Alert>)}
    </div>
  )
}


const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)
