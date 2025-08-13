const base_url = "http://10.22.161.62";

export const getMaterials = async () => {
    const response = await fetch(`${base_url}/API/wuzi_kucun.asp`);
    if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
    }
    const result = await response.json();
    return result;
};