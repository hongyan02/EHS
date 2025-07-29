const base_url = "http://10.22.161.62:3260";

//创建日志
export const createDutyLog = async (data) => {
        const response = await fetch(`${base_url}/v1/duty-logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`创建日志失败: ${response.statusText}`);
        }

        const result = await response.json();
    return result;
};

//更新日志
export const updateDutyLog = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-logs`, {
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


//提交日志
export const submitDutyLog = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-logs/${data.id}/commit`, {
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

//删除日志
export const deleteDutyLog = async (id) => {
    const response = await fetch(`${base_url}/v1/duty-logs/${id}`, {
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

//查询日志
export const getDutyLogs = async (data) => {
    const response = await fetch(`${base_url}/v1/duty-logs/query`, {
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