/**
 * 简洁通用的HTTP请求方法
 */

/**
 * 通用HTTP请求
 * @param {string} url - 请求URL
 * @param {Object} options - 请求配置
 * @param {string} options.method - 请求方法
 * @param {Object} options.headers - 请求头
 * @param {*} options.body - 请求体
 * @param {Object} options.params - URL参数
 * @returns {Promise} 响应数据
 */
async function request(url, options = {}) {
    const { method = "GET", headers = {}, body, params } = options;

    // 处理URL参数
    let fullUrl = url;
    if (params && Object.keys(params).length > 0) {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
                urlParams.append(key, String(value));
            }
        });
        const paramString = urlParams.toString();
        if (paramString) {
            fullUrl += (fullUrl.includes("?") ? "&" : "?") + paramString;
        }
    }

    // 处理请求头
    const finalHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };

    // 处理请求体
    let finalBody;
    if (body) {
        if (body instanceof FormData) {
            delete finalHeaders["Content-Type"]; // FormData自动设置Content-Type
            finalBody = body;
        } else if (typeof body === "object") {
            finalBody = JSON.stringify(body);
        } else {
            finalBody = body;
        }
    }

    try {
        const response = await fetch(fullUrl, {
            method: method.toUpperCase(),
            headers: finalHeaders,
            ...(finalBody && { body: finalBody }),
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        // 尝试解析JSON，如果失败则返回文本
        const text = await response.text();
        if (!text) return null;

        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    } catch (error) {
        console.error("请求失败:", error);
        throw error;
    }
}

// 导出通用请求方法
export default request;

/**
 * GET请求
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Promise} 响应数据
 */
export const httpGet = (url, options = {}) => {
    return request(url, { ...options, method: "GET" });
};

/**
 * POST请求
 * @param {string} url - 请求URL
 * @param {*} data - 请求数据
 * @param {Object} options - 配置选项
 * @returns {Promise} 响应数据
 */
export const httpPost = (url, data, options = {}) => {
    return request(url, { ...options, method: "POST", body: data });
};

/**
 * PUT请求
 * @param {string} url - 请求URL
 * @param {*} data - 请求数据
 * @param {Object} options - 配置选项
 * @returns {Promise} 响应数据
 */
export const httpPut = (url, data, options = {}) => {
    return request(url, { ...options, method: "PUT", body: data });
};

/**
 * DELETE请求
 * @param {string} url - 请求URL
 * @param {Object} options - 配置选项
 * @returns {Promise} 响应数据
 */
export const httpDelete = (url, options = {}) => {
    return request(url, { ...options, method: "DELETE" });
};

/**
 * 使用示例:
 *
 * // GET请求
 * const users = await httpGet('/api/users', {
 *   params: { page: 1, size: 10 }
 * });
 *
 * // POST请求
 * const newUser = await httpPost('/api/users', {
 *   name: '张三', email: 'test@example.com'
 * });
 *
 * // PUT请求
 * const updatedUser = await httpPut('/api/users/1', {
 *   name: '李四'
 * });
 *
 * // DELETE请求
 * await httpDelete('/api/users/1');
 */
