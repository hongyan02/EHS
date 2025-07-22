const base_url = "http://10.22.161.69:3260";

/**
 * 获取区域列表
 * @returns 区域列表
 */
export const getAreaList = async (data) => {
    const response = await fetch(`${base_url}/v1/danger-areas/page`, {
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
 * 新增区域
 * @param {Object} data 区域数据body
 * @returns 新增区域
 */
export const addArea = async (data) => {
    const response = await fetch(`${base_url}/v1/danger-areas`, {
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
 * 更新区域
 * @param {Object} data 区域数据body
 * @returns 更新区域
 */
export const updateArea = async (data) => {
    const response = await fetch(`${base_url}/v1/danger-areas/${data.areaId}`, {
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
 * 删除区域
 * @param {string} areaId 区域ID
 * @returns 删除区域
 */
export const deleteArea = async (areaId) => {
    const response = await fetch(`${base_url}/v1/danger-areas/${areaId}`, {
        method: "DELETE",
    });
};
