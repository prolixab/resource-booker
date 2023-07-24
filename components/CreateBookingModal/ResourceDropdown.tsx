import { Database } from '@/lib/schema'
import { Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

type Resources = Database['public']['Tables']['resources']['Row']


export default function ResourceDropDown({ session, setSelectedResourceId }: { session: Session, setSelectedResourceId:Function }) {
  const supabase = useSupabaseClient<Database>()
  const [resources, setResources] = useState<Resources[]>([])

  useEffect(() => {

    const fetchResources = async () => {
      const { data: resources, error } = await supabase
        .from('resources')
        .select('*')
        .order('id', { ascending: true })

      if (error) console.log('error', error)
      else {console.log(resources);

       type ResourceResponse = Awaited<ReturnType<typeof fetchResources>> 
       setResources(resources)
      }
    }

    fetchResources()
  }, [supabase])

  const handleChange=(e)=>{
    setSelectedResourceId(e.target.value);
  }

  return (
<>
<select id="resource" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
  {resources.map((resource) => (
            <option key={resource.id} value={resource.id}>{resource.name}</option>
          ))}
</select>
</>
    
  )
}

