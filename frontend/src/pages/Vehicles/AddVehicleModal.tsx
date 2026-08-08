import {
  Modal,
  Button,
  TextInput,
  Stack,
} from "@mantine/core";

import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { notifications } from "@mantine/notifications";


interface Props {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<unknown>;
  vehicle?: any;
}


export default function AddVehicleModal({
  opened,
  onClose,
  onSubmit,
  vehicle,
}: Props) {


  const form = useForm({

    initialValues: {

      vehicle_number: "",
      vehicle_type: "",
      owner_name: "",
      mobile: "",
      capacity: "",

    },

  });



  useEffect(() => {

    if (vehicle) {

      form.setValues({

        vehicle_number:
          vehicle.vehicle_number || "",

        vehicle_type:
          vehicle.vehicle_type || "",

        owner_name:
          vehicle.owner_name || "",

        mobile:
          vehicle.mobile || "",

        capacity:
          vehicle.capacity || "",

      });

    } else {

      form.reset();

    }

  }, [vehicle]);



  return (

    <Modal

      opened={opened}

      onClose={onClose}

      title={
        vehicle
          ? "Edit Vehicle"
          : "Add Vehicle"
      }

      centered

    >


      <form

        onSubmit={
          form.onSubmit(async (values)=>{
            try {
              await onSubmit(values);
              form.reset();
              onClose();
              notifications.show({ color: "green", message: vehicle ? "Vehicle updated." : "Vehicle added." });
            } catch {
              notifications.show({ color: "red", message: "Could not save the vehicle. Check the required fields." });
            }
          })
        }

      >


        <Stack>


          <TextInput

            label="Vehicle Number"
            required

            {...form.getInputProps(
              "vehicle_number"
            )}

          />


          <TextInput

            label="Vehicle Type"
            required

            placeholder="Truck / Container"

            {...form.getInputProps(
              "vehicle_type"
            )}

          />


          <TextInput

            label="Owner Name"

            {...form.getInputProps(
              "owner_name"
            )}

          />


          <TextInput

            label="Mobile"

            {...form.getInputProps(
              "mobile"
            )}

          />


          <TextInput

            label="Capacity"

            placeholder="10 Ton"

            {...form.getInputProps(
              "capacity"
            )}

          />


          <Button type="submit">

            {
              vehicle
                ? "Update Vehicle"
                : "Save Vehicle"
            }

          </Button>


        </Stack>


      </form>


    </Modal>

  );
}
