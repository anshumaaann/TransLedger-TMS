import {
  Modal,
  Button,
  TextInput,
  NumberInput,
  Select,
  Stack,
  Textarea,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";

import { useForm } from "@mantine/form";
import { useEffect } from "react";


interface Props {

  opened: boolean;

  onClose: () => void;

  onSubmit: (data:any)=>void;

  booking?:any;

  customers:any[];

  brokers:any[];

  vehicles:any[];

  locations:any[];

}



export default function AddBookingModal({

  opened,

  onClose,

  onSubmit,

  booking,

  customers,

  brokers,

  vehicles,

  locations,

}:Props){



const form = useForm({

initialValues:{


booking_date:new Date(),


customer_id:"",

broker_id:"",

vehicle_id:"",


loading_location_id:"",

unloading_location_id:"",


bill_to:"",


weight:0,

freight_type:"",


customer_freight:0,

customer_advance:0,


broker_freight:0,

broker_advance:0,


payment_method:"",

bill_submission_status:"",


payment_received_amount:0,


remarks:"",


}



});





useEffect(()=>{


if(booking){

form.setValues({

...booking,

booking_date:
new Date(booking.booking_date)

});


}

else{

form.reset();

}



},[booking]);







const customerOptions =
customers.map((item)=>({

value:item.id,

label:item.customer_name

}));



const brokerOptions =
brokers.map((item)=>({

value:item.id,

label:item.broker_name

}));



const vehicleOptions =
vehicles.map((item)=>({

value:item.id,

label:item.vehicle_number

}));



const locationOptions =
locations.map((item)=>({

value:item.id,

label:item.location_name

}));





return (

<Modal

opened={opened}

onClose={onClose}

title={
booking
?"Edit Booking"
:"Create Booking"
}

size="lg"

centered

>


<form

onSubmit={form.onSubmit((values)=>{


const payload={

...values,

booking_date:
values.booking_date
.toISOString()
.split("T")[0],


};


onSubmit(payload);


form.reset();

onClose();


})}

>


<Stack>



<DateInput

label="Booking Date"

{...form.getInputProps(
"booking_date"
)}

/>





<Select

label="Customer"

placeholder="Select Customer"

data={customerOptions}

{...form.getInputProps(
"customer_id"
)}

/>





<Select

label="Broker"

placeholder="Select Broker"

data={brokerOptions}

{...form.getInputProps(
"broker_id"
)}

/>





<Select

label="Vehicle"

placeholder="Select Vehicle"

data={vehicleOptions}

{...form.getInputProps(
"vehicle_id"
)}

/>





<Select

label="Loading Location"

placeholder="Select Loading"

data={locationOptions}

{...form.getInputProps(
"loading_location_id"
)}

/>





<Select

label="Unloading Location"

placeholder="Select Destination"

data={locationOptions}

{...form.getInputProps(
"unloading_location_id"
)}

/>





<TextInput

label="Bill To"

{...form.getInputProps(
"bill_to"
)}

/>





<NumberInput

label="Weight"

{...form.getInputProps(
"weight"
)}

/>





<TextInput

label="Freight Type"

placeholder="Full Load"

{...form.getInputProps(
"freight_type"
)}

/>





<NumberInput

label="Customer Freight"

{...form.getInputProps(
"customer_freight"
)}

/>





<NumberInput

label="Customer Advance"

{...form.getInputProps(
"customer_advance"
)}

/>





<NumberInput

label="Broker Freight"

{...form.getInputProps(
"broker_freight"
)}

/>





<NumberInput

label="Broker Advance"

{...form.getInputProps(
"broker_advance"
)}

/>





<Select

label="Payment Method"

data={[

"Cash",

"Bank Transfer",

"UPI",

"Cheque"

]}

{...form.getInputProps(
"payment_method"
)}

/>





<Select

label="Bill Submission Status"

data={[

"Pending",

"Submitted",

"Approved",

"Rejected"

]}

{...form.getInputProps(
"bill_submission_status"
)}

/>





<NumberInput

label="Payment Received"

{...form.getInputProps(
"payment_received_amount"
)}

/>





<Textarea

label="Remarks"

{...form.getInputProps(
"remarks"
)}

/>





<Button type="submit">

{

booking

?"Update Booking"

:"Save Booking"

}

</Button>



</Stack>


</form>


</Modal>

);

}