import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Select } from "flowbite-react";

type Resources = Database["public"]["Tables"]["resources"]["Row"];

export default function ResourceDropDown({
  session,
  setSelectedResourceId,
}: {
  session: Session;
  setSelectedResourceId: Function;
}) {
  const supabase = useSupabaseClient<Database>();
  const [resources, setResources] = useState<Resources[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      const { data: resources, error } = await supabase
        .from("resources")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.log("error", error);
      else {
        //console.log(resources);

        type ResourceResponse = Awaited<ReturnType<typeof fetchResources>>;
        setResources(resources);
      }
    };

    fetchResources();
  }, [supabase]);

  const handleChange = (e) => {
    setSelectedResourceId(e.target.value);
  };

  return (
    <>
      <Select id="resource" onChange={handleChange}>
        <option key={-1} value={-1}>
          All
        </option>
        {resources.map((resource) => (
          <option key={resource.id} value={resource.id}>
            {resource.name}
          </option>
        ))}
      </Select>
    </>
  );
}
