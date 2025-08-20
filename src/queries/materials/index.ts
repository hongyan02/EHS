import {
    getApplication,
    getMaterial,
    createApplication,
    deleteApplication,
    getMaterialByApplication,
    createMaterialByApplication,
    getMaterialName,
} from "./api";
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

export const useDeleteApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["application"] });
        },
    });
};

export const useGetMaterialByApplication = (applicationId) => {
    return useQuery({
        queryKey: ["materialByApplication", applicationId],
        queryFn: () => {
            if (!applicationId) return Promise.resolve({ data: [] });
            const formData = new URLSearchParams();
            formData.append("id", applicationId.toString());
            return getMaterialByApplication(formData);
        },
        enabled: !!applicationId,
    });
};

export const useCreateMaterialByApplication = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMaterialByApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["materialByApplication"] });
        },
    });
};

export const useGetMaterialName = () => {
    return useQuery({
        queryKey: ["materialName"],
        queryFn: getMaterialName,
    });
};
