import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import AppHeader from "./Header";
import AppSidebar from "./Sidebar";

export default function AppLayout() {
  const [mobileOpened, { toggle, close }] = useDisclosure(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: "md", collapsed: { mobile: !mobileOpened } }}
      padding={{ base: "xs", sm: "md" }}
    >
      <AppShell.Header>
        <AppHeader mobileOpened={mobileOpened} onMobileMenuToggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar>
        <AppSidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
