import api from "./api";


export const getCustomers = async () => {
  const response = await api.get("/customers/");
  return response.data;
};


export const createCustomer = async (data: any) => {
  const response = await api.post(
    "/customers/",
    data
  );

  return response.data;
};


export const updateCustomer = async (
  id: string,
  data: any
) => {
  const response = await api.put(
    `/customers/${id}`,
    data
  );

  return response.data;
};


export const deleteCustomer = async (
  id: string
) => {
  const response = await api.delete(
    `/customers/${id}`
  );

  return response.data;
};