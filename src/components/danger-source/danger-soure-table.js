"use client";
import { Table, Tag } from "antd";
import useDangerSourceStore from "@/store/danger-source-store";
import { useDangerSourceQuery } from "@/hooks/use-danger-source-query";

/**
 * 危险源表格组件
 * @returns {JSX.Element} 危险源表格
 */
export default function DangerSourceTable() {
    const { tableData, loading, total } = useDangerSourceStore();

    // 使用React Query获取数据
    const { isLoading, error } = useDangerSourceQuery();

    /**
     * 渲染风险等级标签
     * @param {string} level - 风险等级
     * @returns {JSX.Element} 风险等级标签
     */
    const _renderRiskLevel = (level) => {
        const levelConfig = {
            低风险: { color: "green" },
            中等风险: { color: "orange" },
            高风险: { color: "red" },
            极高风险: { color: "purple" },
        };

        const config = levelConfig[level] || { color: "default" };
        return <Tag color={config.color}>{level}</Tag>;
    };

    /**
     * 渲染是否重大风险
     * @param {boolean} isMajor - 是否重大风险
     * @returns {JSX.Element} 重大风险标签
     */
    const _renderMajorRisk = (isMajor) => {
        return <Tag color={isMajor ? "red" : "green"}>{isMajor ? "是" : "否"}</Tag>;
    };

    const columns = [
        {
            title: "序号",
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
        },
        {
            title: "产品系列",
            dataIndex: "product",
            key: "product",
            width: 120,
        },
        {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 100,
        },
        {
            title: "区域",
            dataIndex: "area",
            key: "area",
            width: 100,
        },
        {
            title: "工作岗位",
            dataIndex: "workPosition",
            key: "workPosition",
            width: 120,
        },
        {
            title: "作业活动",
            dataIndex: "workActivity",
            key: "workActivity",
            width: 150,
        },
        {
            title: "危险源辨识",
            children: [
                {
                    title: "危险源描述",
                    dataIndex: "dangerSourceDescription",
                    key: "dangerSourceDescription",
                    width: 200,
                    ellipsis: true,
                },
                {
                    title: "可能导致的事故",
                    dataIndex: "possibleAccident",
                    key: "possibleAccident",
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: "事故案例",
                    dataIndex: "accidentCase",
                    key: "accidentCase",
                    width: 150,
                    ellipsis: true,
                },
            ],
        },
        {
            title: "职业病危害因素",
            dataIndex: "occupationalDisease",
            key: "occupationalDisease",
            width: 120,
            ellipsis: true,
        },
        {
            title: "固有风险",
            children: [
                {
                    title: "L",
                    dataIndex: "L",
                    key: "L",
                    width: 60,
                    align: "center",
                },
                {
                    title: "S",
                    dataIndex: "S",
                    key: "S",
                    width: 60,
                    align: "center",
                },
                {
                    title: "R",
                    dataIndex: "R",
                    key: "R",
                    width: 60,
                    align: "center",
                },
                {
                    title: "风险等级",
                    dataIndex: "level",
                    key: "level",
                    width: 100,
                    align: "center",
                    render: _renderRiskLevel,
                },
            ],
        },
        {
            title: "是否重大风险",
            dataIndex: "isMajorRisk",
            key: "isMajorRisk",
            width: 120,
            align: "center",
            render: _renderMajorRisk,
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            width: 120,
            align: "center",
        },
    ];

    // 错误处理
    if (error) {
        return (
            <div className="flex justify-center items-center h-32">
                <span className="text-red-500">数据加载失败，请重试</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto">
            <Table
                columns={columns}
                dataSource={tableData}
                loading={loading || isLoading}
                pagination={{
                    pageSize: 20,
                    showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                    size: "small",
                }}
                bordered={true}
                size="middle"
                scroll={{
                    x: "max-content",
                    y: "calc(100vh - 280px)",
                }}
                className="h-full"
                style={{
                    minWidth: "100%",
                }}
            />
        </div>
    );
}
