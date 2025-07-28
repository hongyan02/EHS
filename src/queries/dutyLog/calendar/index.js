"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
    createDutyLogCalendar,
    updateDutyLogCalendar,
    deleteDutyLogCalendar,
    dutyLogCalendarList,
} from "./api";

/**
 * 创建值班表
 * @returns 创建值班表
 */
export const useCreateDutyLogCalendar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDutyLogCalendar,
        onSuccess: () => {
            // 成功后自动刷新值班表列表
            queryClient.invalidateQueries({ queryKey: ["dutyLogCalendarList"] });
        },
        onError: (error) => {
            console.error("创建值班表失败:", error);
        },
    });
};

/**
 * 更新值班表
 * @returns 更新值班表
 */
export const useUpdateDutyLogCalendar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDutyLogCalendar,
        onSuccess: () => {
            // 成功后自动刷新值班表列表
            queryClient.invalidateQueries({ queryKey: ["dutyLogCalendarList"] });
        },
        onError: (error) => {
            console.error("更新值班表失败:", error);
        },
    });
};

/**
 * 删除值班表
 * @returns 删除值班表
 */
export const useDeleteDutyLogCalendar = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDutyLogCalendar,
        onSuccess: () => {
            // 成功后自动刷新值班表列表
            queryClient.invalidateQueries({ queryKey: ["dutyLogCalendarList"] });
        },
        onError: (error) => {
            console.error("删除值班表失败:", error);
        },
    });
};

/**
 * 查询值班表
 * @param {Object} params - 查询参数
 * @param {string} params.start_duty_date - 开始日期
 * @param {string} params.end_duty_date - 结束日期
 * @returns 查询值班表
 */
export const useDutyLogCalendarList = (params = {}) => {
    return useQuery({
        queryKey: ["dutyLogCalendarList", params],
        queryFn: () => dutyLogCalendarList(params),
        select: (data) => {
            // 如果返回的数据有data字段，则提取数据数组；否则直接返回数据
            return data?.data || data || [];
        },
        staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
        gcTime: 10 * 60 * 1000, // 10分钟后清除缓存
        onError: (error) => {
            console.error("查询值班表失败:", error);
        },
    });
};
