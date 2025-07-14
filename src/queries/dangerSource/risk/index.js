"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
    getRiskSourceList,
    addRiskSource,
    deleteRiskSource,
    editRiskSource,
    searchRiskSource,
} from "./api";
import { message } from "antd";

/**
 * 获取风险源列表
 * @returns 风险源列表
 */
export const useGetRiskSourceList = () => {
    return useQuery({
        queryKey: ["riskSourceList"],
        queryFn: getRiskSourceList,
        select: (data) => {
            // 如果返回的数据有data字段，则提取数据数组；否则直接返回数据
            return data?.data || data || [];
        },
        staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
        gcTime: 10 * 60 * 1000, // 10分钟后清除缓存
        onError: (error) => {
            message.error(error.message);
        },
    });
};

/**
 * 添加风险源
 * @returns 添加风险源
 */
export const useAddRiskSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addRiskSource,
        onSuccess: () => {
            // 成功后自动刷新风险源列表
            queryClient.invalidateQueries({ queryKey: ["riskSourceList"] });
        },
        onError: (error) => {
            console.error("添加风险源API错误:", error);
        },
    });
};

/**
 * 删除风险源
 * @returns 删除风险源
 */
export const useDeleteRiskSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRiskSource,
        onSuccess: () => {
            // 成功后自动刷新风险源列表
            queryClient.invalidateQueries({ queryKey: ["riskSourceList"] });
        },
        onError: (error) => {
            console.error("删除风险源API错误:", error);
        },
    });
};

/**
 * 编辑风险源
 * @returns 编辑风险源
 */
export const useEditRiskSource = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ riskSourceId, data }) => editRiskSource(riskSourceId, data),
        onSuccess: () => {
            // 成功后自动刷新风险源列表
            queryClient.invalidateQueries({ queryKey: ["riskSourceList"] });
        },
        onError: (error) => {
            console.error("编辑风险源API错误:", error);
        },
    });
};

/**
 * 关键字查询风险源
 * @param {string} keyword - 搜索关键字
 * @returns 风险源列表
 */
export const useSearchRiskSource = (keyword) => {
    return useQuery({
        queryKey: ["searchRiskSource", keyword],
        queryFn: () => searchRiskSource(keyword),
        enabled: !!keyword, // 只有当关键字存在时才启用查询
        select: (data) => {
            // 如果返回的数据有data字段，则提取数据数组；否则直接返回数据
            return data?.data || data || [];
        },
        onError: (error) => {
            message.error(error.message);
        },
    });
};
