import { getMaterials } from "./api";
import {useQuery} from "@tanstack/react-query";

export const useMaterialsQuery = () => {
    return useQuery({
        queryKey: ["materials"],
        queryFn: getMaterials,
    });
};