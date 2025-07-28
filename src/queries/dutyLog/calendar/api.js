const base_url = "http://10.22.161.62:3260";

/**
 * 创建值班表
 * @param {Object} data 值班表数据
 * @returns 创建结果
 */
export const createDutyLogCalendar = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-schedules`, {
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
 * 更新值班表
 * @param {Object} data 值班表数据
 * @returns 更新结果
 */
export const updateDutyLogCalendar = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-schedules`, {
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
 * 删除值班表
 * @param {string} id 值班表ID
 * @returns 删除结果
 */
export const deleteDutyLogCalendar = async (id) => {
    const response = await fetch(`${base_url}/v1/duty-schedules/${id}`, {
        method: "DELETE",
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
 * 查询值班表
 * @param {Object} data 查询参数
 * @returns 值班表列表
 */
export const dutyLogCalendarList = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-schedules/query`, {
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
