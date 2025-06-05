/**
 * 通用请求方法封装
 * 支持 GET/POST/PUT/DELETE 请求、token 携带、form-data 上传、文件下载等
 */

/**
 * 通用HTTP请求方法
 * @param {string} url - 请求URL
 * @param {Object} [options={}] - 请求配置选项
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.headers={}] - 请求头
 * @param {*} [options.body] - 请求体数据
 * @param {string} [options.token] - 认证token，会自动添加到Authorization头
 * @param {boolean} [options.isForm=false] - 是否为表单数据上传
 * @param {boolean} [options.isDownload=false] - 是否为文件下载
 * @param {Function} [options.validateStatus] - 自定义状态码验证函数
 * @param {string} [options.baseURL=''] - 基础URL
 * @param {Object} [options.params={}] - URL查询参数
 * @param {string} [options.responseType='json'] - 响应类型
 * @param {AbortSignal} [options.signal] - 用于取消请求的信号
 * @returns {Promise<*>} 请求响应结果
 * @throws {RequestError} 请求失败时抛出
 */
export async function httpRequest(url, options = {}) {
    const {
        method = "GET",
        headers = {},
        body,
        token,
        isForm = false,
        isDownload = false,
        validateStatus = (status) => status >= 200 && status < 300,
        baseURL = "",
        params = {},
        responseType = "json",
        signal, // 支持AbortSignal用于取消请求
        ...fetchOptions // 其他fetch选项
    } = options;

    // 构建完整 URL
    let fullUrl = baseURL ? `${baseURL.replace(/\/$/, "")}/${url.replace(/^\//, "")}` : url;

    // 处理 URL 参数
    if (Object.keys(params).length > 0) {
        const urlParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                urlParams.append(key, String(value));
            }
        });
        const paramString = urlParams.toString();
        if (paramString) {
            fullUrl += (fullUrl.includes("?") ? "&" : "?") + paramString;
        }
    }

    // 处理 headers
    const finalHeaders = new Headers({
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
    });

    // 如果不是 form-data，则添加 JSON Content-Type
    if (!isForm && body && !(body instanceof FormData) && !finalHeaders.has("Content-Type")) {
        finalHeaders.set("Content-Type", "application/json");
    }

    // 请求体处理
    let finalBody;
    if (body) {
        if (isForm || body instanceof FormData) {
            finalBody = body;
        } else if (typeof body === "object") {
            finalBody = JSON.stringify(body);
        } else {
            finalBody = body;
        }
    }

    const requestOptions = {
        method: method.toUpperCase(),
        headers: finalHeaders,
        signal, // 传递取消信号
        ...(finalBody && { body: finalBody }),
        ...fetchOptions, // 传递其他fetch选项
    };

    try {
        const response = await fetch(fullUrl, requestOptions);

        // 状态码验证
        if (!validateStatus(response.status)) {
            const errorText = await response.text().catch(() => "Unknown error");
            throw new RequestError(
                `Request failed with status ${response.status}`,
                response.status,
                errorText,
                response
            );
        }

        // 处理响应
        return await _handleResponse(response, isDownload, responseType);
    } catch (error) {
        // 如果是自定义的RequestError，直接抛出
        if (error instanceof RequestError) {
            throw error;
        }

        // 处理网络错误或其他错误
        throw new RequestError(error.message || "Network error", 0, error.message || "", null);
    }
}

/**
 * 处理HTTP响应，根据类型返回相应格式的数据
 * @param {Response} response - fetch响应对象
 * @param {boolean} isDownload - 是否为下载请求
 * @param {string} responseType - 响应类型：'json', 'text', 'blob', 'arrayBuffer'
 * @returns {Promise<*>} 解析后的响应数据
 */
