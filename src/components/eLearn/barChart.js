"use client";

import ReactECharts from "echarts-for-react";

/**
 * 部门完成情况柱状图组件
 * @param {Object} props - 组件属性
 * @param {Array} props.dataSource - 部门统计数据数组
 * @returns {JSX.Element} 柱状图组件
 */
export default function BarChart({ dataSource = [] }) {
    /**
     * 从数据源提取图表数据
     * @returns {Object} 图表配置对象
     */
    const _getChartData = () => {
        if (!dataSource || dataSource.length === 0) {
            return {
                departments: [],
                completedData: [],
                uncompletedData: [],
            };
        }

        // 按完成率排序，展示效果更好
        const sortedData = [...dataSource].sort((a, b) => b.completion_rate - a.completion_rate);

        return {
            departments: sortedData.map((item) => item.department),
            completedData: sortedData.map((item) => item.completed_count),
            uncompletedData: sortedData.map((item) => item.uncompleted_count),
        };
    };

    const { departments, completedData, uncompletedData } = _getChartData();

    const option = {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
            formatter: (params) => {
                const dataIndex = params[0].dataIndex;
                const dept = departments[dataIndex];
                const completed = completedData[dataIndex];
                const uncompleted = uncompletedData[dataIndex];
                const total = completed + uncompleted;
                const rate = total > 0 ? ((completed / total) * 100).toFixed(2) : 0;

                return `
                    <div style="padding: 10px;">
                        <strong>${dept}</strong><br/>
                        应完成: ${total}人<br/>
                        已完成: ${completed}人<br/>
                        未完成: ${uncompleted}人<br/>
                        完成率: ${rate}%
                    </div>
                `;
            },
        },
        legend: {
            data: ["已完成", "未完成"],
        },
        xAxis: {
            type: "category",
            data: departments,
            axisLabel: {
                fontSize: 12,
            },
        },
        yAxis: {
            type: "value",
            name: "人数",
        },
        series: [
            {
                data: completedData,
                type: "bar",
                name: "已完成",
                color: "#6E9DEF",
                showBackground: true,
                realtimeSort: true,
                backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                },
                label: {
                    show: true,
                    position: "top",
                    color: "#000",
                    fontSize: 12,
                    formatter: (params) => {
                        return params.value;
                    },
                },
            },
            {
                data: uncompletedData,
                type: "bar",
                name: "未完成",
                color: "#EEAE3C",
                showBackground: true,
                backgroundStyle: {
                    color: "rgba(180, 180, 180, 0.2)",
                },
                label: {
                    show: true,
                    position: "top",
                    color: "#000",
                    fontSize: 12,
                    formatter: (params) => {
                        return params.value;
                    },
                },
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: 400 }} />;
}
