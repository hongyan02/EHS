import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { areaApi } from "@/lib/api/danger-source/areaApi";

/**
 * 危险区域列表查询hook
 * @param {Object} params - 查询参数
 * @param {Object} options - React Query选项
 * @returns {Object} 查询结果
 */
export const useAreaListQuery = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ["dangerArea", "list", params],
        queryFn: () => areaApi.getList(params),
        staleTime: 5 * 60 * 1000, // 5分钟内数据保持新鲜
        ...options,
    });
};

/**
 * 创建危险区域的mutation hook
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useCreateAreaMutation = (options = {}) => {
    const queryClient = useQueryClient();
    const { message } = App.useApp();

    return useMutation({
        mutationFn: (data) => {
            // 构造请求数据，确保包含必要字段
            const requestData = {
                areaName: data.areaName,
                notes: data.notes || "",
                areaLevel: 0, // 默认传0
            };
            return areaApi.create(requestData);
        },
        onSuccess: (data) => {
            message.success("危险区域创建成功");
            // 刷新区域列表
            queryClient.invalidateQueries({
                queryKey: ["dangerArea"],
                refetchType: "active",
            });
            options.onSuccess?.(data);
        },
        onError: (error) => {
            console.error("创建危险区域失败:", error);
            message.error("创建失败，请重试");
            options.onError?.(error);
        },
        ...options,
    });
};

/**
 * 更新危险区域的mutation hook
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useUpdateAreaMutation = (options = {}) => {
    const queryClient = useQueryClient();
    const { message } = App.useApp();

    return useMutation({
        mutationFn: ({ areaId, data }) => {
            // 构造请求数据，确保包含必要字段
            const requestData = {
                areaId: areaId,
                areaName: data.areaName,
                notes: data.notes || "",
                areaLevel: 0, // 默认传0
            };
            return areaApi.update(areaId, requestData);
        },
        onSuccess: (data) => {
            message.success("危险区域更新成功");
            // 刷新区域列表
            queryClient.invalidateQueries({
                queryKey: ["dangerArea"],
                refetchType: "active",
            });
            options.onSuccess?.(data);
        },
        onError: (error) => {
            console.error("更新危险区域失败:", error);
            message.error("更新失败，请重试");
            options.onError?.(error);
        },
        ...options,
    });
};

/**
 * 删除危险区域的mutation hook
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useDeleteAreaMutation = (options = {}) => {
    const queryClient = useQueryClient();
    const { message } = App.useApp();

    return useMutation({
        mutationFn: (areaId) => {
            return areaApi.delete(areaId);
        },
        onSuccess: (data) => {
            message.success("危险区域删除成功");
            // 刷新区域列表
            queryClient.invalidateQueries({
                queryKey: ["dangerArea"],
                refetchType: "active",
            });
            options.onSuccess?.(data);
        },
        onError: (error) => {
            console.error("删除危险区域失败:", error);
            message.error("删除失败，请重试");
            options.onError?.(error);
        },
        ...options,
    });
};

/**
 * 默认导出区域列表查询hook
 */
export default useAreaListQuery;
