import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../services/vehicle";



export function useVehicles() {

  const queryClient = useQueryClient();



  const vehiclesQuery = useQuery({
    queryKey: ["vehicles"],
    queryFn: getVehicles,
  });



  const createVehicleMutation = useMutation({

    mutationFn: createVehicle,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

    },

  });



  const updateVehicleMutation = useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: any;
    }) =>
      updateVehicle(id, data),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

    },

  });



  const deleteVehicleMutation = useMutation({

    mutationFn: deleteVehicle,


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["vehicles"],
      });

    },

  });



  return {

    ...vehiclesQuery,


    createVehicle:
      createVehicleMutation.mutate,


    updateVehicle:
      updateVehicleMutation.mutate,


    deleteVehicle:
      deleteVehicleMutation.mutate,

  };

}