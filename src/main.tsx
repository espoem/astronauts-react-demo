import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AstronautsForm from "./components/AstronautsForm";
import Astronauts, { loader as astronautsLoader } from "./routes/Astronauts";
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
