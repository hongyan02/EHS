/**
 * 时间工具函数
 */

/**
 * 获取当前年份
 * @returns {number} 当前年份
 */
export function getCurrentYear() {
    return new Date().getFullYear();
}

/**
 * 获取当前月份
 * @returns {number} 当前月份 (1-12)
 */
export function getCurrentMonth() {
    return new Date().getMonth() + 1;
}

/**
 * 获取当前日期在当月的第几周
 * @returns {number} 当月第几周
 */
export function getCurrentWeekOfMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月第一天是星期几 (0=周日, 1=周一, ..., 6=周六)
    const firstDayOfWeek = firstDay.getDay();

    // 计算当前日期在当月的第几周
    // 如果第一天不是周一，则需要调整计算方式
    const adjustedDate = date + firstDayOfWeek - 1;
    const weekOfMonth = Math.ceil(adjustedDate / 7);

    return weekOfMonth;
}

/**
 * 获取指定日期在当月的第几周
 * @param {Date} date 指定日期
 * @returns {number} 当月第几周
 */
export function getWeekOfMonth(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    // 获取当月第一天是星期几
    const firstDayOfWeek = firstDay.getDay();

    // 计算指定日期在当月的第几周
    const adjustedDate = day + firstDayOfWeek - 1;
    const weekOfMonth = Math.ceil(adjustedDate / 7);

    return weekOfMonth;
}

/**
 * 获取当前时间信息的综合对象
 * @returns {Object} 包含年、月、周信息的对象
 */
export function getCurrentTimeInfo() {
    return {
        year: getCurrentYear(),
        month: getCurrentMonth(),
        weekOfMonth: getCurrentWeekOfMonth(),
    };
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date 日期对象，默认为当前日期
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * 格式化时间为 HH:MM:SS 格式
 * @param {Date} date 日期对象，默认为当前时间
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date = new Date()) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化日期时间为 YYYY-MM-DD HH:MM:SS 格式
 * @param {Date} date 日期对象，默认为当前日期时间
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDateTime(date = new Date()) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * 获取当前周的日期范围（最多7天）
 * @returns {Object} 包含开始日期和结束日期的对象
 */
export function getCurrentWeekDateRange() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const currentWeek = getCurrentWeekOfMonth();

    // 获取当月第一天
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // 计算当前周的开始日期
    let weekStartDate;
    if (currentWeek === 1) {
        // 第一周从当月第一天开始
        weekStartDate = new Date(year, month, 1);
    } else {
        // 其他周的开始日期
        const daysFromFirstWeek = (currentWeek - 1) * 7 - firstDayOfWeek + 1;
        weekStartDate = new Date(year, month, 1 + daysFromFirstWeek);
    }

    // 计算当前周的结束日期（最多7天）
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);

    // 确保不超过当月最后一天
    const lastDayOfMonth = new Date(year, month + 1, 0);
    if (weekEndDate > lastDayOfMonth) {
        weekEndDate.setTime(lastDayOfMonth.getTime());
    }

    return {
        startDate: formatDate(weekStartDate),
        endDate: formatDate(weekEndDate),
    };
}
