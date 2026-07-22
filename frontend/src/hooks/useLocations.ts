import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/location";



export function useLocations() {


  const queryClient = useQueryClient();



  const locationsQuery = useQuery({

    queryKey: ["locations"],

    queryFn: getLocations,

  });




  const createLocationMutation = useMutation({

    mutationFn: createLocation,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: ["locations"],

      });

    },

  });





  const updateLocationMutation = useMutation({

    mutationFn: ({

      id,

      data,

    }: {

      id:string;

      data:any;

    }) => updateLocation(id,data),



    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["locations"],

      });

    },

  });






  const deleteLocationMutation = useMutation({

    mutationFn: deleteLocation,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["locations"],

      });

    },

  });





  return {


    ...locationsQuery,


    createLocation:
      createLocationMutation.mutate,


    updateLocation:
      updateLocationMutation.mutate,


    deleteLocation:
      deleteLocationMutation.mutate,


  };


}