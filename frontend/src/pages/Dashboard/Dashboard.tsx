import {
  Card,
  SimpleGrid,
  Text,
  Title,
  Loader,
  Alert,
} from "@mantine/core";

import { useDashboard } from "../../hooks/useDashboard";


export default function Dashboard() {
  const { data, isLoading, isError, error } = useDashboard();


  if (isLoading) {
    return <Loader />;
  }


  if (isError) {
    return (
      <Alert color="red">
        {String(error)}
      </Alert>
    );
  }


  const cards = [
    {
      title: "Total Bookings",
      value: data.total_bookings,
    },
    {
      title: "Customer Revenue",
      value: `₹ ${data.total_customer_revenue}`,
    },
    {
      title: "Broker Cost",
      value: `₹ ${data.total_broker_cost}`,
    },
    {
      title: "Total Profit",
      value: `₹ ${data.total_profit}`,
    },
    {
      title: "Pending Receivables",
      value: `₹ ${data.pending_receivables}`,
    },
    {
      title: "Pending Payables",
      value: `₹ ${data.pending_payables}`,
    },
  ];


  return (
    <>
      <Title order={2} mb="lg">
        Dashboard
      </Title>


      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>

        {cards.map((card) => (
          <Card
            key={card.title}
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
          >
            <Text size="sm" c="dimmed">
              {card.title}
            </Text>

            <Text size="xl" fw={700}>
              {card.value}
            </Text>

          </Card>
        ))}

      </SimpleGrid>
    </>
  );
}