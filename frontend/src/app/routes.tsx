import React from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Booking } from "./pages/Booking";
import { Contact } from "./pages/Contact";

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
      {
        path: "*",
        Component: () => (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h1 className="text-4xl font-serif text-[#125E8A] mb-4">404 - Not Found</h1>
            <p className="text-[#D47A5A]">The page you are looking for does not exist.</p>
          </div>
        ),
      },
    ],
  },
]);