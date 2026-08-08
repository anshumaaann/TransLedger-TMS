import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../services/booking.ts";



export function useBookings() {


  const queryClient = useQueryClient();



  const bookingsQuery = useQuery({

    queryKey: ["bookings"],

    queryFn: getBookings,

  });





  const createBookingMutation = useMutation({

    mutationFn: createBooking,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey: ["bookings"],

      });

    },

  });






  const updateBookingMutation = useMutation({

    mutationFn: ({
      id,
      data,
    }: {
      id:string;
      data:any;
    }) => updateBooking(id,data),



    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["bookings"],

      });

    },

  });






  const deleteBookingMutation = useMutation({

    mutationFn: deleteBooking,


    onSuccess: () => {

      queryClient.invalidateQueries({

        queryKey:["bookings"],

      });

    },

  });






  return {

    ...bookingsQuery,


    createBooking:
      createBookingMutation.mutateAsync,


    updateBooking:
      updateBookingMutation.mutateAsync,


    deleteBooking:
      deleteBookingMutation.mutate,

  };

}
