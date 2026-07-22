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

import AddBookingModal from "./AddBookingModal";

import { useBookings } from "../../hooks/useBookings";

import { useCustomers } from "../../hooks/useCustomers";
import { useBrokers } from "../../hooks/useBrokers";
import { useVehicles } from "../../hooks/useVehicles";
import { useLocations } from "../../hooks/useLocations";


export default function Bookings() {


  const {
    data: bookings,
    isLoading,
    isError,
    createBooking,
    updateBooking,
    deleteBooking,
  } = useBookings();



  const {
    data: customers = [],
  } = useCustomers();



  const {
    data: brokers = [],
  } = useBrokers();



  const {
    data: vehicles = [],
  } = useVehicles();



  const {
    data: locations = [],
  } = useLocations();




  const [opened, setOpened] = useState(false);


  const [
    selectedBooking,
    setSelectedBooking
  ] = useState<any>(null);




  const handleAdd = () => {

    setSelectedBooking(null);

    setOpened(true);

  };




  const handleEdit = (booking:any) => {

    setSelectedBooking(booking);

    setOpened(true);

  };




  const handleSubmit = (data:any) => {


    if(selectedBooking){


      updateBooking({

        id:selectedBooking.id,

        data:data,

      });


    }
    else{


      createBooking(data);


    }

  };




  if(isLoading){

    return <Loader />;

  }



  if(isError){

    return (

      <Alert color="red">

        Failed to load bookings

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
          Bookings
        </Title>


        <Button
          onClick={handleAdd}
        >

          + Create Booking

        </Button>


      </Group>





      <AddBookingModal

        opened={opened}

        onClose={() => {

          setOpened(false);

          setSelectedBooking(null);

        }}


        booking={selectedBooking}


        onSubmit={handleSubmit}


        customers={customers}


        brokers={brokers}


        vehicles={vehicles}


        locations={locations}

      />






      <Card
        shadow="sm"
        padding="lg"
        withBorder
      >


        <Table
          striped
          highlightOnHover
        >


          <Table.Thead>

            <Table.Tr>


              <Table.Th>
                Booking No
              </Table.Th>


              <Table.Th>
                Customer
              </Table.Th>


              <Table.Th>
                Vehicle
              </Table.Th>


              <Table.Th>
                Freight
              </Table.Th>


              <Table.Th>
                Profit
              </Table.Th>


              <Table.Th>
                Actions
              </Table.Th>


            </Table.Tr>


          </Table.Thead>





          <Table.Tbody>


            {
              (bookings || []).map(
                (booking:any)=>(


                  <Table.Tr
                    key={booking.id}
                  >


                    <Table.Td>

                      {booking.booking_number}

                    </Table.Td>




                    <Table.Td>

                      {
                        customers.find(
                          (c:any)=>
                          c.id === booking.customer_id
                        )?.customer_name
                        ||
                        "-"
                      }

                    </Table.Td>




                    <Table.Td>


                      {
                        vehicles.find(
                          (v:any)=>
                          v.id === booking.vehicle_id
                        )?.vehicle_number
                        ||
                        "-"
                      }


                    </Table.Td>





                    <Table.Td>

                      ₹ {booking.customer_freight}

                    </Table.Td>





                    <Table.Td>

                      ₹ {booking.profit}

                    </Table.Td>





                    <Table.Td>


                      <Group gap="xs">


                        <ActionIcon

                          color="blue"

                          variant="light"

                          onClick={() =>
                            handleEdit(booking)
                          }

                        >

                          <IconEdit size={16}/>

                        </ActionIcon>





                        <ActionIcon

                          color="red"

                          variant="light"

                          onClick={() =>
                            deleteBooking(
                              booking.id
                            )
                          }

                        >

                          <IconTrash size={16}/>

                        </ActionIcon>



                      </Group>


                    </Table.Td>



                  </Table.Tr>


                )

              )
            }



          </Table.Tbody>


        </Table>


      </Card>


    </>

  );

}