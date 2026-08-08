import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../auth/ProtectedRoute";

import AppLayout from "../components/layout/AppLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Customers from "../pages/Customers/Customers";
import Brokers from "../pages/Brokers/Brokers";
import Vehicles from "../pages/Vehicles/Vehicles";
import Locations from "../pages/Locations/Locations";
import Bookings from "../pages/Bookings/Bookings";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import Login from "../pages/Login/Login";
import Users from "../pages/Users/Users";
import Payments from "../pages/Payments/Payments";
import Ledgers from "../pages/Ledgers/Ledgers";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="login" element={<Login />} />

        <Route element={<ProtectedRoute />}>

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

          <Route path="payments" element={<Payments />} />

          <Route path="ledgers" element={<Ledgers />} />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

          <Route path="users" element={<Users />} />

        </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
