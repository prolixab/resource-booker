import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';
import Datepicker from "tailwind-datepicker-react";
import DateTimePicker from 'react-tailwindcss-datetimepicker';
import DateCalendar from "@/components/DateCalendar";
import Booking from '@/components/Booking'
import ResourceDropDown from './ResourceDropdown';
import { Button, Checkbox, Label, Modal, TextInput } from 'flowbite-react';

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
  const [startDate, setStartDate] = useState([])
  const [endDate, setEndDate] = useState([])
  const [selectedResourceId, setSelectedResourceId] = useState([])
  const [bookings, setBookings] = useState<AltTodo[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [errorText, setErrorText] = useState('')

 
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, session, successfullySubmitted };

  const user = session.user

  useEffect(() => {
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
            <div>
              <div className="mb-2 block">
                <Label htmlFor="start-time" value="Start Time" />
              </div>
              <DateCalendar id="start-time" setterFunction={setStartDate}/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="end-time" value="End Time" />
              </div>
      <DateCalendar setterFunction={setEndDate}/>
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
              <div></div>
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
            {/* <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <a href="/modal" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                Lost Password?
              </a>
            </div> */}
            <div className="w-full">
            <Button  type="submit">
          Add
        </Button>
        {!!errorText && <Alert text={errorText} />}
            </div>
           
          </div>
    </form>
            {/* <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Close modal</span>
            </button> */}
            {/* <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Booking</h3>
                <form
        onSubmit={(e) => {
          e.preventDefault()
          addBooking(newTaskText)
        }}
        className="flex gap-2 my-2"
      >
  <DateCalendar setterFunction={setStartDate}/>
      <DateCalendar setterFunction={setEndDate}/>
    <ResourceDropDown session={session} setSelectedResourceId={setSelectedResourceId}/>
        <input
          className="rounded w-full p-2"
          type="text"
          placeholder="make coffee"
          value={newTaskText}
          onChange={(e) => {
            setErrorText('')
            setNewTaskText(e.target.value)
          }}
        />
       
      </form>    
            </div> */}

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
