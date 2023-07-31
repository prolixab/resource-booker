import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import Moment from 'moment';

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

export default function Booking({ booking, resource, onDelete }: { booking: Todos; resource:Number; onDelete: () => void }) {
  const supabase = useSupabaseClient<Database>()

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex justify-between">
        <span className="text-sm leading-5 font-medium truncate"> {Moment(booking.start_time).format('ddd DD/MM HH:mm')}</span>
        <span className="text-sm leading-5 font-medium truncate"> {Moment(booking.end_time).format('ddd DD/MM HH:mm')} </span>
        <span className="text-sm leading-5 font-medium truncate">  {booking.resource.name} </span>
        <span className="text-sm leading-5 font-medium truncate">  {booking.user.first_name} </span>
        <span className="text-sm leading-5 font-medium truncate"> {booking.user.last_name}</span>

 {/* <div className="text-sm leading-5 font-medium truncate">{booking.note}</div> */}


        </div>
      </div>
    </li>
  )
}


