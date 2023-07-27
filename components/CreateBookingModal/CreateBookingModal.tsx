import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
import Datepicker from "tailwind-datepicker-react";
//import DateTimePicker from 'react-tailwindcss-datetimepicker';
import DateCalendar from "@/components/DateCalendar";
import Booking from '@/components/Booking'
import ResourceDropDown from './ResourceDropdown';
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';
import {DatePicker,TimePicker,DateTimePicker} from "@mui/x-date-pickers";
import { en } from '@supabase/auth-ui-react';

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

export default function CreateBookingModal({ session,setOpenModal,openModal,successfullySubmitted }: { session: Session,setOpenModal:Function,openModal:string,successfullySubmitted:Function }) {
  const supabase = useSupabaseClient<Database>()
  const [todos, setTodos] = useState<AltTodo[]>([])
  const [startDate, setStartDate] = useState(Moment())
  const [endDate, setEndDate] = useState(Moment().add(2,"hours"))
  const [selectedResourceId, setSelectedResourceId] = useState([])
  const [bookings, setBookings] = useState<AltTodo[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

 
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, session, successfullySubmitted };

  const user = session.user

  useEffect(() => {
  }, [supabase,startDate,endDate])

  const addBooking = async (taskText: string) => {

    console.log(startDate);
    console.log(endDate);
    let difference = endDate.diff( startDate, "hours" ); // returns difference in seconds
    console.log(difference);


    if(difference<0){
      setErrorText("End time is before start time.");
      return;
    }
    else if(difference<1){
      setErrorText("Minimum booking time is one hour.");
      return;
     
    }
    else if(difference>12){
      setErrorText("Maximum booking time is 12 hours.");
      return;
    }

    console.log(selectedResourceId);

    const { data: todo, error } = await supabase
    .from('bookings')
    .select()
    .eq('resource', selectedResourceId)
    // .gte('start_time',startDate)
    // .lte('end_time',endDate)

    console.log(todo);

    if(error){
      setErrorText("There was an error fetching booking information.");
      return;
    }
    if(todo?.length===0||todo==null){
      setErrorText("This resource is already booked during the selected time period.");
      return;
    }

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
        props.successfullySubmitted();
        
      }
    }
  }


  return (
  
    <>
      <Modal show={props.openModal === 'form-elements'} size="xl" popup onClose={() => props.setOpenModal(undefined)}>
        <Modal.Header />
        <Modal.Body>
        <form
        onSubmit={(e) => {
          e.preventDefault()
          addBooking(newTaskText)
        }}
      >
        <div className="space-y-6">

            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create Booking</h3>
          
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
            <Label htmlFor="resource" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select your resource</Label>
            </div>
              <ResourceDropDown  session={session} setSelectedResourceId={setSelectedResourceId}/>
              </div>

              <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
         
        <input
          className="rounded w-full p-2"
          id="description"
          type="text"
          placeholder="make coffee"
          value={newTaskText}
          onChange={(e) => {
            setErrorText('')
            setNewTaskText(e.target.value)
          }}
        />
            </div>

            <div className="w-full">
            <Button  type="submit">
          Add
        </Button>
        {!!errorText && <Alert text={errorText} />}
            </div>
           
          </div>
    </form>
        </Modal.Body>
      </Modal>
</>
  )
}


const Alert = ({ text }: { text: string }) => (
  <div className="rounded-md bg-red-100 p-4 my-3">
    <div className="text-sm leading-5 text-red-700">{text}</div>
  </div>
)
