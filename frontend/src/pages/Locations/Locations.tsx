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


import { useLocations } from "../../hooks/useLocations";

import AddLocationModal from "./AddLocationModal";



export default function Locations() {


  const {

    data,

    isLoading,

    isError,

    createLocation,

    updateLocation,

    deleteLocation,

  } = useLocations();




  const [opened,setOpened] =
    useState(false);



  const [selectedLocation,setSelectedLocation] =
    useState<any>(null);





  const handleAdd = () => {

    setSelectedLocation(null);

    setOpened(true);

  };





  const handleEdit = (
    location:any
  ) => {

    setSelectedLocation(location);

    setOpened(true);

  };





  const handleSubmit = (
    values:any
  ) => {


    if(selectedLocation){


      updateLocation({

        id:selectedLocation.id,

        data:values,

      });


    } else {


      createLocation(values);


    }

  };





  if(isLoading){

    return <Loader />;

  }





  if(isError){

    return (

      <Alert color="red">

        Failed to load locations

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
          Locations
        </Title>


        <Button
          onClick={handleAdd}
        >

          + Add Location

        </Button>


      </Group>





      <AddLocationModal

        opened={opened}

        onClose={()=>{

          setOpened(false);

          setSelectedLocation(null);

        }}

        location={selectedLocation}

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
                Location
              </Table.Th>


              <Table.Th>
                State
              </Table.Th>


              <Table.Th>
                Status
              </Table.Th>


              <Table.Th>
                Actions
              </Table.Th>


            </Table.Tr>


          </Table.Thead>





          <Table.Tbody>


            {(data || []).map(

              (location:any)=>(


              <Table.Tr
                key={location.id}
              >



                <Table.Td>

                  {location.location_name}

                </Table.Td>




                <Table.Td>

                  {location.state || "-"}

                </Table.Td>




                <Table.Td>

                  {location.is_active
                    ? "Active"
                    : "Inactive"
                  }

                </Table.Td>





                <Table.Td>


                  <Group gap="xs">


                    <ActionIcon

                      color="blue"

                      variant="light"

                      onClick={() =>
                        handleEdit(location)
                      }

                    >

                      <IconEdit size={16}/>

                    </ActionIcon>





                    <ActionIcon

                      color="red"

                      variant="light"

                      onClick={() =>
                        deleteLocation(
                          location.id
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