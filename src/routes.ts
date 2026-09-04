import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import Budget from "./pages/Budget";
import History from "./pages/History";
import Settings from "./pages/Settings";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "stats", Component: Stats },
      { path: "budget", Component: Budget },
      { path: "history", Component: History },
      { path: "settings", Component: Settings },
    ],
  },
]);