async function _handleResponse(response, isDownload, responseType) {
    if (isDownload || responseType === "blob") {
        return response.blob();
    }

    switch (responseType) {
        case "text":
            return response.text();
        case "arrayBuffer":
            return response.arrayBuffer();
        case "json":
        default:
            // 检查是否有内容
            const contentLength = response.headers.get("content-length");
            if (contentLength === "0") {
                return null;
            }

            const text = await response.text();
            if (!text) {
                return null;
            }

            try {
                return JSON.parse(text);
            } catch (error) {
                console.warn("Failed to parse JSON response:", text);
                return text;
            }
    }
}

/**
 * 自定义请求错误类
 * @class
 * @extends Error
 */
class RequestError extends Error {
    /**
     * 创建RequestError实例
     * @param {string} message - 错误消息
     * @param {number} status - HTTP状态码
     * @param {string} responseText - 响应文本
     * @param {Response} response - fetch响应对象
     */
    constructor(message, status, responseText, response) {
        super(message);
        this.name = "RequestError";
        this.status = status;
        this.responseText = responseText;
        this.response = response;
    }
}

/**
 * GET请求便捷方法
 * @param {string} url - 请求URL
 * @param {Object} [options={}] - 请求配置选项
 * @returns {Promise<*>} 请求响应结果
 */
export const httpGet = (url, options = {}) => httpRequest(url, { ...options, method: "GET" });

/**
 * POST请求便捷方法
 * @param {string} url - 请求URL
 * @param {*} data - 请求体数据
 * @param {Object} [options={}] - 请求配置选项
 * @returns {Promise<*>} 请求响应结果
 */
export const httpPost = (url, data, options = {}) =>
    httpRequest(url, { ...options, method: "POST", body: data });

/**
 * PUT请求便捷方法
 * @param {string} url - 请求URL
 * @param {*} data - 请求体数据
 * @param {Object} [options={}] - 请求配置选项
 * @returns {Promise<*>} 请求响应结果
 */
export const httpPut = (url, data, options = {}) =>
    httpRequest(url, { ...options, method: "PUT", body: data });

/**
 * DELETE请求便捷方法
 * @param {string} url - 请求URL
 * @param {Object} [options={}] - 请求配置选项
 * @returns {Promise<*>} 请求响应结果
 */
export const httpDelete = (url, options = {}) => httpRequest(url, { ...options, method: "DELETE" });

/**
 * PATCH请求便捷方法
 * @param {string} url - 请求URL
 * @param {*} data - 请求体数据
 * @param {Object} [options={}] - 请求配置选项
 * @returns {Promise<*>} 请求响应结果
 */
export const httpPatch = (url, data, options = {}) =>
    httpRequest(url, { ...options, method: "PATCH", body: data });

/**
 * 创建带默认配置的请求实例
 * @param {Object} [defaultConfig={}] - 默认配置选项
 * @returns {Function} 配置好的请求函数
 */
export function createHttpClient(defaultConfig = {}) {
    return (url, options = {}) => httpRequest(url, { ...defaultConfig, ...options });
}

// 导出RequestError类供外部使用
export { RequestError };

/**
 * 使用示例：
 *
 * // 基本GET请求
 * const data = await httpGet('/api/users');
 *
 * // 带参数的GET请求
 * const users = await httpGet('/api/users', {
 *   params: { page: 1, size: 10 }
 * });
 *
 * // POST请求
 * const newUser = await httpPost('/api/users', {
 *   name: '张三',
 *   email: 'test@example.com'
 * });
 *
 * // 带认证的请求
 * const profile = await httpGet('/api/profile', {
 *   token: 'your-jwt-token'
 * });
 *
 * // 文件上传
 * const formData = new FormData();
 * formData.append('file', file);
 * const result = await httpPost('/api/upload', formData, {
 *   isForm: true
 * });
 *
 * // 创建客户端实例
 * const apiClient = createHttpClient({
 *   baseURL: 'https://api.example.com',
 *   headers: { 'X-API-Key': 'your-api-key' }
 * });
 *
 * const data = await apiClient('/users');
 */
