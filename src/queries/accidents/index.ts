import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAccidents, createAccident, deleteAccident, updateAccident } from "./api"


export const useAccidents = () => {
    return useQuery({
        queryKey: ["accidents"],
        queryFn: getAccidents,
    })
}

export const useCreateAccident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAccident,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accidents"] });
        },
    })
}


export const useDeleteAccident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAccident,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accidents"] });
        },
    })
}

export const useUpdateAccident = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAccident,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accidents"] });
        },
    })
}