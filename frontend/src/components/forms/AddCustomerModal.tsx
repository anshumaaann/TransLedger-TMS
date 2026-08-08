import { Button, Modal, Stack, TextInput, Textarea } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
}

export default function AddCustomerModal({ opened, onClose, onSubmit }: Props) {
  const form = useForm({
    initialValues: { customer_code: "", customer_name: "", short_name: "", gst_number: "", contact_person: "", mobile: "", email: "", address: "" },
    validate: {
      customer_code: (value) => value.trim() ? null : "Customer code is required",
      customer_name: (value) => value.trim() ? null : "Customer name is required",
      short_name: (value) => value.trim() ? null : "Short name is required",
    },
  });

  const submit = async (values: typeof form.values) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
      notifications.show({ color: "green", message: "Customer added. It is selected for this booking." });
    } catch {
      notifications.show({ color: "red", message: "Could not add the customer. Check the code and email address." });
    }
  };

  return <Modal opened={opened} onClose={onClose} title="Add customer" centered>
    <form onSubmit={form.onSubmit(submit)}><Stack>
      <TextInput label="Customer code" placeholder="CUST-001" required {...form.getInputProps("customer_code")} />
      <TextInput label="Customer name" required {...form.getInputProps("customer_name")} />
      <TextInput label="Short name" required {...form.getInputProps("short_name")} />
      <TextInput label="GST number" {...form.getInputProps("gst_number")} />
      <TextInput label="Contact person" {...form.getInputProps("contact_person")} />
      <TextInput label="Mobile number" {...form.getInputProps("mobile")} />
      <TextInput label="Email" type="email" {...form.getInputProps("email")} />
      <Textarea label="Address" {...form.getInputProps("address")} />
      <Button type="submit">Save customer</Button>
    </Stack></form>
  </Modal>;
}
