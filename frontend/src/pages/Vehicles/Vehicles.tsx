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


import { useVehicles } from "../../hooks/useVehicles";

import AddVehicleModal from "./AddVehicleModal";



export default function Vehicles() {


  const {

    data,

    isLoading,

    isError,

    createVehicle,

    updateVehicle,

    deleteVehicle,

  } = useVehicles();



  const [opened,setOpened] =
    useState(false);



  const [selectedVehicle,setSelectedVehicle] =
    useState<any>(null);




  const handleAdd = () => {

    setSelectedVehicle(null);

    setOpened(true);

  };



  const handleEdit = (
    vehicle:any
  ) => {

    setSelectedVehicle(vehicle);

    setOpened(true);

  };



  const handleSubmit = async (
    values:any
  ) => {


    if(selectedVehicle){

      return updateVehicle({

        id:selectedVehicle.id,

        data:values,

      });


    }else{


      return createVehicle(values);


    }

  };



  if(isLoading){

    return <Loader />;

  }



  if(isError){

    return (

      <Alert color="red">

        Failed to load vehicles

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
          Vehicles
        </Title>


        <Button
          onClick={handleAdd}
        >

          + Add Vehicle

        </Button>


      </Group>




      <AddVehicleModal

        opened={opened}

        onClose={()=>{

          setOpened(false);

          setSelectedVehicle(null);

        }}

        vehicle={selectedVehicle}

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
                Vehicle Number
              </Table.Th>


              <Table.Th>
                Type
              </Table.Th>


              <Table.Th>
                Owner
              </Table.Th>


              <Table.Th>
                Mobile
              </Table.Th>


              <Table.Th>
                Capacity
              </Table.Th>


              <Table.Th>
                Actions
              </Table.Th>


            </Table.Tr>


          </Table.Thead>




          <Table.Tbody>


            {(data || []).map(
              (vehicle:any)=>(


              <Table.Tr
                key={vehicle.id}
              >


                <Table.Td>

                  {vehicle.vehicle_number}

                </Table.Td>


                <Table.Td>

                  {vehicle.vehicle_type}

                </Table.Td>


                <Table.Td>

                  {vehicle.owner_name || "-"}

                </Table.Td>


                <Table.Td>

                  {vehicle.mobile || "-"}

                </Table.Td>


                <Table.Td>

                  {vehicle.capacity || "-"}

                </Table.Td>




                <Table.Td>


                  <Group gap="xs">


                    <ActionIcon

                      color="blue"

                      variant="light"

                      onClick={()=>handleEdit(vehicle)}

                    >

                      <IconEdit size={16}/>

                    </ActionIcon>




                    <ActionIcon

                      color="red"

                      variant="light"

                      onClick={()=>deleteVehicle(vehicle.id)}

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
