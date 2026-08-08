import api from "./api";


// ---------------------------------
// Booking Interface
// ---------------------------------

export interface Booking {

    id: string;

    booking_number: string;

    booking_date: string;


    customer_id: string;

    broker_id: string;

    vehicle_id: string;


    loading_site_id: string;

    unloading_site_id: string;


    bill_to?: string;


    weight: number;

    freight_type?: string;



    customer_freight: number;

    customer_advance: number;

    customer_balance: number;

    customer_paid_amount: number;

    tds_amount: number;

    customer_payment_status: "pending" | "partial" | "paid";



    broker_freight: number;

    broker_advance: number;

    broker_balance: number;

    broker_paid_amount: number;

    broker_payment_status: "pending" | "partial" | "paid";



    payment_method?: string;

    bill_submission_status?: string;


    payment_received_date?: string;

    payment_received_amount: number;



    profit: number;


    remarks?: string;


    created_at: string;

    updated_at: string;

}



// ---------------------------------
// Create Booking Payload
// ---------------------------------

export interface CreateBookingPayload {


    booking_date: string;


    customer_id: string;

    broker_id: string;

    vehicle_id: string;



    loading_site_id: string;

    unloading_site_id: string;



    bill_to?: string;



    weight: number;

    freight_type?: string;



    customer_freight: number;

    customer_advance?: number;

    tds_amount?: number;



    broker_freight: number;

    broker_advance?: number;



    payment_method?: string;


    bill_submission_status?: string;



    payment_received_date?: string;


    payment_received_amount?: number;



    remarks?: string;

}



// ---------------------------------
// Update Booking Payload
// ---------------------------------

export interface UpdateBookingPayload {


    booking_date?: string;


    customer_id?: string;

    broker_id?: string;

    vehicle_id?: string;



    loading_site_id?: string;

    unloading_site_id?: string;



    bill_to?: string;



    weight?: number;

    freight_type?: string;



    customer_freight?: number;

    customer_advance?: number;

    tds_amount?: number;



    broker_freight?: number;

    broker_advance?: number;



    payment_method?: string;


    bill_submission_status?: string;



    payment_received_date?: string;


    payment_received_amount?: number;



    remarks?: string;

}





// ---------------------------------
// Get All Bookings
// ---------------------------------

export const getBookings = async () => {


    const response = await api.get<Booking[]>(
        "/bookings/"
    );


    return response.data;

};





// ---------------------------------
// Get Booking By ID
// ---------------------------------

export const getBookingById = async (
    id: string
) => {


    const response = await api.get<Booking>(
        `/bookings/${id}`
    );


    return response.data;

};





// ---------------------------------
// Create Booking
// ---------------------------------

export const createBooking = async (
    data: CreateBookingPayload
) => {


    const response = await api.post<Booking>(

        "/bookings/",

        data

    );


    return response.data;

};





// ---------------------------------
// Update Booking
// ---------------------------------

export const updateBooking = async (

    id: string,

    data: UpdateBookingPayload

) => {


    const response = await api.put<Booking>(

        `/bookings/${id}`,

        data

    );


    return response.data;

};





// ---------------------------------
// Delete Booking
// ---------------------------------

export const deleteBooking = async (

    id: string

) => {


    const response = await api.delete(

        `/bookings/${id}`

    );


    return response.data;

};
