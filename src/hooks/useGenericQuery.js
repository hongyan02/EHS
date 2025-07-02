import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { handleApiError, handleApiSuccess } from "@/lib/utils/errorHandler";

/**
 * 创建通用的数据查询hooks
 * @param {Object} apiService - API服务对象
 * @param {string} queryKey - 查询键前缀
 * @returns {Object} hooks对象
 */
export const createGenericQueryHooks = (apiService, queryKey) => {
    /**
     * 列表查询hook
     * @param {Object} params - 查询参数
     * @param {Object} options - React Query选项
     * @returns {Object} 查询结果
     */
    const useListQuery = (params = {}, options = {}) => {
        return useQuery({
            queryKey: [queryKey, "list", params],
            queryFn: () => apiService.getList(params),
            ...options,
        });
    };

    /**
     * 详情查询hook
     * @param {string|number} id - 资源ID
     * @param {Object} options - React Query选项
     * @returns {Object} 查询结果
     */
    const useDetailQuery = (id, options = {}) => {
        return useQuery({
            queryKey: [queryKey, "detail", id],
            queryFn: () => apiService.getDetail(id),
            enabled: !!id,
            ...options,
        });
    };

    /**
     * 创建mutation hook
     * @param {Object} options - Mutation选项
     * @returns {Object} Mutation结果
     */
    const useCreateMutation = (options = {}) => {
        const queryClient = useQueryClient();
        const { message } = App.useApp();

        return useMutation({
            mutationFn: apiService.create,
            onSuccess: (data) => {
                handleApiSuccess("创建", true, message);
                queryClient.invalidateQueries({ queryKey: [queryKey] });
                options.onSuccess?.(data);
            },
            onError: (error) => {
                handleApiError(error, "创建", true, message);
                options.onError?.(error);
            },
            ...options,
        });
    };

    /**
     * 更新mutation hook
     * @param {Object} options - Mutation选项
     * @returns {Object} Mutation结果
     */
    const useUpdateMutation = (options = {}) => {
        const queryClient = useQueryClient();
        const { message } = App.useApp();

        return useMutation({
            mutationFn: ({ id, data }) => apiService.update(id, data),
            onSuccess: (data) => {
                handleApiSuccess("更新", true, message);
                queryClient.invalidateQueries({ queryKey: [queryKey] });
                options.onSuccess?.(data);
            },
            onError: (error) => {
                handleApiError(error, "更新", true, message);
                options.onError?.(error);
            },
            ...options,
        });
    };

    /**
     * 删除mutation hook
     * @param {Object} options - Mutation选项
     * @returns {Object} Mutation结果
     */
    const useDeleteMutation = (options = {}) => {
        const queryClient = useQueryClient();
        const { message } = App.useApp();

        return useMutation({
            mutationFn: apiService.delete,
            onSuccess: (data) => {
                handleApiSuccess("删除", true, message);
                queryClient.invalidateQueries({ queryKey: [queryKey] });
                options.onSuccess?.(data);
            },
            onError: (error) => {
                handleApiError(error, "删除", true, message);
                options.onError?.(error);
            },
            ...options,
        });
    };

    return {
        useListQuery,
        useDetailQuery,
        useCreateMutation,
        useUpdateMutation,
        useDeleteMutation,
    };
};
