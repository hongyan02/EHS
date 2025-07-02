/**
 * 风险计算工具函数
 */

/**
 * 计算风险值和风险等级
 * @param {number} l - 可能性 (Likelihood)
 * @param {number} s - 严重性 (Severity)
 * @returns {Object} 风险计算结果
 */
export const calculateRisk = (l, s) => {
    if (!l || !s) return { r: 0, level: "", isMajorRisk: false };

    const r = l * s;
    let level = "";
    let isMajorRisk = false;

    if (r >= 15) {
        level = "极高风险";
        isMajorRisk = true;
    } else if (r >= 9) {
        level = "高风险";
        isMajorRisk = true;
    } else if (r >= 4) {
        level = "中等风险";
        isMajorRisk = false;
    } else {
        level = "低风险";
        isMajorRisk = false;
    }

    return { r, level, isMajorRisk };
};

/**
 * 风险等级配置
 */
export const RISK_LEVEL_CONFIG = {
    低风险: { color: "green", priority: 1 },
    中等风险: { color: "orange", priority: 2 },
    高风险: { color: "red", priority: 3 },
    极高风险: { color: "purple", priority: 4 },
};

/**
 * 获取风险等级颜色
 * @param {string} level - 风险等级
 * @returns {string} 颜色
 */
export const getRiskLevelColor = (level) => {
    return RISK_LEVEL_CONFIG[level]?.color || "default";
};
