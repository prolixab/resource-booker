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

export default function Booking({ booking, onDelete }: { booking: Todos; onDelete: () => void }) {
  const supabase = useSupabaseClient<Database>()
  const [isCompleted, setIsCompleted] = useState(/*todo.is_complete*/)

  // const toggle = async () => {
  //   try {
  //     const { data } = await supabase
  //       .from('todos')
  //       .update({ is_complete: !isCompleted })
  //       .eq('id', todo.id)
  //       .throwOnError()
  //       .select()
  //       .single()

  //     if (data) setIsCompleted(data.is_complete)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }

  return (
    <li className="w-full block cursor-pointer hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition duration-150 ease-in-out">
      <div className="flex items-center px-4 py-4 sm:px-6">
        <div className="min-w-0 flex-1 flex items-center">
        <span className="text-sm leading-5 font-medium truncate"> {Moment(booking.start_time).format('d MMM hh:mm')} - {Moment(booking.end_time).format('d MMM hh:mm')} {booking.resource.name} {booking.user.first_name} {booking.user.last_name}</span>

 {/* <div className="text-sm leading-5 font-medium truncate">{booking.note}</div> */}


        </div>
        <div>
          <input
            className="cursor-pointer"
            onChange={(e) => toggle()}
            type="checkbox"
            checked={isCompleted ? true : false}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onDelete()
          }}
          className="w-4 h-4 ml-2 border-2 hover:border-black rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </li>
  )
}


