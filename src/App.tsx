import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AppProvider } from "./context/AppContext";
import Landing from "./pages/Landing";

const HAS_VISITED_KEY = "expense_tracker_has_visited_v4";

function AppWithLanding() {
  const [hasVisited, setHasVisited] = useState(() => {
    try {
      return localStorage.getItem(HAS_VISITED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleGetStarted = () => {
    try {
      localStorage.setItem(HAS_VISITED_KEY, "true");
    } catch {
      // ignore
    }
    setHasVisited(true);
  };

  if (!hasVisited) {
    return <Landing onGetStarted={handleGetStarted} />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppWithLanding />
    </AppProvider>
  );
}
