import { Alert, Badge, Button, Group, Modal, Paper, PasswordInput, Select, Stack, Table, Text, TextInput, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { createUser, getUsers, updateUser, type CreateUserInput, type UserRole } from "../../services/auth";

const roles: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "accountant", label: "Accountant" },
  { value: "viewer", label: "Viewer" },
];

export default function Users() {
  const { user } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateUserInput>({ email: "", full_name: "", password: "", role: "dispatcher" });
  const users = useQuery({ queryKey: ["users"], queryFn: getUsers, enabled: user?.role === "admin" });
  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setForm({ email: "", full_name: "", password: "", role: "dispatcher" });
      close();
      notifications.show({ color: "green", message: "Staff account created." });
    },
    onError: () => notifications.show({ color: "red", message: "Could not create the account. Check that the email is unique and password has at least 12 characters." }),
  });
  const toggleUser = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) => updateUser(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: () => notifications.show({ color: "red", message: "Could not update this staff account." }),
  });

  if (user?.role !== "admin") return <Alert color="yellow" title="Administrator access required">Only an administrator can manage staff accounts.</Alert>;

  return (
    <>
      <Group justify="space-between" mb="md">
        <div><Title order={1}>Staff accounts</Title><Text c="dimmed">Create a separate account for every team member.</Text></div>
        <Button onClick={open}>Add staff member</Button>
      </Group>
      <Paper withBorder p="md">
        <Table striped highlightOnHover>
          <Table.Thead><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Email</Table.Th><Table.Th>Role</Table.Th><Table.Th>Status</Table.Th><Table.Th></Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>{users.data?.map((staff) => <Table.Tr key={staff.id}><Table.Td>{staff.full_name}</Table.Td><Table.Td>{staff.email}</Table.Td><Table.Td><Badge variant="light">{staff.role}</Badge></Table.Td><Table.Td>{staff.is_active ? "Active" : "Disabled"}</Table.Td><Table.Td>{staff.id !== user.id && <Button size="xs" color={staff.is_active ? "red" : "green"} variant="light" loading={toggleUser.isPending} onClick={() => toggleUser.mutate({ id: staff.id, is_active: !staff.is_active })}>{staff.is_active ? "Disable" : "Enable"}</Button>}</Table.Td></Table.Tr>)}</Table.Tbody>
        </Table>
      </Paper>
      <Modal opened={opened} onClose={close} title="Add staff member" centered>
        <form onSubmit={(event) => { event.preventDefault(); create.mutate(form); }}>
          <Stack>
            <TextInput label="Full name" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.currentTarget.value })} required />
            <TextInput label="Email address" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.currentTarget.value })} required />
            <PasswordInput label="Temporary password" description="At least 12 characters" value={form.password} onChange={(event) => setForm({ ...form, password: event.currentTarget.value })} minLength={12} required />
            <Select label="Role" data={roles} value={form.role} onChange={(value) => setForm({ ...form, role: (value ?? "dispatcher") as UserRole })} allowDeselect={false} />
            <Button type="submit" loading={create.isPending}>Create account</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
