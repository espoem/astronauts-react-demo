import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Astronauts, { loader as astronautsLoader } from "./routes/Astronauts";
import AstronautsForm from "./components/AstronautsForm";
import CreateAstronaut from "./routes/CreateAstronaut";
import EditAstronaut, {
  loader as editAstronautLoader,
} from "./routes/EditAstronaut";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Astronauts />,
        loader: astronautsLoader,
      },
      {
        path: "test",
        element: (
          <AstronautsForm
            astronaut={{
              id: 1,
              name: "martin",
              surname: "test",
              birthdate: "2022-10-12",
              superpowers: [
                { id: 1, name: "super strength" },
                { id: 2, name: "super hearing" },
              ],
            }}
          />
        ),
      },
      {
        path: "astronauts/create",
        element: <CreateAstronaut />,
      },
      {
        path: "astronauts/:id/edit",
        loader: editAstronautLoader,
        element: <EditAstronaut />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
