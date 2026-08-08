import { Alert, Card, Group, Loader, Select, Stack, Table, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useBrokers } from "../../hooks/useBrokers";
import { useCustomers } from "../../hooks/useCustomers";
import { getBrokerLedger, getCustomerLedger } from "../../services/payment";

const money = (value: unknown) => `₹ ${(Number(value) || 0).toFixed(2)}`;

export default function Ledgers() {
  const [partyType, setPartyType] = useState<"customer" | "broker">("customer");
  const [partyId, setPartyId] = useState<string | null>(null);
  const { data: customers = [] } = useCustomers();
  const { data: brokers = [] } = useBrokers();
  const partyOptions = partyType === "customer"
    ? customers.map((customer: any) => ({ value: customer.id, label: `${customer.customer_name} (${customer.customer_code})` }))
    : brokers.map((broker: any) => ({ value: broker.id, label: `${broker.broker_name} (${broker.broker_code})` }));
  const ledgerQuery = useQuery({
    queryKey: ["ledger", partyType, partyId],
    queryFn: () => partyType === "customer" ? getCustomerLedger(partyId!) : getBrokerLedger(partyId!),
    enabled: Boolean(partyId),
  });

  return (
    <>
      <Title mb="lg">Customer & Broker Ledgers</Title>
      <Card shadow="sm" padding="lg" withBorder mb="lg">
        <Group align="end">
          <Select
            label="Ledger type"
            data={[{ value: "customer", label: "Customer — money they owe us" }, { value: "broker", label: "Broker — money we owe them" }]}
            value={partyType}
            onChange={(value) => { setPartyType((value || "customer") as "customer" | "broker"); setPartyId(null); }}
            w={300}
          />
          <Select
            label={partyType === "customer" ? "Customer" : "Broker"}
            placeholder={`Select ${partyType}`}
            searchable
            data={partyOptions}
            value={partyId}
            onChange={setPartyId}
            w={360}
          />
        </Group>
      </Card>

      {!partyId && <Alert color="blue">Select a customer or broker to see their full transaction history and pending balance.</Alert>}
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
          <Table striped highlightOnHover>
            <Table.Thead><Table.Tr><Table.Th>Date</Table.Th><Table.Th>Booking</Table.Th><Table.Th>Description</Table.Th><Table.Th>Debit</Table.Th><Table.Th>Credit</Table.Th><Table.Th>Balance</Table.Th></Table.Tr></Table.Thead>
            <Table.Tbody>
              {ledgerQuery.data.entries.map((entry, index) => <Table.Tr key={`${entry.payment_id || entry.booking_id || "entry"}-${index}`}>
                <Table.Td>{entry.entry_date}</Table.Td>
                <Table.Td>{entry.booking_number || "-"}</Table.Td>
                <Table.Td>{entry.description}</Table.Td>
                <Table.Td>{Number(entry.debit) ? money(entry.debit) : "-"}</Table.Td>
                <Table.Td>{Number(entry.credit) ? money(entry.credit) : "-"}</Table.Td>
                <Table.Td>{money(entry.running_balance)}</Table.Td>
              </Table.Tr>)}
              {!ledgerQuery.data.entries.length && <Table.Tr><Table.Td colSpan={6}>No bookings or payments for this account yet.</Table.Td></Table.Tr>}
            </Table.Tbody>
          </Table>
        </Card>
      </>}
    </>
  );
}
