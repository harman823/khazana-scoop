import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Booking } from "./pages/Booking";
import { Contact } from "./pages/Contact";
import { Webinars } from "./pages/Webinars";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "booking", Component: Booking },
      { path: "contact", Component: Contact },
      { path: "webinars", Component: Webinars },
      { path: "admin", Component: Admin },
      { path: "*", Component: () => <div className="p-24 text-center text-on-surface">Not found</div> },
    ],
  },
]);
