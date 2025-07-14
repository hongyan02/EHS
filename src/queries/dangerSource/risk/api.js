/**
 * 获取风险源列表
 * @returns 风险源列表
 */
export const getRiskSourceList = async () => {
    const response = await fetch("http://10.22.161.69:3260/v1/risk-sources", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};
/**
 * 添加风险源
 * @param {Object} data 风险源数据body
 * @returns 添加风险源
 */
export const addRiskSource = async (data) => {
    const response = await fetch("http://10.22.161.69:3260/v1/risk-sources/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};

/**
 * 删除风险源
 * @param {string} riskSourceId 风险源ID
 * @returns 删除结果
 */
export const deleteRiskSource = async (riskSourceId) => {
    const response = await fetch(`http://10.22.161.69:3260/v1/risk-sources/${riskSourceId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.text();
    return result;
};

/**
 * 编辑风险源
 * @param {string} riskSourceId 风险源ID
 * @param {Object} data 风险源数据body
 * @returns 编辑风险源
 */
export const editRiskSource = async (riskSourceId, data) => {
    const response = await fetch(`http://10.22.161.69:3260/v1/risk-sources/${riskSourceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};

/**
 * 关键字查询风险源
 * @param {string} keyword 关键字
 * @returns 风险源列表
 */
export const searchRiskSource = async (keyword) => {
    const response = await fetch(
        `http://10.22.161.69:3260/v1/risk-sources/keyword?keyword=${keyword}`
    );
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};
