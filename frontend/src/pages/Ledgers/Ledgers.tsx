import { Alert, Badge, Button, Card, Group, Loader, Select, SimpleGrid, Stack, Table, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBookings } from "../../hooks/useBookings";
import { useBrokers } from "../../hooks/useBrokers";
import { useCustomers } from "../../hooks/useCustomers";
import { getBrokerLedger, getCustomerLedger } from "../../services/payment";

const amount = (value: unknown) => Number(value) || 0;
const money = (value: unknown) => `\u20B9 ${amount(value).toFixed(2)}`;

const statusDetails = (totalFreight: number, pending: number) => {
  if (totalFreight === 0) return { label: "No bookings", color: "gray" };
  if (pending === 0) return { label: "Fully paid", color: "green" };
  if (pending === totalFreight) return { label: "Pending", color: "red" };
  return { label: "Partially paid", color: "orange" };
};

export default function Ledgers() {
  const [partyType, setPartyType] = useState<"customer" | "broker">("customer");
  const [partyId, setPartyId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: customers = [] } = useCustomers();
  const { data: brokers = [] } = useBrokers();
  const { data: bookings = [] } = useBookings();
  const requestedPartyType = searchParams.get("type") === "broker" ? "broker" : "customer";

  useEffect(() => {
    setPartyType(requestedPartyType);
    setPartyId(null);
  }, [requestedPartyType]);
  const partyOptions = partyType === "customer"
    ? customers.map((customer: any) => ({ value: customer.id, label: `${customer.customer_name} (${customer.customer_code})` }))
    : brokers.map((broker: any) => ({ value: broker.id, label: `${broker.broker_name} (${broker.broker_code})` }));

  const summaryRows = (partyType === "customer" ? customers : brokers).map((party: any) => {
    const relatedBookings = bookings.filter((booking) => partyType === "customer"
      ? booking.customer_id === party.id
      : booking.broker_id === party.id);
    const totalFreight = relatedBookings.reduce((total, booking) => total + amount(partyType === "customer" ? booking.customer_freight : booking.broker_freight), 0);
    const pending = relatedBookings.reduce((total, booking) => total + amount(partyType === "customer" ? booking.customer_balance : booking.broker_balance), 0);
    return {
      id: party.id,
      name: partyType === "customer" ? party.customer_name : party.broker_name,
      code: partyType === "customer" ? party.customer_code : party.broker_code,
      bookingCount: relatedBookings.length,
      totalFreight,
      settled: Math.max(0, totalFreight - pending),
      pending,
      status: statusDetails(totalFreight, pending),
    };
  }).sort((left, right) => right.pending - left.pending || left.name.localeCompare(right.name));

  const bookingDateById = new Map(bookings.map((booking) => [booking.id, booking.booking_date]));
  const ledgerQuery = useQuery({
    queryKey: ["ledger", partyType, partyId],
    queryFn: () => partyType === "customer" ? getCustomerLedger(partyId!) : getBrokerLedger(partyId!),
    enabled: Boolean(partyId),
  });

  return (
    <>
      <Title mb="lg">Customer & Broker Ledgers</Title>
      <Card shadow="sm" padding="lg" withBorder mb="lg">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Select
            label="Ledger type"
            data={[{ value: "customer", label: "Customer — money they owe us" }, { value: "broker", label: "Broker — money we owe them" }]}
            value={partyType}
            onChange={(value) => {
              const nextType = (value || "customer") as "customer" | "broker";
              setSearchParams({ type: nextType });
            }}
          />
          <Select
            label={partyType === "customer" ? "Customer" : "Broker"}
            placeholder={`Select ${partyType}`}
            searchable
            data={partyOptions}
            value={partyId}
            onChange={setPartyId}
          />
        </SimpleGrid>
      </Card>

      <Card shadow="sm" padding="lg" withBorder mb="lg">
        <Group justify="space-between" mb="sm">
          <Title order={3}>{partyType === "customer" ? "Customer payment summary" : "Broker payment summary"}</Title>
          <Text size="sm" c="dimmed">Click “View ledger” for the full transaction history.</Text>
        </Group>
        <Table.ScrollContainer minWidth={760}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{partyType === "customer" ? "Customer" : "Broker"}</Table.Th>
              <Table.Th>Bookings</Table.Th>
              <Table.Th>Total Freight</Table.Th>
              <Table.Th>Settled</Table.Th>
              <Table.Th>Pending</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {summaryRows.map((row) => <Table.Tr key={row.id}>
              <Table.Td><Text fw={500}>{row.name}</Text><Text size="xs" c="dimmed">{row.code}</Text></Table.Td>
              <Table.Td>{row.bookingCount}</Table.Td>
              <Table.Td>{money(row.totalFreight)}</Table.Td>
              <Table.Td>{money(row.settled)}</Table.Td>
              <Table.Td c={row.pending === 0 ? "green" : "orange"}>{money(row.pending)}</Table.Td>
              <Table.Td><Badge color={row.status.color} variant="light">{row.status.label}</Badge></Table.Td>
              <Table.Td><Button size="xs" variant="light" onClick={() => setPartyId(row.id)}>View ledger</Button></Table.Td>
            </Table.Tr>)}
            {!summaryRows.length && <Table.Tr><Table.Td colSpan={7}>No {partyType}s have been added yet.</Table.Td></Table.Tr>}
          </Table.Tbody>
        </Table>
        </Table.ScrollContainer>
      </Card>

      {!partyId && <Alert color="blue">Select a customer or broker above, or click “View ledger” in the payment summary.</Alert>}
      {ledgerQuery.isLoading && <Loader />}
      {ledgerQuery.isError && <Alert color="red">Could not load this ledger.</Alert>}
      {ledgerQuery.data && <>
        <Card shadow="sm" padding="lg" withBorder mb="lg">
          <Stack gap={4}>
            <Text fw={600}>{ledgerQuery.data.party_name}</Text>
            <Text size="xl" c={ledgerQuery.data.outstanding_amount === 0 ? "green" : "orange"}>
              {partyType === "customer" ? "Amount pending from customer: " : "Amount pending to broker: "}
              {money(ledgerQuery.data.outstanding_amount)}
            </Text>
          </Stack>
        </Card>
        <Card shadow="sm" padding="lg" withBorder>
          <Table.ScrollContainer minWidth={850}>
          <Table striped highlightOnHover>
            <Table.Thead><Table.Tr><Table.Th>Transaction Date</Table.Th><Table.Th>Booking Date</Table.Th><Table.Th>Booking</Table.Th><Table.Th>Description</Table.Th><Table.Th>Debit</Table.Th><Table.Th>Credit</Table.Th><Table.Th>Balance</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {ledgerQuery.data.entries.map((entry, index) => <Table.Tr key={`${entry.payment_id || entry.booking_id || "entry"}-${index}`}>
                <Table.Td>{entry.entry_date}</Table.Td>
                <Table.Td>{entry.booking_id ? bookingDateById.get(entry.booking_id) || "-" : "-"}</Table.Td>
                <Table.Td>{entry.booking_number || "-"}</Table.Td>
                <Table.Td>{entry.description}</Table.Td>
                <Table.Td>{Number(entry.debit) ? money(entry.debit) : "-"}</Table.Td>
                <Table.Td>{Number(entry.credit) ? money(entry.credit) : "-"}</Table.Td>
                <Table.Td>{money(entry.running_balance)}</Table.Td>
              </Table.Tr>)}
              {!ledgerQuery.data.entries.length && <Table.Tr><Table.Td colSpan={7}>No bookings or payments for this account yet.</Table.Td></Table.Tr>}
            </Table.Tbody>
          </Table>
          </Table.ScrollContainer>
        </Card>
      </>}
    </>
  );
}
