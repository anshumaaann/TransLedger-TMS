import api from "./api";


export interface Customer {

    id:string;

    customer_name:string;

    company_name?:string;

    phone?:string;

    email?:string;

    address?:string;

    gst_number?:string;

}




export const getCustomers = async()=>{


    const response = await api.get<Customer[]>(

        "/customers/"

    );


    return response.data;

};





export const createCustomer = async(data:any)=>{


    console.log(
        "Customer API Payload:",
        data
    );


    const response = await api.post(

        "/customers/",

        data

    );


    console.log(
        "Customer API Response:",
        response.data
    );


    return response.data;

};





export const updateCustomer = async(

    id:string,

    data:any

)=>{


    const response = await api.put(

        `/customers/${id}`,

        data

    );


    return response.data;

};





export const deleteCustomer = async(

    id:string

)=>{


    const response = await api.delete(

        `/customers/${id}`

    );


    return response.data;

};