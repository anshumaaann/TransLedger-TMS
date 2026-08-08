import {
  Alert,
  Button,
  Card,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useMemo, useState } from "react";
import { useBookings } from "../../hooks/useBookings";
import { useBrokers } from "../../hooks/useBrokers";
import { useCustomers } from "../../hooks/useCustomers";
import { usePayments } from "../../hooks/usePayments";
import { useVehicles } from "../../hooks/useVehicles";

type ReportType = "bookings" | "receivables" | "payables" | "payments" | "profit";
type ReportRow = Record<string, string | number>;

const amount = (value: unknown) => Number(value) || 0;
const money = (value: unknown) => `₹ ${amount(value).toFixed(2)}`;

function localDateKey(value: Date | null) {
  if (!value) return "";
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export default function Reports() {
  const today = new Date();
  const [reportType, setReportType] = useState<ReportType>("bookings");
  const [startDate, setStartDate] = useState<Date | null>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [brokerId, setBrokerId] = useState<string | null>(null);
  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError } = useBookings();
  const { data: payments = [], isLoading: paymentsLoading, isError: paymentsError } = usePayments();
  const { data: customers = [] } = useCustomers();
  const { data: brokers = [] } = useBrokers();
  const { data: vehicles = [] } = useVehicles();

  const startKey = localDateKey(startDate);
  const endKey = localDateKey(endDate);
  const customerName = (id: string) => customers.find((customer: any) => customer.id === id)?.customer_name || "Unknown customer";
  const brokerName = (id: string) => brokers.find((broker: any) => broker.id === id)?.broker_name || "Unknown broker";
  const vehicleNumber = (id: string) => vehicles.find((vehicle: any) => vehicle.id === id)?.vehicle_number || "-";

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const insideDates = (!startKey || booking.booking_date >= startKey) && (!endKey || booking.booking_date <= endKey);
    return insideDates && (!customerId || booking.customer_id === customerId) && (!brokerId || booking.broker_id === brokerId);
  }), [bookings, startKey, endKey, customerId, brokerId]);

  const filteredPayments = useMemo(() => payments.filter((payment) => {
    const booking = bookings.find((item) => item.id === payment.booking_id);
    const insideDates = (!startKey || payment.payment_date >= startKey) && (!endKey || payment.payment_date <= endKey);
    return insideDates && Boolean(booking) && (!customerId || booking?.customer_id === customerId) && (!brokerId || booking?.broker_id === brokerId);
  }), [payments, bookings, startKey, endKey, customerId, brokerId]);

  const report = useMemo(() => {
    const bookingRows: ReportRow[] = filteredBookings.map((booking) => ({
      booking_date: booking.booking_date,
      booking_number: booking.booking_number,
      customer: customerName(booking.customer_id),
      broker: brokerName(booking.broker_id),
      vehicle: vehicleNumber(booking.vehicle_id),
      customer_freight: money(booking.customer_freight),
      broker_freight: money(booking.broker_freight),
      profit: money(booking.profit),
      customer_status: booking.customer_payment_status,
      customer_pending: money(booking.customer_balance),
      broker_status: booking.broker_payment_status,
      broker_pending: money(booking.broker_balance),
    }));

    if (reportType === "bookings") return {
      title: "Booking report",
      description: "All bookings matching the selected filters.",
      columns: [
        ["booking_date", "Booking Date"], ["booking_number", "Booking No."], ["customer", "Customer"], ["broker", "Broker"], ["vehicle", "Vehicle"],
        ["customer_freight", "Customer Freight"], ["broker_freight", "Broker Freight"], ["profit", "Profit"], ["customer_status", "Customer Status"], ["customer_pending", "Customer Pending"], ["broker_status", "Broker Status"], ["broker_pending", "Broker Pending"],
      ],
      rows: bookingRows,
    };

    if (reportType === "receivables") {
      const rows = customers.map((customer: any) => {
        const matching = filteredBookings.filter((booking) => booking.customer_id === customer.id);
        const freight = matching.reduce((total, booking) => total + amount(booking.customer_freight), 0);
        const pending = matching.reduce((total, booking) => total + amount(booking.customer_balance), 0);
        return { customer: customer.customer_name, code: customer.customer_code, bookings: matching.length, freight: money(freight), settled: money(freight - pending), pending: money(pending), status: pending === 0 ? "Fully paid" : freight === pending ? "Pending" : "Partially paid" };
      }).filter((row) => row.bookings > 0);
      return { title: "Customer outstanding report", description: "Money due from each customer.", columns: [["customer", "Customer"], ["code", "Code"], ["bookings", "Bookings"], ["freight", "Total Freight"], ["settled", "Settled"], ["pending", "Pending"], ["status", "Status"]], rows };
    }

    if (reportType === "payables") {
      const rows = brokers.map((broker: any) => {
        const matching = filteredBookings.filter((booking) => booking.broker_id === broker.id);
        const freight = matching.reduce((total, booking) => total + amount(booking.broker_freight), 0);
        const pending = matching.reduce((total, booking) => total + amount(booking.broker_balance), 0);
        return { broker: broker.broker_name, code: broker.broker_code, bookings: matching.length, freight: money(freight), settled: money(freight - pending), pending: money(pending), status: pending === 0 ? "Fully paid" : freight === pending ? "Pending" : "Partially paid" };
      }).filter((row) => row.bookings > 0);
      return { title: "Broker payable report", description: "Money still due to each broker.", columns: [["broker", "Broker"], ["code", "Code"], ["bookings", "Bookings"], ["freight", "Total Freight"], ["settled", "Paid"], ["pending", "Pending"], ["status", "Status"]], rows };
    }

    if (reportType === "payments") {
      const rows = filteredPayments.map((payment) => {
        const booking = bookings.find((item) => item.id === payment.booking_id);
        return {
          payment_date: payment.payment_date,
          booking_date: booking?.booking_date || "-",
          booking_number: booking?.booking_number || "-",
          party: payment.party_type === "customer" ? customerName(booking?.customer_id || "") : brokerName(booking?.broker_id || ""),
          payment_type: payment.party_type === "customer" ? "Customer received" : "Broker paid",
          cash_amount: money(payment.amount),
          tds: money(payment.tds_amount),
          method: payment.payment_method || "-",
          reference: payment.reference_number || "-",
        };
      });
      return { title: "Payment and TDS report", description: "Payments recorded during the selected dates.", columns: [["payment_date", "Payment Date"], ["booking_date", "Booking Date"], ["booking_number", "Booking No."], ["party", "Customer / Broker"], ["payment_type", "Type"], ["cash_amount", "Cash Amount"], ["tds", "TDS"], ["method", "Method"], ["reference", "Reference"]], rows };
    }

    const rows = filteredBookings.map((booking) => ({
      booking_date: booking.booking_date,
      booking_number: booking.booking_number,
      customer: customerName(booking.customer_id),
      broker: brokerName(booking.broker_id),
      revenue: money(booking.customer_freight),
      cost: money(booking.broker_freight),
      profit: money(booking.profit),
    }));
    return { title: "Profit report", description: "Profit is customer freight minus broker freight.", columns: [["booking_date", "Booking Date"], ["booking_number", "Booking No."], ["customer", "Customer"], ["broker", "Broker"], ["revenue", "Customer Freight"], ["cost", "Broker Cost"], ["profit", "Profit"]], rows };
  }, [reportType, filteredBookings, filteredPayments, customers, brokers, bookings, vehicles]);

  const totals = {
    bookings: filteredBookings.length,
    revenue: filteredBookings.reduce((total, booking) => total + amount(booking.customer_freight), 0),
    cost: filteredBookings.reduce((total, booking) => total + amount(booking.broker_freight), 0),
    receivables: filteredBookings.reduce((total, booking) => total + amount(booking.customer_balance), 0),
    payables: filteredBookings.reduce((total, booking) => total + amount(booking.broker_balance), 0),
  };
  const reportColumns = report.columns as [string, string][];
  const reportRows = report.rows as ReportRow[];
  const exportReport = () => {
    const csv = [reportColumns.map(([, label]) => csvCell(label)).join(","), ...reportRows.map((row) => reportColumns.map(([key]) => csvCell(row[key])).join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.title.toLowerCase().replaceAll(" ", "-")}-${localDateKey(today)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (bookingsLoading || paymentsLoading) return <Loader />;
  if (bookingsError || paymentsError) return <Alert color="red">Could not load the data needed for reports.</Alert>;

  return (
    <>
      <Group justify="space-between" mb="lg" wrap="wrap">
        <div><Title>Reports</Title><Text c="dimmed">Filter your saved TransLedger data, then export the report for Excel.</Text></div>
        <Button onClick={exportReport} disabled={!reportRows.length}>Export CSV (opens in Excel)</Button>
      </Group>

      <Card shadow="sm" padding="lg" withBorder mb="lg">
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
          <Select label="Report" data={[{ value: "bookings", label: "Booking report" }, { value: "receivables", label: "Customer outstanding" }, { value: "payables", label: "Broker payable" }, { value: "payments", label: "Payments and TDS" }, { value: "profit", label: "Profit report" }]} value={reportType} onChange={(value) => setReportType((value || "bookings") as ReportType)} />
          <DateInput label="From booking/payment date" value={startDate} onChange={setStartDate} clearable />
          <DateInput label="To booking/payment date" value={endDate} onChange={setEndDate} clearable />
          <Select label="Customer (optional)" data={customers.map((customer: any) => ({ value: customer.id, label: customer.customer_name }))} value={customerId} onChange={setCustomerId} clearable searchable />
          <Select label="Broker (optional)" data={brokers.map((broker: any) => ({ value: broker.id, label: broker.broker_name }))} value={brokerId} onChange={setBrokerId} clearable searchable />
        </SimpleGrid>
        <Button variant="subtle" mt="sm" px={0} onClick={() => { setStartDate(new Date(today.getFullYear(), today.getMonth(), 1)); setEndDate(today); setCustomerId(null); setBrokerId(null); }}>Reset to this month</Button>
      </Card>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} mb="lg">
        <Card withBorder><Text size="sm" c="dimmed">Bookings</Text><Text fw={700} size="xl">{totals.bookings}</Text></Card>
        <Card withBorder><Text size="sm" c="dimmed">Customer Revenue</Text><Text fw={700}>{money(totals.revenue)}</Text></Card>
        <Card withBorder><Text size="sm" c="dimmed">Broker Cost</Text><Text fw={700}>{money(totals.cost)}</Text></Card>
        <Card withBorder><Text size="sm" c="dimmed">Receivables</Text><Text fw={700} c={totals.receivables ? "orange" : "green"}>{money(totals.receivables)}</Text></Card>
        <Card withBorder><Text size="sm" c="dimmed">Profit</Text><Text fw={700} c="green">{money(totals.revenue - totals.cost)}</Text></Card>
      </SimpleGrid>

      <Card shadow="sm" padding="lg" withBorder>
        <Stack gap={2} mb="md"><Title order={3}>{report.title}</Title><Text size="sm" c="dimmed">{report.description}</Text></Stack>
        <Table.ScrollContainer minWidth={850}>
          <Table striped highlightOnHover>
            <Table.Thead><Table.Tr>{reportColumns.map(([key, label]) => <Table.Th key={key}>{label}</Table.Th>)}</Table.Tr></Table.Thead>
            <Table.Tbody>
              {reportRows.map((row, index) => <Table.Tr key={`${index}-${Object.values(row).join("-")}`}>{reportColumns.map(([key]) => <Table.Td key={key}>{row[key]}</Table.Td>)}</Table.Tr>)}
              {!reportRows.length && <Table.Tr><Table.Td colSpan={reportColumns.length}>No records match the selected filters.</Table.Td></Table.Tr>}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </>
  );
}
