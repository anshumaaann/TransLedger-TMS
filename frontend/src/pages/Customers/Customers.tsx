import {
  Table,
  Title,
  Loader,
  Alert,
  Card,
  Button,
  Group,
  ActionIcon,
} from "@mantine/core";

import {
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { useState } from "react";

import { useCustomers } from "../../hooks/useCustomers";

import AddCustomerModal from "./AddCustomerModal";


export default function Customers() {

  const {
    data,
    isLoading,
    isError,
    createCustomer,
    deleteCustomer,
    updateCustomer,
  } = useCustomers();


  const [opened, setOpened] = useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<any>(null);



  const handleAdd = () => {
    setSelectedCustomer(null);
    setOpened(true);
  };


  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setOpened(true);
  };


  const handleSubmit = (values: any) => {

    if (selectedCustomer) {

      updateCustomer({
        id: selectedCustomer.id,
        data: values,
      });

    } else {

      createCustomer(values);

    }

  };



  if (isLoading) {
    return <Loader />;
  }


  if (isError) {
    return (
      <Alert color="red">
        Failed to load customers
      </Alert>
    );
  }



  return (
    <>

      <Group justify="space-between" mb="lg">

        <Title>
          Customers
        </Title>


        <Button onClick={handleAdd}>
          + Add Customer
        </Button>

      </Group>



      <AddCustomerModal
        opened={opened}
        onClose={() => {
          setOpened(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSubmit={handleSubmit}
      />



      <Card
        shadow="sm"
        padding="lg"
        withBorder
      >

        <Table striped highlightOnHover>

          <Table.Thead>

            <Table.Tr>

              <Table.Th>
                Code
              </Table.Th>

              <Table.Th>
                Name
              </Table.Th>

              <Table.Th>
                Mobile
              </Table.Th>

              <Table.Th>
                Email
              </Table.Th>

              <Table.Th>
                Actions
              </Table.Th>

            </Table.Tr>

          </Table.Thead>



          <Table.Tbody>

            {(data || []).map(
              (customer: any) => (

                <Table.Tr key={customer.id}>

                  <Table.Td>
                    {customer.customer_code}
                  </Table.Td>


                  <Table.Td>
                    {customer.customer_name}
                  </Table.Td>


                  <Table.Td>
                    {customer.mobile || "-"}
                  </Table.Td>


                  <Table.Td>
                    {customer.email || "-"}
                  </Table.Td>


                  <Table.Td>

                    <Group gap="xs">

                      <ActionIcon
                        color="blue"
                        variant="light"
                        onClick={() =>
                          handleEdit(customer)
                        }
                      >
                        <IconEdit size={16}/>
                      </ActionIcon>


                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() =>
                          deleteCustomer(
                            customer.id
                          )
                        }
                      >
                        <IconTrash size={16}/>
                      </ActionIcon>

                    </Group>

                  </Table.Td>


                </Table.Tr>

              )
            )}

          </Table.Tbody>


        </Table>


      </Card>


    </>
  );
}