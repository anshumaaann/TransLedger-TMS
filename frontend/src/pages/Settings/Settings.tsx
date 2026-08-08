import { Button, Paper, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { changePassword } from "../../services/auth";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      notifications.show({ color: "red", message: "The new passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notifications.show({ color: "green", message: "Your password has been changed." });
    } catch {
      notifications.show({ color: "red", message: "Could not change the password. Check your current password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title order={1}>Settings</Title>
      <Text c="dimmed" mb="md">Manage your own account security.</Text>
      <Paper component="form" onSubmit={submit} withBorder p="md" maw={460}>
        <Stack>
          <PasswordInput label="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.currentTarget.value)} required />
          <PasswordInput label="New password" description="Use at least 12 characters." value={newPassword} onChange={(event) => setNewPassword(event.currentTarget.value)} minLength={12} required />
          <PasswordInput label="Confirm new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.currentTarget.value)} minLength={12} required />
          <Button type="submit" loading={loading}>Change password</Button>
        </Stack>
      </Paper>
    </>
  );
}
