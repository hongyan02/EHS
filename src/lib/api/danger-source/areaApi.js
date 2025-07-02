import { httpGet, httpPost, httpPut, httpDelete } from "@/lib/http";

const BASE_URL = "http://10.22.161.62:3260/api/v1/danger-areas";

export const areaApi = {
    /**
     * 获取所有危险区域
     * @param {Object} params - 查询参数
     * @returns {Promise} API响应
     */
    getList: async (params) => {
        return await httpGet(BASE_URL, { params });
    },

    /**
     * 创建危险区域
     * @param {Object} data - 区域数据
     * @returns {Promise} API响应
     */
    create: async (data) => {
        return await httpPost(BASE_URL, data);
    },

    /**
     * 更新危险区域
     * @param {string} areaId - 区域ID
     * @param {Object} data - 区域数据
     * @returns {Promise} API响应
     */
    update: async (areaId, data) => {
        return await httpPut(`${BASE_URL}/${areaId}`, data);
    },

    /**
     * 删除危险区域
     * @param {string} areaId - 区域ID
     * @returns {Promise} API响应
     */
    delete: async (areaId) => {
        return await httpDelete(`${BASE_URL}/${areaId}`);
    },
};
