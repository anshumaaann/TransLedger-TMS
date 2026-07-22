import { Group, Title } from "@mantine/core";

export default function AppHeader() {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Title order={3}>🚛 TransLedger-TMS</Title>
    </Group>
  );
}