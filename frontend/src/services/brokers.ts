import api from "./api";


// Broker interface

export interface Broker {

    id:string;

    broker_name:string;

    phone?:string;

    email?:string;

    address?:string;

}



// Get all brokers

export const getBrokers = async()=>{


    const response = await api.get<Broker[]>(

        "/brokers/"

    );


    return response.data;

};




// Create broker

export const createBroker = async(

    data:any

)=>{


    const response = await api.post(

        "/brokers/",

        data

    );


    return response.data;

};




// Get broker by id

export const getBrokerById = async(

    id:string

)=>{


    const response = await api.get(

        `/brokers/${id}`

    );


    return response.data;

};




// Update broker

export const updateBroker = async(

    id:string,

    data:any

)=>{


    const response = await api.put(

        `/brokers/${id}`,

        data

    );


    return response.data;

};




// Delete broker

export const deleteBroker = async(

    id:string

)=>{


    const response = await api.delete(

        `/brokers/${id}`

    );


    return response.data;

};