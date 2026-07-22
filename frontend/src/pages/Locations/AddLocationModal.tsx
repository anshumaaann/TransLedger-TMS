import {
  Modal,
  Button,
  TextInput,
  Stack,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useEffect } from "react";


interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  location?: any;
}


export default function AddLocationModal({
  opened,
  onClose,
  onSubmit,
  location,
}: Props) {


  const form = useForm({

    initialValues: {

      location_name: "",
      state: "",

    },

  });



  useEffect(() => {

    if (location) {

      form.setValues({

        location_name:
          location.location_name || "",

        state:
          location.state || "",

      });

    } else {

      form.reset();

    }

  }, [location]);



  return (

    <Modal

      opened={opened}

      onClose={onClose}

      title={
        location
          ? "Edit Location"
          : "Add Location"
      }

      centered

    >


      <form

        onSubmit={
          form.onSubmit((values)=>{

            onSubmit(values);

            form.reset();

            onClose();

          })
        }

      >


        <Stack>


          <TextInput

            label="Location Name"

            placeholder="Mumbai"

            {...form.getInputProps(
              "location_name"
            )}

          />



          <TextInput

            label="State"

            placeholder="Maharashtra"

            {...form.getInputProps(
              "state"
            )}

          />



          <Button type="submit">

            {
              location
                ? "Update Location"
                : "Save Location"
            }

          </Button>


        </Stack>


      </form>


    </Modal>

  );

}