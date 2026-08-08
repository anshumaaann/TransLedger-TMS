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


import { useBrokers } from "../../hooks/useBrokers";

import AddBrokerModal from "./AddBrokerModal";



export default function Brokers() {


  const {

    data,

    isLoading,

    isError,

    createBroker,

    updateBroker,

    deleteBroker,

  } = useBrokers();




  const [opened,setOpened] =
    useState(false);



  const [selectedBroker,setSelectedBroker] =
    useState<any>(null);





  const handleAdd = () => {

    setSelectedBroker(null);

    setOpened(true);

  };




  const handleEdit = (
    broker:any
  ) => {

    setSelectedBroker(broker);

    setOpened(true);

  };





  const handleSubmit = async (
    values:any
  ) => {


    if(selectedBroker){


      return updateBroker({

        id:selectedBroker.id,

        data:values,

      });



    } else {


      return createBroker(values);


    }


  };




  if(isLoading){

    return <Loader />;

  }




  if(isError){

    return (

      <Alert color="red">

        Failed to load brokers

      </Alert>

    );

  }





  return (

    <>


      <Group
        justify="space-between"
        mb="lg"
      >

        <Title>
          Brokers
        </Title>


        <Button
          onClick={handleAdd}
        >

          + Add Broker

        </Button>


      </Group>





      <AddBrokerModal

        opened={opened}

        onClose={()=>{

          setOpened(false);

          setSelectedBroker(null);

        }}

        broker={selectedBroker}

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
                Contact Person
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

              (broker:any)=>(


              <Table.Tr
                key={broker.id}
              >



                <Table.Td>

                  {broker.broker_code}

                </Table.Td>



                <Table.Td>

                  {broker.broker_name}

                </Table.Td>




                <Table.Td>

                  {broker.contact_person || "-"}

                </Table.Td>




                <Table.Td>

                  {broker.mobile || "-"}

                </Table.Td>




                <Table.Td>

                  {broker.email || "-"}

                </Table.Td>





                <Table.Td>


                  <Group gap="xs">


                    <ActionIcon

                      color="blue"

                      variant="light"

                      onClick={() =>
                        handleEdit(broker)
                      }

                    >

                      <IconEdit size={16}/>

                    </ActionIcon>





                    <ActionIcon

                      color="red"

                      variant="light"

                      onClick={() =>
                        deleteBroker(
                          broker.id
                        )
                      }

                    >

                      <IconTrash size={16}/>

                    </ActionIcon>


                  </Group>


                </Table.Td>




              </Table.Tr>


            ))}



          </Table.Tbody>




        </Table>



      </Card>



    </>

  );

}
