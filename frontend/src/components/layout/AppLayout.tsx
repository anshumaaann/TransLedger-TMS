import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import AppSidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}