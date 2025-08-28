import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHazards, updateHazards, deleteHazards } from "./api";

export const useGetHazards = () => {
    return useQuery({
        queryKey: ["hazards"],
        queryFn: getHazards,
    });
};

export const useUpdateHazardMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateHazards,
        onSuccess: () => {
            // 成功后自动刷新值班表列表
            queryClient.invalidateQueries({ queryKey: ["hazards"] });
        },
        onError: (error) => {
            console.error("创建失败:", error);
        },
    });
};

export const useDeleteHazardsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteHazards,
        onSuccess: () => {
            // 删除成功后自动刷新列表
            queryClient.invalidateQueries({ queryKey: ["hazards"] });
        },
        onError: (error) => {
            console.error("删除失败:", error);
        },
    });
};
