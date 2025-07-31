import { getAreaToRisk, batchAreaToRisk, deleteAreaToRisk } from "./api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * 获取区域风险源
 * @param {string} areaId 区域ID
 * @returns {Array} 区域风险源列表
 */
export const useGetAreaToRisk = (areaId) => {
    return useQuery({
        queryKey: ["areaToRisk", areaId],
        queryFn: () => getAreaToRisk(areaId),
        enabled: !!areaId, // 只有当 areaId 存在时才发起请求
        select: (data) => data, // 直接返回数据，因为 API 返回的就是完整的响应
        staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
        gcTime: 10 * 60 * 1000, // 10分钟后清除缓存
    });
};

/**
 * 批量关联区域和风险源
 * @returns {Object} 批量关联mutation
 */
export const useBatchAreaToRisk = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ areaId, riskSourceIds }) => batchAreaToRisk(areaId, riskSourceIds),
        onSuccess: (data, variables) => {
            // 成功后刷新相关的查询
            queryClient.invalidateQueries({ queryKey: ["areaToRisk", variables.areaId] });
            queryClient.invalidateQueries({ queryKey: ["areaToRisk"] });
        },
        onError: (error) => {
            console.error("批量关联区域和风险源失败:", error);
        },
    });
};

/**
 * 批量删除区域和风险源关联
 * @returns {Object} 批量删除mutation
 */
export const useDeleteAreaToRisk = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ areaId, riskSourceIds }) => deleteAreaToRisk(areaId, riskSourceIds),
        onSuccess: (data, variables) => {
            // 成功后刷新相关的查询
            queryClient.invalidateQueries({ queryKey: ["areaToRisk", variables.areaId] });
            queryClient.invalidateQueries({ queryKey: ["areaToRisk"] });
        },
        onError: (error) => {
            console.error("批量删除区域和风险源关联失败:", error);
        },
    });
};
