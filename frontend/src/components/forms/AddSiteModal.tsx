import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
}

export default function AddSiteModal({ opened, onClose, onSubmit }: Props) {
  const form = useForm({
    initialValues: { site_name: "", site_type: "", address: "", city: "", state: "", pincode: "", contact_person: "", mobile: "" },
    validate: { site_name: (value) => value.trim() ? null : "Site name is required" },
  });

  const submit = async (values: typeof form.values) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
      notifications.show({ color: "green", message: "Site added. It is selected for this booking." });
    } catch {
      notifications.show({ color: "red", message: "Could not add the site." });
    }
  };

  return <Modal opened={opened} onClose={onClose} title="Add site" centered>
    <form onSubmit={form.onSubmit(submit)}><Stack>
      <TextInput label="Site name" required {...form.getInputProps("site_name")} />
      <Select label="Site type" data={["Refinery", "Plant", "Factory", "Warehouse", "Depot", "Port", "Terminal", "Mine", "Construction Site"]} {...form.getInputProps("site_type")} />
      <TextInput label="Address" {...form.getInputProps("address")} />
      <TextInput label="City" {...form.getInputProps("city")} />
      <TextInput label="State" {...form.getInputProps("state")} />
      <TextInput label="Pincode" {...form.getInputProps("pincode")} />
      <TextInput label="Contact person" {...form.getInputProps("contact_person")} />
      <TextInput label="Mobile number" {...form.getInputProps("mobile")} />
      <Button type="submit">Save site</Button>
    </Stack></form>
  </Modal>;
}
