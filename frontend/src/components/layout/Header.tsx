import { Button, Group, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Group h="100%" px="md" justify="space-between">
      <Title order={3}>TransLedger TMS</Title>
      <Group gap="sm">
        <Text size="sm">{user?.full_name} ({user?.role})</Text>
        <Button size="xs" variant="default" onClick={() => { logout(); navigate("/login"); }}>
          Sign out
        </Button>
      </Group>
    </Group>
  );
}
