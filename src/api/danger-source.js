/**
 * 危险源API接口
 */

import { httpGet, httpPost, httpPut, httpDelete } from "@/lib/http";

// API基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

/**
 * 获取危险源列表
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise<{data: Array, total: number}>} 危险源列表
 */
export const getDangerSourceList = async (params) => {
    console.log("发送API请求 - 获取危险源列表:", params);

    try {
        // TODO: 替换为真实的API端点
        // return await httpPost('/danger-sources/list', params, {
        //     baseURL: API_BASE_URL,
        //     // token: getToken(), // 如需认证
        // });

        // 临时返回空数据，等待接入真实API
        return {
            data: [],
            total: 0,
        };
    } catch (error) {
        console.error("获取危险源列表失败:", error);
        throw new Error("获取危险源列表失败");
    }
};

/**
 * 新增危险源
 * @param {Object} data - 危险源数据
 * @returns {Promise<Object>} 新增结果
 */
export const createDangerSource = async (data) => {
    console.log("发送API请求 - 新增危险源:", data);

    try {
        // TODO: 替换为真实的API端点
        // return await httpPost('/danger-sources', data, {
        //     baseURL: API_BASE_URL,
        //     // token: getToken(), // 如需认证
        // });

        // 临时模拟成功响应
        return {
            success: true,
            id: Date.now(), // 临时ID
            message: "新增成功",
        };
    } catch (error) {
        console.error("新增危险源失败:", error);
        throw new Error("新增危险源失败");
    }
};

/**
 * 更新危险源
 * @param {number} id - 危险源ID
 * @param {Object} data - 更新数据
 * @returns {Promise<Object>} 更新结果
 */
export const updateDangerSource = async (id, data) => {
    console.log("发送API请求 - 更新危险源:", { id, data });

    try {
        // TODO: 替换为真实的API端点
        // return await httpPut(`/danger-sources/${id}`, data, {
        //     baseURL: API_BASE_URL,
        //     // token: getToken(), // 如需认证
        // });

        // 临时模拟成功响应
        return {
            success: true,
            message: "更新成功",
        };
    } catch (error) {
        console.error("更新危险源失败:", error);
        throw new Error("更新危险源失败");
    }
};

/**
 * 删除危险源
 * @param {number} id - 危险源ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteDangerSource = async (id) => {
    console.log("发送API请求 - 删除危险源:", id);

    try {
        // TODO: 替换为真实的API端点
        // return await httpDelete(`/danger-sources/${id}`, {
        //     baseURL: API_BASE_URL,
        //     // token: getToken(), // 如需认证
        // });

        // 临时模拟成功响应
        return {
            success: true,
            message: "删除成功",
        };
    } catch (error) {
        console.error("删除危险源失败:", error);
        throw new Error("删除危险源失败");
    }
};

/**
 * 获取危险源详情
 * @param {number} id - 危险源ID
 * @returns {Promise<Object>} 危险源详情
 */
export const getDangerSourceDetail = async (id) => {
    console.log("发送API请求 - 获取危险源详情:", id);

    try {
        // TODO: 替换为真实的API端点
        // return await httpGet(`/danger-sources/${id}`, {
        //     baseURL: API_BASE_URL,
        //     // token: getToken(), // 如需认证
        // });

        // 临时模拟数据
        return {
            id,
            name: "示例危险源",
            category: "机械",
            riskLevel: "高",
            description: "示例描述",
        };
    } catch (error) {
        console.error("获取危险源详情失败:", error);
        throw new Error("获取危险源详情失败");
    }
};
