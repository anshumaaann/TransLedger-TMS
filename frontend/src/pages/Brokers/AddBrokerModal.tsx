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
  broker?: any;
}


export default function AddBrokerModal({
  opened,
  onClose,
  onSubmit,
  broker,
}: Props) {


  const form = useForm({

    initialValues: {

      broker_code: "",
      broker_name: "",
      contact_person: "",
      mobile: "",
      email: "",
      address: "",

    },

  });



  useEffect(() => {

    if (broker) {

      form.setValues({

        broker_code:
          broker.broker_code || "",

        broker_name:
          broker.broker_name || "",

        contact_person:
          broker.contact_person || "",

        mobile:
          broker.mobile || "",

        email:
          broker.email || "",

        address:
          broker.address || "",

      });

    } else {

      form.reset();

    }

  }, [broker]);



  return (

    <Modal

      opened={opened}

      onClose={onClose}

      title={
        broker
          ? "Edit Broker"
          : "Add Broker"
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
              notifications.show({ color: "green", message: broker ? "Broker updated." : "Broker added." });
            } catch {
              notifications.show({ color: "red", message: "Could not save the broker. Check the required fields and email." });
            }
          })
        }

      >


        <Stack>


          <TextInput

            label="Broker Code"
            required

            {...form.getInputProps(
              "broker_code"
            )}

          />



          <TextInput

            label="Broker Name"
            required

            {...form.getInputProps(
              "broker_name"
            )}

          />



          <TextInput

            label="Contact Person"

            {...form.getInputProps(
              "contact_person"
            )}

          />



          <TextInput

            label="Mobile"

            {...form.getInputProps(
              "mobile"
            )}

          />



          <TextInput

            label="Email"

            {...form.getInputProps(
              "email"
            )}

          />



          <TextInput

            label="Address"

            {...form.getInputProps(
              "address"
            )}

          />



          <Button type="submit">

            {
              broker
                ? "Update Broker"
                : "Save Broker"
            }

          </Button>


        </Stack>


      </form>


    </Modal>

  );

}
