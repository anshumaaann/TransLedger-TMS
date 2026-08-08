import api from "./api";


export interface Site {

    id: string;

    site_name: string;

    site_type?: string;

    city?: string;

    state?: string;

    address?: string;

    is_active: boolean;

}



export const getSites = async () => {

    const response = await api.get<Site[]>(
        "/sites/"
    );

    return response.data;

};



export const createSite = async (
    data: any
) => {

    const response = await api.post(
        "/sites/",
        data
    );

    return response.data;

};