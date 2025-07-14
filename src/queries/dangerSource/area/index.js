"use client";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { getAreaList, addArea, updateArea, deleteArea } from "./api";
import { message } from "antd";

/**
 * 获取区域列表
 * @param {Object} params - 分页参数
 * @param {number} params.page_num - 页码，默认为1
 * @param {number} params.page_size - 每页大小，默认为100
 * @returns 区域列表
 */
export const useGetAreaList = (params = {}) => {
    // 设置默认分页参数
    const defaultParams = {
        page_num: 1,
        page_size: 100, // 设置较大的页面大小以获取更多数据
        ...params,
    };

    return useQuery({
        queryKey: ["areaList", defaultParams],
        queryFn: () => getAreaList(defaultParams),
        select: (data) => {
            // 如果返回的数据有data字段，则提取数据数组；否则直接返回数据
            return data?.data || data || [];
        },
        onError: (error) => {
            message.error(error.message);
        },
    });
};

/**
 * 新增区域
 * @returns 新增区域
 */
export const useAddArea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addArea,
        onSuccess: (data) => {
            // 成功后自动刷新区域列表
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
        onError: (error) => {
            console.error("新增区域失败:", error);
        },
    });
};

/**
 * 更新区域
 * @returns 更新区域
 */
export const useUpdateArea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateArea,
        onSuccess: (data) => {
            // 成功后自动刷新区域列表
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
        onError: (error) => {
            console.error("更新区域失败:", error);
        },
    });
};

/**
 * 删除区域
 * @returns 删除区域
 */
export const useDeleteArea = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteArea,
        onSuccess: (data) => {
            // 成功后自动刷新区域列表
            queryClient.invalidateQueries({ queryKey: ["areaList"] });
        },
        onError: (error) => {
            console.error("删除区域失败:", error);
        },
    });
};
