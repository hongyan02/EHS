/**
 * 获取区域风险源
 * @param {string} areaId 区域ID
 * @returns {Promise<Array>} 区域风险源列表
 */
export const getAreaToRisk = async (areaId) => {
    const response = await fetch(
        `http://10.22.161.69:3260/v1/risk-mappings/area/${areaId}/risk-sources`
    );
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};

/**
 * 批量关联区域和风险源
 * @param {string} areaId - 区域ID
 * @param {Array<string>} riskSourceIds - 风险源ID数组
 * @returns {Promise<Object>} 批量关联结果
 */
export const batchAreaToRisk = async (areaId, riskSourceIds) => {
    // 构建请求体数组
    const requestBody = riskSourceIds.map((riskSourceId) => ({
        area_id: areaId,
        risk_source_id: riskSourceId,
    }));

    const response = await fetch(`http://10.22.161.69:3260/v1/risk-mappings/batch`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }

    const result = await response.json();
    return result;
};
