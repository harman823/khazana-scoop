import React, { useState, useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LoadingScreen } from "./components/LoadingScreen";
import { AnimatePresence } from "motion/react";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling while loading screen is active
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <RouterProvider router={router} />
    </>
  );
}