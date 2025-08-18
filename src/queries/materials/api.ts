const base_url = "http://10.22.161.62";

export const getApplication = async () => {
    const response = await fetch(`${base_url}/API/wuzi_dan.asp`,{
        method: "POST",
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};


export const getMaterial = async (data) => {
    const response = await fetch(`${base_url}/API/wuzi_kucun.asp`,{
        method: "POST",
        body: data,
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};

export const createApplication = async (data) => {
    const response = await fetch(`${base_url}/API/wuzi_dan_zeng.asp`,{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    // 响应体为空，仅根据状态码判断成功
    return { success: true };
};