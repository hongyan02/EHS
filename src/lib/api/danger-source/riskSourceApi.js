import { httpGet, httpPost, httpDelete, httpPut } from "@/lib/http";

// 风险源API基础URL
const BASE_URL = "http://10.22.161.62:3260/api/v1/risk-sources";

/**
 * 风险源API服务
 */
export const riskSourceApi = {
    /**
     * 获取所有风险源信息
     * @param {Object} params - 查询参数
     * @returns {Promise} API响应
     */
    getList: async (params = {}) => {
        return await httpGet(BASE_URL, { params });
    },

    /**
     * 根据关键字搜索风险源
     * @param {string} keyword - 搜索关键字
     * @returns {Promise} API响应
     */
    searchByKeyword: async (keyword) => {
        return await httpGet(`${BASE_URL}/keyword`, {
            params: { keyword },
        });
    },

    /**
     * 创建风险源
     * @param {Object} data - 风险源数据
     * @returns {Promise} API响应
     */
    create: async (data) => {
        return await httpPost(BASE_URL, data);
    },

    /**
     * 更新风险源
     * @param {string|number} riskSourceId - 风险源ID
     * @param {Object} data - 风险源数据
     * @returns {Promise} API响应
     */
    update: async (riskSourceId, data) => {
        return await httpPut(`${BASE_URL}/${riskSourceId}`, data);
    },

    /**
     * 删除风险源
     * @param {string|number} riskSourceId - 风险源ID
     * @returns {Promise} API响应
     */
    delete: async (riskSourceId) => {
        return await httpDelete(`${BASE_URL}/${riskSourceId}`);
    },
};
