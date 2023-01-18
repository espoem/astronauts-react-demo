import AstronautsForm from "../components/AstronautsForm";

import { useLoaderData, Params } from "react-router-dom";
import { Astronaut } from "../types";

export async function loader({
  params,
}: {
  params: Params;
}): Promise<Astronaut> {
  const { id } = params;
  const response = await fetch(
    "https://fastify-rest-demo-production.up.railway.app/api/astronauts/" + id
  );
  if (!response.ok) {
    throw new Error("Error loading astronaut");
  }
  const astronaut = await response.json();
  return astronaut;
}

export default function EditAstronaut() {
  const astronaut = useLoaderData();

  return (
    <>
      <h1>Edit Astronaut</h1>
      <AstronautsForm astronaut={astronaut as Astronaut} />
    </>
  );
}
