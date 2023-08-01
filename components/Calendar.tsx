import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import EditBookingModal from '@/components/EditBookingModal/EditBookingModal'
import {useState} from 'react'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'

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

export default function Calendar({events,handleDateClick,session, successfullySubmitted}:{events:AltTodo[],handleDateClick:Function,session:Session, successfullySubmitted:Function}){


    const [openModal, setOpenModal] = useState<string | undefined>();
    const [bookingId,setBookingId]=useState();

      const handleEventClick = (arg) => { 
       // console.log(arg)
        setBookingId(arg.event.id);
        setOpenModal('edit-booking');
      }

    return ( <><FullCalendar 
        plugins={[ dayGridPlugin,timeGridPlugin,interactionPlugin  ]} 
        headerToolbar={{left: 'prev,next',center: 'title',right: 'timeGridWeek,timeGridDay'}}
        initialView="timeGridWeek"  
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        weekNumbers={true}
        events={events}
      />
      <EditBookingModal bookingId={bookingId} session={session}  openModal={openModal} setOpenModal={setOpenModal} successfullySubmitted={successfullySubmitted}></EditBookingModal>
 
  </>
      )
} 