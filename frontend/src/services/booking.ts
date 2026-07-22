import api from "./api";


// Get all bookings

export const getBookings = async () => {

    const response = await api.get(
        "/bookings/"
    );

    return response.data;

};




// Create booking

export const createBooking = async (
    data:any
) => {

    const response = await api.post(
        "/bookings/",
        data
    );

    return response.data;

};




// Update booking

export const updateBooking = async (
    id:string,
    data:any
) => {

    const response = await api.put(
        `/bookings/${id}`,
        data
    );

    return response.data;

};




// Delete booking

export const deleteBooking = async (
    id:string
) => {

    const response = await api.delete(
        `/bookings/${id}`
    );

    return response.data;

};