import { useQuery } from "@tanstack/react-query"
import { getAccidents } from "./api"

export const useAccidents = () => {
    return useQuery({
        queryKey: ["accidents"],
        queryFn: getAccidents,
    })
}