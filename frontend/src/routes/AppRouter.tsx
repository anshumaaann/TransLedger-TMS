import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Customers from "../pages/Customers/Customers";
import Brokers from "../pages/Brokers/Brokers";
import Vehicles from "../pages/Vehicles/Vehicles";
import Locations from "../pages/Locations/Locations";
import Bookings from "../pages/Bookings/Bookings";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout />}>

          <Route index element={<Dashboard />} />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="brokers"
            element={<Brokers />}
          />

          <Route
            path="vehicles"
            element={<Vehicles />}
          />

          <Route
            path="locations"
            element={<Locations />}
          />

          <Route
            path="bookings"
            element={<Bookings />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}