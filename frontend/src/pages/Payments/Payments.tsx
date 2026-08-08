import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Group,
  Loader,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useBookings } from "../../hooks/useBookings";
import { useBrokers } from "../../hooks/useBrokers";
import { useCustomers } from "../../hooks/useCustomers";
import { usePayments } from "../../hooks/usePayments";

const amount = (value: unknown) => Number(value) || 0;

export default function Payments() {
  const { data: payments = [], isLoading, isError, createPayment, deletePayment } = usePayments();
  const { data: bookings = [] } = useBookings();
  const { data: customers = [] } = useCustomers();
  const { data: brokers = [] } = useBrokers();
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      booking_id: "",
      party_type: "customer",
      payment_date: new Date(),
      amount: 0,
      tds_amount: 0,
      payment_method: "Bank transfer",
      reference_number: "",
      remarks: "",
    },
    validate: {
      booking_id: (value) => value ? null : "Select a booking",
      amount: (value, values) => amount(value) + amount(values.tds_amount) > 0 ? null : "Enter an amount or TDS",
      tds_amount: (value, values) => values.party_type === "broker" && amount(value) > 0 ? "TDS is only for customer payments" : null,
    },
  });

  const bookingOptions = bookings.map((booking: any) => {
    const customer = customers.find((item: any) => item.id === booking.customer_id)?.customer_name || "Customer";
    const broker = brokers.find((item: any) => item.id === booking.broker_id)?.broker_name || "Broker";
    return { value: booking.id, label: `${booking.booking_number} | Booking date: ${booking.booking_date} | ${customer} / ${broker}` };
  });
  const bookingById = bookings.find((booking: any) => booking.id === form.values.booking_id);
  const pending = form.values.party_type === "customer"
    ? amount(bookingById?.customer_balance)
    : amount(bookingById?.broker_balance);

  const openCreate = () => {
    form.reset();
    setOpened(true);
  };

  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red">Failed to load payments.</Alert>;

  return (
    <>
      <Group justify="space-between" mb="lg">
        <div>
          <Title>Payments</Title>
        </div>
        <Button onClick={openCreate}>+ Record Payment</Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder>
        <Table.ScrollContainer minWidth={900}>
        <Table striped highlightOnHover>
          <Table.Thead><Table.Tr><Table.Th>Payment Date</Table.Th><Table.Th>Booking Date</Table.Th><Table.Th>Booking</Table.Th><Table.Th>Party</Table.Th><Table.Th>Cash amount</Table.Th><Table.Th>TDS</Table.Th><Table.Th>Reference</Table.Th><Table.Th>Action</Table.Th></Table.Tr></Table.Thead>
          <Table.Tbody>
            {payments.map((payment) => {
              const booking = bookings.find((item: any) => item.id === payment.booking_id);
              return <Table.Tr key={payment.id}>
                <Table.Td>{payment.payment_date}</Table.Td>
                <Table.Td>{booking?.booking_date || "-"}</Table.Td>
                <Table.Td>{booking?.booking_number || "-"}</Table.Td>
                <Table.Td>{payment.party_type === "customer" ? "Customer received" : "Broker paid"}</Table.Td>
                <Table.Td>₹ {amount(payment.amount).toFixed(2)}</Table.Td>
                <Table.Td>{amount(payment.tds_amount) ? `₹ ${amount(payment.tds_amount).toFixed(2)}` : "-"}</Table.Td>
                <Table.Td>{payment.reference_number || payment.payment_method || "-"}</Table.Td>
                <Table.Td><ActionIcon color="red" variant="light" aria-label="Delete payment" onClick={async () => {
                  try {
                    await deletePayment(payment.id);
                    notifications.show({ color: "green", message: "Payment deleted and balance restored." });
                  } catch {
                    notifications.show({ color: "red", message: "Could not delete this payment." });
                  }
                }}><IconTrash size={16} /></ActionIcon></Table.Td>
              </Table.Tr>;
            })}
            {!payments.length && <Table.Tr><Table.Td colSpan={8}>No payments have been recorded yet.</Table.Td></Table.Tr>}
          </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
      </Card>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Record Payment" centered>
        <form onSubmit={form.onSubmit(async (values) => {
          try {
            await createPayment({
              booking_id: values.booking_id,
              party_type: values.party_type as "customer" | "broker",
              payment_date: values.payment_date.toISOString().split("T")[0],
              amount: amount(values.amount),
              tds_amount: values.party_type === "customer" ? amount(values.tds_amount) : 0,
              payment_method: values.payment_method || undefined,
              reference_number: values.reference_number || undefined,
              remarks: values.remarks || undefined,
            });
            setOpened(false);
            form.reset();
            notifications.show({ color: "green", message: "Payment saved and booking balance updated." });
          } catch {
            notifications.show({ color: "red", message: "Could not save payment. Do not enter more than the booking's pending amount." });
          }
        })}>
          <Stack>
            <Select label="Booking" searchable data={bookingOptions} placeholder="Select booking" {...form.getInputProps("booking_id")} />
            <Select label="Payment type" data={[{ value: "customer", label: "Customer paid us" }, { value: "broker", label: "We paid broker" }]} {...form.getInputProps("party_type")} />
            {bookingById && <Alert color={pending === 0 ? "green" : "blue"}>Booking date: {bookingById.booking_date} · Pending on this booking: ₹ {pending.toFixed(2)}</Alert>}
            <DateInput label="Payment Date" {...form.getInputProps("payment_date")} />
            <NumberInput label={form.values.party_type === "customer" ? "Cash received (₹)" : "Cash paid (₹)"} min={0} decimalScale={2} {...form.getInputProps("amount")} />
            {form.values.party_type === "customer" && <NumberInput label="TDS deducted from us (₹)" description="Cash plus TDS cannot be more than the customer pending amount." min={0} decimalScale={2} {...form.getInputProps("tds_amount")} />}
            <Select label="Payment Method" data={["Bank transfer", "UPI", "Cash", "Cheque", "Other"]} {...form.getInputProps("payment_method")} />
            <TextInput label="Reference / cheque number" {...form.getInputProps("reference_number")} />
            <Textarea label="Remarks" {...form.getInputProps("remarks")} />
            <Button type="submit">Save Payment</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
