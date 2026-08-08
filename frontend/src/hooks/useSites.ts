import { useQuery } from "@tanstack/react-query";

import { getSites } from "../services/site";


export const useSites = () => {

    return useQuery({

        queryKey:["sites"],

        queryFn:getSites,

    });

};