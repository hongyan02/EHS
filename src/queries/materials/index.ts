import { getApplication, getMaterial, createApplication } from "./api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useApplicationQuery = () => {
    return useQuery({
        queryKey: ["application"],
        queryFn: getApplication,
    });
};

export const useMaterialQuery = (data) => {
    return useQuery({
        queryKey: ["material", data],
        queryFn: () => getMaterial(data),
        staleTime: 0, // 数据立即过期
        gcTime: 0, // 不缓存数据
        refetchOnMount: true, // 组件挂载时重新获取
        refetchOnWindowFocus: true, // 窗口聚焦时重新获取
    });
};

export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["application"] });
        },
    });
};
