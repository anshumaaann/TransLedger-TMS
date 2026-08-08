import { Burger, Button, Group, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

interface Props {
  mobileOpened: boolean;
  onMobileMenuToggle: () => void;
}

export default function AppHeader({ mobileOpened, onMobileMenuToggle }: Props) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Group h="100%" px={{ base: "xs", sm: "md" }} justify="space-between" wrap="nowrap">
      <Group gap="xs" wrap="nowrap">
        <Burger hiddenFrom="md" opened={mobileOpened} onClick={onMobileMenuToggle} size="sm" aria-label="Open navigation" />
        <Title order={3} lineClamp={1}>TransLedger TMS</Title>
      </Group>
      <Group gap="xs" wrap="nowrap">
        <Text size="sm" visibleFrom="sm" lineClamp={1}>{user?.full_name} ({user?.role})</Text>
        <Button size="xs" variant="default" onClick={() => { logout(); navigate("/login"); }}>
          Sign out
        </Button>
      </Group>
    </Group>
  );
}
