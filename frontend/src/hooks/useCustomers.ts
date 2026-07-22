import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customer";


export function useCustomers() {

  const queryClient = useQueryClient();


  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });



  const createCustomerMutation = useMutation({

    mutationFn: createCustomer,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

    },

  });



  const updateCustomerMutation = useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) =>
      updateCustomer(id, data),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

    },

  });



  const deleteCustomerMutation = useMutation({

    mutationFn: deleteCustomer,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

    },

  });



  return {

    ...customersQuery,


    createCustomer:
      createCustomerMutation.mutate,


    updateCustomer:
      updateCustomerMutation.mutate,


    deleteCustomer:
      deleteCustomerMutation.mutate,


    isCreating:
      createCustomerMutation.isPending,


    isUpdating:
      updateCustomerMutation.isPending,


    isDeleting:
      deleteCustomerMutation.isPending,

  };

}