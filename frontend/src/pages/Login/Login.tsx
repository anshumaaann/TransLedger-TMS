import { Button, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      const message = axios.isAxiosError(error) && !error.response
        ? "The TransLedger server is not running yet. Start the backend before signing in."
        : "Email or password is incorrect.";
      notifications.show({ color: "red", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack align="center" justify="center" mih="100vh" p="md">
      <Paper component="form" onSubmit={submit} shadow="md" radius="md" p="xl" w="100%" maw={420}>
        <Title order={2}>TransLedger TMS</Title>
        <Text c="dimmed" size="sm" mb="lg">Sign in to continue.</Text>
        <Stack>
          <TextInput label="Email address" type="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required />
          <PasswordInput label="Password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} required />
          <Button type="submit" loading={loading}>Sign in</Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
