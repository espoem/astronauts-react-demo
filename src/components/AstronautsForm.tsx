import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers";
import * as dayjs from "dayjs";
import { Dayjs } from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import { SUPERPOWERS } from "../lib";
import { Astronaut, Superpower } from "../types";

const superpowers = ["Flying", "Walking on the Moon", "Super Hearing"];

type AstronautFormProps = {
  astronaut?: Pick<Astronaut, "id" | "name" | "surname" | "birthdate"> & {
    superpowers: Pick<Superpower, "id" | "name">[];
  };
};

export default function AstronautsForm({ astronaut }: AstronautFormProps) {
  const [name, setName] = React.useState(astronaut ? astronaut.name : "");
  const [surname, setSurname] = React.useState(
    astronaut ? astronaut.surname : ""
  );
  const [birthdate, setBirthdate] = React.useState<Dayjs | null>(
    astronaut?.birthdate ? dayjs(astronaut?.birthdate) : null
  );
  let initSuperpowers = astronaut?.superpowers || [];
  const [selectedPowers, setSelectedPowers] = React.useState<string[]>(
    initSuperpowers.map((sp) => sp.name)
  );
  const navigate = useNavigate();

  let newSuperpowers = React.useMemo(() => {
    return (
      selectedPowers.filter((sp) => {
        return !initSuperpowers.find((isp) => isp.name === sp);
      }) ?? []
    );
  }, [selectedPowers]);
  let deletedSuperpowers = React.useMemo(() => {
    return (
      initSuperpowers.filter((sp) => {
        return !selectedPowers.find((isp) => isp === sp.name);
      }) ?? []
    );
  }, [selectedPowers]);
  let updatedSuperpowers = React.useMemo(() => {
    return (
      initSuperpowers.filter((sp) => {
        return selectedPowers.find((isp) => isp === sp.name);
      }) ?? []
    );
  }, [selectedPowers]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!(Number(astronaut?.id) > 0)) {
      await fetch(
        "https://fastify-rest-demo-production.up.railway.app/api/astronauts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            surname,
            birthdate: birthdate?.toISOString().split("T")[0],
            superpowers: selectedPowers.map((sp) => ({ name: sp })),
          }),
        }
      );

      return navigate("/");
    }

    const response = await fetch(
      `https://fastify-rest-demo-production.up.railway.app/api/astronauts/${astronaut?.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          surname,
          birthdate: birthdate?.toISOString().split("T")[0],
          superpowers: [
            ...deletedSuperpowers.map((sp) => ({ id: sp.id, name: "" })),
            ...newSuperpowers.map((sp) => ({ name: sp })),
            ...updatedSuperpowers.map((sp) => ({ id: sp.id, name: sp.name })),
          ],
        }),
      }
    );

    return navigate("/");
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ flexGrow: 1, "& > :not(:first-of-type)": { mt: 0 } }}
      >
        <Grid container columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          <Grid item xs={1}>
            <TextField
              label="Name"
              name="name"
              required
              fullWidth={true}
              defaultValue={name}
              onChange={(event) => setName(event.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Surname"
              name="surname"
              required
              fullWidth={true}
              defaultValue={surname}
              onChange={(event) => setSurname(event.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={1}>
            <DatePicker
              value={birthdate}
              onChange={(newValue) => setBirthdate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Birthdate"
                  name="birthdate"
                  required
                  fullWidth={true}
                />
              )}
            ></DatePicker>
          </Grid>
        </Grid>
        <Grid container columns={{ xs: 1 }} spacing={2}>
          <Grid item xs={1}>
            <Autocomplete
              fullWidth={true}
              multiple
              defaultValue={initSuperpowers.map((sp) => sp.name)}
              renderInput={function (
                params: AutocompleteRenderInputParams
              ): React.ReactNode {
                return (
                  <TextField
                    {...params}
                    label="Superpowers"
                    name="superpower"
                  />
                );
              }}
              options={SUPERPOWERS}
              onChange={(event, value) => {
                setSelectedPowers(value);
              }}
            ></Autocomplete>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          columns={{ xs: 1, sm: 2 }}
          sx={{
            mt: 2,
            "& .MuiButton-root": { width: "100px" },
          }}
        >
          <Grid item>
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
