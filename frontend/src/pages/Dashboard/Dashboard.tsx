import { Alert, Card, Loader, SimpleGrid, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";

export default function Dashboard() {
  const { data, isLoading, isError, error } = useDashboard();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;
  if (isError) return <Alert color="red">{String(error)}</Alert>;

  const cards = [
    { title: "Total Bookings", value: data.total_bookings },
    { title: "Customer Revenue", value: `₹ ${data.total_customer_revenue}` },
    { title: "Broker Cost", value: `₹ ${data.total_broker_cost}` },
    { title: "Total Profit", value: `₹ ${data.total_profit}` },
    { title: "Pending Receivables", value: `₹ ${data.pending_receivables}`, ledgerType: "customer" },
    { title: "Pending Payables", value: `₹ ${data.pending_payables}`, ledgerType: "broker" },
  ];

  return (
    <>
      <Title order={2} mb="lg">Dashboard</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {cards.map((card) => {
          const isLedgerLink = Boolean(card.ledgerType);
          return <Card
            key={card.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            role={isLedgerLink ? "button" : undefined}
            tabIndex={isLedgerLink ? 0 : undefined}
            style={{ cursor: isLedgerLink ? "pointer" : "default" }}
            onClick={() => card.ledgerType && navigate(`/ledgers?type=${card.ledgerType}`)}
            onKeyDown={(event) => {
              if (card.ledgerType && (event.key === "Enter" || event.key === " ")) {
                event.preventDefault();
                navigate(`/ledgers?type=${card.ledgerType}`);
              }
            }}
          >
            <Text size="sm" c="dimmed">{card.title}</Text>
            <Text size="xl" fw={700}>{card.value}</Text>
            {isLedgerLink && <Text size="xs" c="blue" mt="xs">Click to open ledger details</Text>}
          </Card>;
        })}
      </SimpleGrid>
    </>
  );
}
