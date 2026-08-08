import {
  IconDashboard,
  IconTruck,
  IconUsers,
  IconBuildingWarehouse,
  IconMapPin,
  IconFileAnalytics,
  IconSettings,
  IconCar,
  IconCash,
  IconNotebook,
} from "@tabler/icons-react";
import { NavLink, Stack } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const links = [
  { label: "Dashboard", icon: IconDashboard, to: "/" },
  { label: "Bookings", icon: IconTruck, to: "/bookings" },
  { label: "Payments", icon: IconCash, to: "/payments" },
  { label: "Ledgers", icon: IconNotebook, to: "/ledgers" },
  { label: "Customers", icon: IconUsers, to: "/customers" },
  { label: "Brokers", icon: IconBuildingWarehouse, to: "/brokers" },
  { label: "Vehicles", icon: IconCar, to: "/vehicles" },
  { label: "Locations", icon: IconMapPin, to: "/locations" },
  { label: "Reports", icon: IconFileAnalytics, to: "/reports" },
  { label: "Settings", icon: IconSettings, to: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const visibleLinks = user?.role === "admin"
    ? [...links, { label: "Staff accounts", icon: IconUsers, to: "/users" }]
    : links.filter((item) => item.label !== "Settings");

  return (
    <Stack gap={4} p="md">
      {visibleLinks.map((item) => (
        <NavLink
          key={item.label}
          component={Link}
          to={item.to}
          label={item.label}
          leftSection={<item.icon size={18} />}
          active={location.pathname === item.to}
        />
      ))}
    </Stack>
  );
}
