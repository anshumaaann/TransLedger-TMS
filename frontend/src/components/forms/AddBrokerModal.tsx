import { Button, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
}

export default function AddBrokerModal({ opened, onClose, onSubmit }: Props) {
  const form = useForm({
    initialValues: { broker_code: "", broker_name: "", contact_person: "", mobile: "", email: "", address: "" },
    validate: {
      broker_code: (value) => value.trim() ? null : "Broker code is required",
      broker_name: (value) => value.trim() ? null : "Broker name is required",
    },
  });

  const submit = async (values: typeof form.values) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
      notifications.show({ color: "green", message: "Broker added. It is selected for this booking." });
    } catch {
      notifications.show({ color: "red", message: "Could not add the broker. Check the code and email address." });
    }
  };

  return <Modal opened={opened} onClose={onClose} title="Add broker" centered>
    <form onSubmit={form.onSubmit(submit)}><Stack>
      <TextInput label="Broker code" placeholder="BRK-001" required {...form.getInputProps("broker_code")} />
      <TextInput label="Broker name" required {...form.getInputProps("broker_name")} />
      <TextInput label="Contact person" {...form.getInputProps("contact_person")} />
      <TextInput label="Mobile number" {...form.getInputProps("mobile")} />
      <TextInput label="Email" type="email" {...form.getInputProps("email")} />
      <Textarea label="Address" {...form.getInputProps("address")} />
      <Button type="submit">Save broker</Button>
    </Stack></form>
  </Modal>;
}
