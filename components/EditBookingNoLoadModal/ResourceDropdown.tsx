import { Database } from "@/lib/schema";
import { Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { Select } from "flowbite-react";

type Resources = Database["public"]["Tables"]["resources"]["Row"];

export default function ResourceDropDown({
  session,
  setSelectedResourceId,
  selectedResourceId,
}: {
  session: Session;
  setSelectedResourceId: Function;
  selectedResourceId: string | number | readonly string[] | undefined;
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
        type ResourceResponse = Awaited<ReturnType<typeof fetchResources>>;
        setResources(resources);
      }
    };

    fetchResources().then(() => {});
  }, [supabase]);

  const handleChange = (e) => {
    setSelectedResourceId(e.target.value);
  };

  return (
    <Select id="resource" onChange={handleChange} value={selectedResourceId}>
      {resources.map((resource) => {
        return (
          <option key={resource.id} value={resource.id}>
            {resource.name}
          </option>
        );
      })}
    </Select>
  );
}
