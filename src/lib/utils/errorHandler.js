/**
 * API错误处理映射
 */
const ERROR_MESSAGES = {
    400: "请求参数错误",
    401: "登录已过期，请重新登录",
    403: "没有权限访问该资源",
    404: "请求的资源不存在",
    500: "服务器内部错误",
    502: "网关错误",
    503: "服务暂时不可用",
};

/**
 * 通用API错误处理
 * @param {Error} error - 错误对象
 * @param {string} operation - 操作名称
 * @param {boolean} showMessage - 是否显示错误消息
 * @param {Object} messageApi - message API实例
 * @returns {string} 错误消息
 */
export const handleApiError = (
    error,
    operation = "操作",
    showMessage = true,
    messageApi = null
) => {
    console.error(`${operation}失败:`, error);

    let errorMessage = `${operation}失败，请重试！`;

    if (error?.response?.status) {
        const status = error.response.status;
        errorMessage = ERROR_MESSAGES[status] || errorMessage;
    } else if (error?.message) {
        errorMessage = error.message;
    }

    if (showMessage && messageApi) {
        messageApi.error(errorMessage);
    }

    return errorMessage;
};

/**
 * API成功处理
 * @param {string} operation - 操作名称
 * @param {boolean} showMessage - 是否显示成功消息
 * @param {Object} messageApi - message API实例
 */
export const handleApiSuccess = (operation = "操作", showMessage = true, messageApi = null) => {
    const successMessage = `${operation}成功！`;

    if (showMessage && messageApi) {
        messageApi.success(successMessage);
    }

    return successMessage;
};

/**
 * 包装异步操作的错误处理
 * @param {Function} asyncFn - 异步函数
 * @param {string} operation - 操作名称
 * @returns {Function} 包装后的函数
 */
export const withErrorHandler = (asyncFn, operation) => {
    return async (...args) => {
        try {
            const result = await asyncFn(...args);
            return result;
        } catch (error) {
            handleApiError(error, operation);
            throw error;
        }
    };
};
