import api from "./api";


export const getLocations = async () => {

  const response = await api.get("/locations/");

  return response.data;

};



export const createLocation = async (
  data: any
) => {

  const response = await api.post(
    "/locations/",
    data
  );

  return response.data;

};



export const updateLocation = async (
  id: string,
  data: any
) => {

  const response = await api.put(
    `/locations/${id}`,
    data
  );

  return response.data;

};



export const deleteLocation = async (
  id: string
) => {

  const response = await api.delete(
    `/locations/${id}`
  );

  return response.data;

};