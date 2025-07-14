import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { uploadExcel } from "./api";

export const useUploadExcel = () => {
    return useMutation({
        mutationFn: uploadExcel,
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.error(error);
        },
    });
};
