import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { useLoaderData, useNavigate } from "react-router-dom";
import AstronautTable from "../components/AstronautsTable";
import { Astronaut } from "../types";

export async function loader(): Promise<Astronaut[]> {
  const response = await fetch(
    "https://fastify-rest-demo-production.up.railway.app/api/astronauts"
  );
  if (!response.ok) {
    return [];
  }
  return await response.json();
}

export default function Astronauts() {
  const navigate = useNavigate();
  const astronauts = useLoaderData();

  return (
    <>
      <h1>Astronauts</h1>
      <p>
        Welcome to our website where you can find all the information you need
        about astronauts. Our astronaut table includes data on the name,
        surname, birthdate, and superpowers of all the astronauts in our
        database. You can easily search for specific astronauts using our search
        bar, and filter the table by different criteria. Our table is constantly
        updated with the latest information, so you can be sure that you're
        getting accurate and up-to-date information on the astronauts. Whether
        you're a student doing research or just curious about astronauts, our
        website has everything you need to know.
      </p>
      <Button
        variant="contained"
        endIcon={<AddIcon />}
        onClick={() => {
          navigate("/astronauts/create");
        }}
      >
        Add Astronaut
      </Button>
      <AstronautTable astronauts={(astronauts as Astronaut[]) ?? []} />
    </>
  );
}
