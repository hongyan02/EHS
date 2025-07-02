import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createGenericQueryHooks } from "./useGenericQuery";
import { riskSourceApi } from "@/lib/api/danger-source/riskSourceApi";

// 创建风险源查询钩子
const riskSourceHooks = createGenericQueryHooks(riskSourceApi, "riskSource");

// 导出列表查询钩子
export const { useListQuery: useRiskSourceListQuery } = riskSourceHooks;

/**
 * 关键字搜索钩子
 * @param {string} keyword - 搜索关键字
 * @param {Object} options - React Query选项
 * @returns {Object} 查询结果
 */
export const useRiskSourceSearchQuery = (keyword, options = {}) => {
    return useQuery({
        queryKey: ["riskSource", "search", keyword],
        queryFn: () => riskSourceApi.searchByKeyword(keyword),
        enabled: !!keyword?.trim(),
        ...options,
    });
};

/**
 * 创建风险源钩子
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useCreateRiskSource = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => {
            // 只保留需要的字段
            const filteredData = {
                product: data.product,
                department: data.department,
                area: data.area,
                workPosition: data.workPosition,
                workActivity: data.workActivity,
                dangerSourceDescription: data.dangerSourceDescription,
                possibleAccident: data.possibleAccident,
                accidentCase: data.accidentCase,
                occupationalDisease: data.occupationalDisease,
                l: data.l,
                s: data.s,
                isMajorRisk: data.isMajorRisk,
                currentControlMeasures: data.currentControlMeasures,
            };
            return riskSourceApi.create(filteredData);
        },
        onSuccess: () => {
            // 失效所有相关的查询缓存并立即重新获取
            queryClient.invalidateQueries({
                queryKey: ["riskSource"],
                refetchType: "active",
            });
        },
        ...options,
    });
};

/**
 * 更新风险源钩子
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useUpdateRiskSource = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ riskSourceId, data }) => {
            // 只保留需要的字段
            const filteredData = {
                product: data.product,
                department: data.department,
                area: data.area,
                workPosition: data.workPosition,
                workActivity: data.workActivity,
                dangerSourceDescription: data.dangerSourceDescription,
                possibleAccident: data.possibleAccident,
                accidentCase: data.accidentCase,
                occupationalDisease: data.occupationalDisease,
                l: data.l,
                s: data.s,
                isMajorRisk: data.isMajorRisk,
                currentControlMeasures: data.currentControlMeasures,
            };
            return riskSourceApi.update(riskSourceId, filteredData);
        },
        onSuccess: () => {
            // 失效所有相关的查询缓存并立即重新获取
            queryClient.invalidateQueries({
                queryKey: ["riskSource"],
                refetchType: "active",
            });
        },
        ...options,
    });
};

/**
 * 删除风险源钩子
 * @param {Object} options - Mutation选项
 * @returns {Object} Mutation结果
 */
export const useDeleteRiskSource = (options = {}) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (riskSourceId) => riskSourceApi.delete(riskSourceId),
        onSuccess: () => {
            // 失效所有相关的查询缓存并立即重新获取
            queryClient.invalidateQueries({
                queryKey: ["riskSource"],
                refetchType: "active",
            });
        },
        ...options,
    });
};
