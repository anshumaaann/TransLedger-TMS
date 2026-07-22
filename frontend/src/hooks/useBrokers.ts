import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  getBrokers,
  createBroker,
  updateBroker,
  deleteBroker,
} from "../services/brokers";



export function useBrokers() {


  const queryClient = useQueryClient();



  const brokersQuery = useQuery({

    queryKey: ["brokers"],

    queryFn: getBrokers,

  });



  const createBrokerMutation = useMutation({

    mutationFn: createBroker,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: ["brokers"],

      });

    },

  });




  const updateBrokerMutation = useMutation({

    mutationFn: ({

      id,

      data,

    }: {

      id:string;

      data:any;

    }) => updateBroker(id,data),



    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["brokers"],

      });

    },

  });





  const deleteBrokerMutation = useMutation({

    mutationFn: deleteBroker,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["brokers"],

      });

    },

  });





  return {

    ...brokersQuery,


    createBroker:
      createBrokerMutation.mutate,


    updateBroker:
      updateBrokerMutation.mutate,


    deleteBroker:
      deleteBrokerMutation.mutate,


  };


}
