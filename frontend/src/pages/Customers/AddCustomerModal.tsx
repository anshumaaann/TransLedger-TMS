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
  customer?: any;
}


export default function AddCustomerModal({
  opened,
  onClose,
  onSubmit,
  customer,
}: Props) {


  const form = useForm({
    initialValues: {
      customer_code: "",
      customer_name: "",
      short_name: "",
      gst_number: "",
      contact_person: "",
      mobile: "",
      email: "",
      address: "",
    },
  });



  // Fill form when editing
  useEffect(() => {

    if (customer) {

      form.setValues({
        customer_code:
          customer.customer_code || "",

        customer_name:
          customer.customer_name || "",

        short_name:
          customer.short_name || "",

        gst_number:
          customer.gst_number || "",

        contact_person:
          customer.contact_person || "",

        mobile:
          customer.mobile || "",

        email:
          customer.email || "",

        address:
          customer.address || "",
      });

    } else {

      form.reset();

    }

  }, [customer]);



  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        customer
          ? "Edit Customer"
          : "Add Customer"
      }
      centered
    >


      <form
        onSubmit={
          form.onSubmit(async (values) => {
            try {
              await onSubmit(values);
              form.reset();
              onClose();
              notifications.show({ color: "green", message: customer ? "Customer updated." : "Customer added." });
            } catch {
              notifications.show({ color: "red", message: "Could not save the customer. Check the required fields and email." });
            }
          })
        }
      >


        <Stack>


          <TextInput
            label="Customer Code"
            required
            {...form.getInputProps(
              "customer_code"
            )}
          />


          <TextInput
            label="Customer Name"
            required
            {...form.getInputProps(
              "customer_name"
            )}
          />


          <TextInput
            label="Short Name"
            required
            {...form.getInputProps(
              "short_name"
            )}
          />


          <TextInput
            label="GST Number"
            {...form.getInputProps(
              "gst_number"
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
              customer
                ? "Update Customer"
                : "Save Customer"
            }
          </Button>


        </Stack>


      </form>


    </Modal>
  );
}
