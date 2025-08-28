const base_url = "http://10.22.161.62";

export const getHazards = async () => {
    const response = await fetch(`${base_url}/EHS_jiankangAPI/select.asp`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();

    // 解析响应体，返回 data 数组
    if (result && result.data) {
        return result.data;
    }
};

export const updateHazards = async (data) => {
    // 构造 URLSearchParams 格式的数据
    const urlencoded = new URLSearchParams();

    // 添加所有字段到 URLSearchParams
    Object.keys(data).forEach((key) => {
        if (data[key] !== undefined && data[key] !== null) {
            urlencoded.append(key, data[key]);
        }
    });

    const response = await fetch(`${base_url}/EHS_jiankangAPI/update.asp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
    });

    // 根据状态码判断是否成功
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }

    // 如果状态码是 200，表示成功，即使没有响应体内容
    if (response.status === 200) {
        return { success: true, status: response.status };
    }
};

export const deleteHazards = async (data) => {
    // 构造 URLSearchParams 格式的数据
    const urlencoded = new URLSearchParams();

    // 如果传入的是包含 ids 数组的对象，逐个添加 id 参数
    if (data.ids && Array.isArray(data.ids)) {
        data.ids.forEach((id) => {
            urlencoded.append("id", id);
        });
    } else if (data.id) {
        // 如果直接传入 id
        urlencoded.append("id", data.id);
    } else {
        // 处理其他格式的数据
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                urlencoded.append(key, data[key]);
            }
        });
    }

    const response = await fetch(`${base_url}/EHS_jiankangAPI/del.asp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlencoded,
    });

    // 根据状态码判断是否成功
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }

    // 如果状态码是 200，表示成功，即使没有响应体内容
    if (response.status === 200) {
        return { success: true, status: response.status };
    }
};
