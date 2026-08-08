import {
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import AddSiteModal from "../../components/forms/AddSiteModal";
import AddCustomerModal from "../../components/forms/AddCustomerModal";
import AddBrokerModal from "../../components/forms/AddBrokerModal";
import AddVehicleModal from "../../components/forms/AddVehicleModal";
import { createSite } from "../../services/site";
import { createCustomer } from "../../services/customer";
import { createBroker } from "../../services/brokers";
import { createVehicle } from "../../services/vehicle";

interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<unknown>;
  booking?: any;
  customers: any[];
  brokers: any[];
  vehicles: any[];
  sites: any[];
}

const asAmount = (value: unknown) => Number(value) || 0;

export default function AddBookingModal({
  opened,
  onClose,
  onSubmit,
  booking,
  customers,
  brokers,
  vehicles,
  sites,
}: Props) {
  const queryClient = useQueryClient();
  const [siteModalOpened, setSiteModalOpened] = useState(false);
  const [customerModalOpened, setCustomerModalOpened] = useState(false);
  const [brokerModalOpened, setBrokerModalOpened] = useState(false);
  const [vehicleModalOpened, setVehicleModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      booking_date: new Date(),
      customer_id: "",
      broker_id: "",
      vehicle_id: "",
      loading_site_id: "",
      unloading_site_id: "",
      bill_to: "",
      weight: 0,
      freight_type: "",
      customer_freight: 0,
      customer_advance: 0,
      customer_paid_amount: 0,
      payment_received_amount: 0,
      tds_amount: 0,
      customer_payment_choice: "pending",
      broker_freight: 0,
      broker_advance: 0,
      broker_paid_amount: 0,
      broker_payment_choice: "pending",
      payment_method: "",
      bill_submission_status: "",
      remarks: "",
    },
    validate: {
      customer_id: (value) => value ? null : "Select or add a customer",
      broker_id: (value) => value ? null : "Select or add a broker",
      vehicle_id: (value) => value ? null : "Select or add a vehicle",
      loading_site_id: (value) => value ? null : "Select or add a loading site",
      unloading_site_id: (value) => value ? null : "Select or add an unloading site",
      weight: (value) => asAmount(value) > 0 ? null : "Weight must be greater than zero",
      customer_freight: (value) => asAmount(value) >= 0 ? null : "Enter customer freight",
      broker_freight: (value) => asAmount(value) >= 0 ? null : "Enter broker freight",
      tds_amount: (value, values) => asAmount(value) <= asAmount(values.customer_freight) ? null : "TDS cannot be more than customer freight",
      customer_advance: (value, values) => values.customer_payment_choice === "paid" || asAmount(value) + asAmount(values.tds_amount) <= asAmount(values.customer_freight) ? null : "Paid now plus TDS cannot be more than customer freight",
      broker_advance: (value, values) => values.broker_payment_choice === "paid" || asAmount(value) <= asAmount(values.broker_freight) ? null : "Paid now cannot be more than broker freight",
    },
  });

  useEffect(() => {
    if (booking) {
      form.setValues({
        booking_date: new Date(booking.booking_date),
        customer_id: booking.customer_id,
        broker_id: booking.broker_id,
        vehicle_id: booking.vehicle_id,
        loading_site_id: booking.loading_site_id,
        unloading_site_id: booking.unloading_site_id,
        bill_to: booking.bill_to || "",
        weight: asAmount(booking.weight),
        freight_type: booking.freight_type || "",
        customer_freight: asAmount(booking.customer_freight),
        customer_advance: asAmount(booking.customer_advance),
        customer_paid_amount: asAmount(booking.customer_paid_amount),
        payment_received_amount: asAmount(booking.payment_received_amount),
        tds_amount: asAmount(booking.tds_amount),
        customer_payment_choice: booking.customer_payment_status === "paid" ? "paid" : "pending",
        broker_freight: asAmount(booking.broker_freight),
        broker_advance: asAmount(booking.broker_advance),
        broker_paid_amount: asAmount(booking.broker_paid_amount),
        broker_payment_choice: booking.broker_payment_status === "paid" ? "paid" : "pending",
        payment_method: booking.payment_method || "",
        bill_submission_status: booking.bill_submission_status || "",
        remarks: booking.remarks || "",
      });
    } else {
      form.reset();
    }
  }, [booking, opened]);

  const handleCreateCustomer = async (data: any) => {
    const customer = await createCustomer(data);
    await queryClient.invalidateQueries({ queryKey: ["customers"] });
    setCustomerModalOpened(false);
    form.setFieldValue("customer_id", customer.id);
    return customer;
  };

  const handleCreateBroker = async (data: any) => {
    const broker = await createBroker(data);
    await queryClient.invalidateQueries({ queryKey: ["brokers"] });
    setBrokerModalOpened(false);
    form.setFieldValue("broker_id", broker.id);
    return broker;
  };

  const handleCreateVehicle = async (data: any) => {
    const vehicle = await createVehicle(data);
    await queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    setVehicleModalOpened(false);
    form.setFieldValue("vehicle_id", vehicle.id);
    return vehicle;
  };

  const handleCreateSite = async (data: any) => {
    const site = await createSite(data);
    await queryClient.invalidateQueries({ queryKey: ["sites"] });
    setSiteModalOpened(false);
    if (!form.values.loading_site_id) form.setFieldValue("loading_site_id", site.id);
    else if (!form.values.unloading_site_id) form.setFieldValue("unloading_site_id", site.id);
    return site;
  };

  const customerFreight = asAmount(form.values.customer_freight);
  const brokerFreight = asAmount(form.values.broker_freight);
  const tdsAmount = asAmount(form.values.tds_amount);
  const customerAdvance = form.values.customer_payment_choice === "paid"
    ? Math.max(0, customerFreight - tdsAmount)
    : asAmount(form.values.customer_advance);
  const brokerAdvance = form.values.broker_payment_choice === "paid"
    ? brokerFreight
    : asAmount(form.values.broker_advance);
  const customerPending = Math.max(0, customerFreight - customerAdvance - tdsAmount - asAmount(form.values.customer_paid_amount) - asAmount(form.values.payment_received_amount));
  const brokerPending = Math.max(0, brokerFreight - brokerAdvance - asAmount(form.values.broker_paid_amount));

  const customerOptions = customers.map((item) => ({ value: item.id, label: item.customer_name }));
  const brokerOptions = brokers.map((item) => ({ value: item.id, label: item.broker_name }));
  const vehicleOptions = vehicles.map((item) => ({ value: item.id, label: item.vehicle_number }));
  const siteOptions = sites.map((item) => ({ value: item.id, label: item.site_name }));

  return (
    <>
      <Modal opened={opened} onClose={onClose} title={booking ? "Edit Booking" : "Create Booking"} size="lg" centered>
        <form onSubmit={form.onSubmit(async (values) => {
          const finalCustomerAdvance = values.customer_payment_choice === "paid"
            ? Math.max(0, asAmount(values.customer_freight) - asAmount(values.tds_amount))
            : asAmount(values.customer_advance);
          const finalBrokerAdvance = values.broker_payment_choice === "paid"
            ? asAmount(values.broker_freight)
            : asAmount(values.broker_advance);
          const payload = {
            booking_date: values.booking_date.toISOString().split("T")[0],
            customer_id: values.customer_id,
            broker_id: values.broker_id,
            vehicle_id: values.vehicle_id,
            loading_site_id: values.loading_site_id,
            unloading_site_id: values.unloading_site_id,
            bill_to: values.bill_to || undefined,
            weight: asAmount(values.weight),
            freight_type: values.freight_type || undefined,
            customer_freight: asAmount(values.customer_freight),
            customer_advance: finalCustomerAdvance,
            tds_amount: asAmount(values.tds_amount),
            broker_freight: asAmount(values.broker_freight),
            broker_advance: finalBrokerAdvance,
            payment_method: values.payment_method || undefined,
            bill_submission_status: values.bill_submission_status || undefined,
            payment_received_amount: asAmount(values.payment_received_amount),
            remarks: values.remarks || undefined,
          };
          try {
            await onSubmit(payload);
            form.reset();
            onClose();
            notifications.show({ color: "green", message: booking ? "Booking updated successfully." : "Booking created successfully." });
          } catch {
            notifications.show({ color: "red", message: "Could not save the booking. Check the payment amounts and try again." });
          }
        })}>
          <Stack>
            <DateInput label="Booking Date" {...form.getInputProps("booking_date")} />
            <Group align="end"><Select label="Customer" placeholder="Select customer" data={customerOptions} style={{ flex: 1 }} {...form.getInputProps("customer_id")} /><Button onClick={() => setCustomerModalOpened(true)}>+</Button></Group>
            <Group align="end"><Select label="Broker" placeholder="Select broker" data={brokerOptions} style={{ flex: 1 }} {...form.getInputProps("broker_id")} /><Button onClick={() => setBrokerModalOpened(true)}>+</Button></Group>
            <Group align="end"><Select label="Vehicle" placeholder="Select vehicle" data={vehicleOptions} style={{ flex: 1 }} {...form.getInputProps("vehicle_id")} /><Button onClick={() => setVehicleModalOpened(true)}>+</Button></Group>
            <Group align="end"><Select label="Loading Site" placeholder="Select loading site" data={siteOptions} style={{ flex: 1 }} {...form.getInputProps("loading_site_id")} /><Button onClick={() => setSiteModalOpened(true)}>+</Button></Group>
            <Group align="end"><Select label="Unloading Site" placeholder="Select unloading site" data={siteOptions} style={{ flex: 1 }} {...form.getInputProps("unloading_site_id")} /><Button onClick={() => setSiteModalOpened(true)}>+</Button></Group>
            <TextInput label="Bill To" {...form.getInputProps("bill_to")} />
            <NumberInput label="Weight" min={0} decimalScale={2} {...form.getInputProps("weight")} />
            <TextInput label="Freight Type" {...form.getInputProps("freight_type")} />

            <Divider label="Customer payment" labelPosition="center" />
            <NumberInput label="Customer Freight (₹)" min={0} decimalScale={2} {...form.getInputProps("customer_freight")} />
            <Select label="Customer payment status" data={[{ value: "pending", label: "Pending" }, { value: "paid", label: "Fully paid" }]} {...form.getInputProps("customer_payment_choice")} />
            <NumberInput label="TDS deducted from us (₹)" description="This reduces what the customer still owes you." min={0} decimalScale={2} {...form.getInputProps("tds_amount")} />
            {form.values.customer_payment_choice === "pending" && <NumberInput label="Customer paid now (₹)" description="Leave 0 if nothing was received yet." min={0} decimalScale={2} {...form.getInputProps("customer_advance")} />}
            <Text size="sm" c={customerPending === 0 ? "green" : "orange"}>Customer pending: ₹ {customerPending.toFixed(2)}</Text>

            <Divider label="Broker payment" labelPosition="center" />
            <NumberInput label="Broker Freight (₹)" min={0} decimalScale={2} {...form.getInputProps("broker_freight")} />
            <Select label="Broker payment status" data={[{ value: "pending", label: "Pending" }, { value: "paid", label: "Fully paid" }]} {...form.getInputProps("broker_payment_choice")} />
            {form.values.broker_payment_choice === "pending" && <NumberInput label="Broker paid now (₹)" description="Leave 0 if nothing was paid yet." min={0} decimalScale={2} {...form.getInputProps("broker_advance")} />}
            <Text size="sm" c={brokerPending === 0 ? "green" : "orange"}>Broker pending: ₹ {brokerPending.toFixed(2)}</Text>

            <Textarea label="Remarks" {...form.getInputProps("remarks")} />
            <Button type="submit">Save Booking</Button>
          </Stack>
        </form>
      </Modal>

      <AddCustomerModal opened={customerModalOpened} onClose={() => setCustomerModalOpened(false)} onSubmit={handleCreateCustomer} />
      <AddBrokerModal opened={brokerModalOpened} onClose={() => setBrokerModalOpened(false)} onSubmit={handleCreateBroker} />
      <AddVehicleModal opened={vehicleModalOpened} onClose={() => setVehicleModalOpened(false)} onSubmit={handleCreateVehicle} />
      <AddSiteModal opened={siteModalOpened} onClose={() => setSiteModalOpened(false)} onSubmit={handleCreateSite} />
    </>
  );
}
