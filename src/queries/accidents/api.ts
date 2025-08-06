import type { AccidentData } from "@/types/accident";

const base_url = "http://10.22.161.62";
export const getAccidents = async () => {
    const response = await fetch(`${base_url}/API/shigu_cha.asp`);
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};

export const createAccident = async (data: Partial<AccidentData>) => {
    const response = await fetch(`${base_url}/API/shigu_zeng.asp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    // API响应体是id=x格式，根据状态码判断成功
    return { success: true, status: response.status };
};

export const deleteAccident = async (id: string) => {
    const response = await fetch(`${base_url}/API/shigu_del.asp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${id}`,
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    // API响应体是id=x格式，根据状态码判断成功
    return { success: true, status: response.status };
};


export const updateAccident = async (data: Partial<AccidentData>) => {
    const response = await fetch(`${base_url}/API/shigu_gai.asp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    // API响应体是id=x格式，根据状态码判断成功
    return { success: true, status: response.status };
};
