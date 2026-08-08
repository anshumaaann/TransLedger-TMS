import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
}

export default function AddVehicleModal({ opened, onClose, onSubmit }: Props) {
  const form = useForm({
    initialValues: { vehicle_number: "", vehicle_type: "", owner_name: "", mobile: "", capacity: "" },
    validate: {
      vehicle_number: (value) => value.trim() ? null : "Vehicle number is required",
      vehicle_type: (value) => value.trim() ? null : "Vehicle type is required",
    },
  });

  const submit = async (values: typeof form.values) => {
    try {
      await onSubmit(values);
      form.reset();
      onClose();
      notifications.show({ color: "green", message: "Vehicle added. It is selected for this booking." });
    } catch {
      notifications.show({ color: "red", message: "Could not add the vehicle. Check the vehicle number." });
    }
  };

  return <Modal opened={opened} onClose={onClose} title="Add vehicle" centered>
    <form onSubmit={form.onSubmit(submit)}><Stack>
      <TextInput label="Vehicle number" placeholder="MH12AB1234" required {...form.getInputProps("vehicle_number")} />
      <Select label="Vehicle type" required data={["Truck", "Trailer", "Container", "Tanker", "Pickup"]} {...form.getInputProps("vehicle_type")} />
      <TextInput label="Owner name" {...form.getInputProps("owner_name")} />
      <TextInput label="Mobile number" {...form.getInputProps("mobile")} />
      <TextInput label="Capacity" placeholder="10 ton" {...form.getInputProps("capacity")} />
      <Button type="submit">Save vehicle</Button>
    </Stack></form>
  </Modal>;
}
