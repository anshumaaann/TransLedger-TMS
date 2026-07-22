import {
  IconDashboard,
  IconTruck,
  IconUsers,
  IconBuildingWarehouse,
  IconMapPin,
  IconFileAnalytics,
  IconSettings,
  IconCar,
} from "@tabler/icons-react";
import { NavLink, Stack } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Dashboard", icon: IconDashboard, to: "/" },
  { label: "Bookings", icon: IconTruck, to: "/bookings" },
  { label: "Customers", icon: IconUsers, to: "/customers" },
  { label: "Brokers", icon: IconBuildingWarehouse, to: "/brokers" },
  { label: "Vehicles", icon: IconCar, to: "/vehicles" },
  { label: "Locations", icon: IconMapPin, to: "/locations" },
  { label: "Reports", icon: IconFileAnalytics, to: "/reports" },
  { label: "Settings", icon: IconSettings, to: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <Stack gap={4} p="md">
      {links.map((item) => (
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