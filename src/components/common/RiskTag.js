import { Tag } from "antd";
import { getRiskLevelColor } from "@/lib/utils/riskCalculator";

/**
 * 风险等级标签组件
 * @param {Object} props
 * @param {string} props.level - 风险等级
 * @param {Object} props.style - 自定义样式
 * @returns {JSX.Element}
 */
export const RiskLevelTag = ({ level, style = {} }) => {
    const color = getRiskLevelColor(level);
    return (
        <Tag color={color} style={style}>
            {level}
        </Tag>
    );
};

/**
 * 重大风险标签组件
 * @param {Object} props
 * @param {boolean} props.isMajor - 是否重大风险
 * @param {Object} props.style - 自定义样式
 * @returns {JSX.Element}
 */
export const MajorRiskTag = ({ isMajor, style = {} }) => {
    return (
        <Tag color={isMajor ? "red" : "green"} style={style}>
            {isMajor ? "是" : "否"}
        </Tag>
    );
};
