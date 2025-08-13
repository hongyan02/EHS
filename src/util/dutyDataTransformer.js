/**
 * 值班数据转换工具
 * 用于将API返回的值班数据转换为表格组件可用的格式
 */

/**
 * 职位映射表
 */
const POSITION_MAP = {
    // 白班职位
    dayDutyLeader: "值班领导",
    dayDutyManager: "带班干部",
    daySafetyManager: "安全管理人员",
    daySafetyOfficer: "安全员",

    // 夜班职位（只有值班领导和安全员）
    nightDutyLeader: "值班领导",
    nightSafetyOfficer: "安全员",
};

/**
 * 班次类型映射
 */
const SHIFT_TYPE_MAP = {
    0: "day", // 白班
    1: "night", // 夜班
};

/**
 * 获取星期几的中文表示
 * @param {string} dateString - 日期字符串
 * @returns {string} 中文星期
 */
function getChineseWeekday(dateString) {
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const date = new Date(dateString);
    return weekdays[date.getDay()];
}

/**
 * 将API数据转换为表格数据格式
 * @param {Object} apiResponse - API响应数据
 * @returns {Array} 转换后的表格数据
 */
export function transformDutyDataForTable(apiResponse) {
    if (!apiResponse || !apiResponse.data || !Array.isArray(apiResponse.data)) {
        return [];
    }

    // 按日期和职位分组数据
    const groupedData = {};

    apiResponse.data.forEach((item) => {
        const { duty_date, shift_type, employees } = item;
        const shiftKey = SHIFT_TYPE_MAP[shift_type] || "day";

        employees.forEach((employee) => {
            const position = POSITION_MAP[employee.position] || "未知职位";
            const key = `${duty_date}_${position}`;

            if (!groupedData[key]) {
                groupedData[key] = {
                    duty_date: duty_date,
                    week: getChineseWeekday(duty_date), // 添加星期字段
                    position: position,
                    day_person: "",
                    day_phone: "",
                    night_person: "",
                    night_phone: "",
                    night_position: "", // 夜班人员职位字段
                };
            }

            // 根据班次类型填充对应字段
            if (shiftKey === "day") {
                groupedData[key].day_person = employee.employee_name || "";
                groupedData[key].day_phone = employee.phone || "";
            } else if (shiftKey === "night") {
                groupedData[key].night_person = employee.employee_name || "";
                groupedData[key].night_phone = employee.phone || "";
                // 只有夜班有数据时才设置night_position
                groupedData[key].night_position = position;
            }
        });
    });

    // 转换为数组并过滤空行
    const result = Object.values(groupedData).filter((item) => {
        // 检查是否有任何数据（白班或夜班）
        const hasDayData = item.day_person || item.day_phone;
        const hasNightData = item.night_person || item.night_phone;

        // 如果完全没有数据，过滤掉
        if (!hasDayData && !hasNightData) {
            return false;
        }

        // 对于带班干部和安全管理人员，只有白班有数据且夜班无数据时才保留
        if (item.position === "带班干部" || item.position === "安全管理人员") {
            return hasDayData && !hasNightData;
        }

        // 对于值班领导和安全员，只保留有数据的行
        return hasDayData || hasNightData;
    });

    // 定义职位排序优先级
    const positionOrder = ["值班领导", "带班干部", "安全员", "安全管理人员"];

    result.sort((a, b) => {
        // 首先按日期排序
        if (a.duty_date !== b.duty_date) {
            return new Date(a.duty_date) - new Date(b.duty_date);
        }
        // 然后按职位排序
        const aIndex = positionOrder.indexOf(a.position);
        const bIndex = positionOrder.indexOf(b.position);
        return aIndex - bIndex;
    });

    return result;
}
