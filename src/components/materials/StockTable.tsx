"use client";
import { Table, Tooltip } from "antd";
import Link from "next/link";
import type { StockItem, StockTableProps } from "@/types/materials";

export default function StockTable({ dataSource: propDataSource, loading = false, pagination }: StockTableProps = {}) {
    const columns = [
        {
            title: "物料名称",
            dataIndex: "title",
            key: "title",
            width: 200,
            render: (text, record) => (
                <Tooltip title={text} placement="topLeft">
                    <Link
                        href={`/materials/stock/${record.number}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline block truncate"
                    >
                        {text}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: "物料编号",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "单位",
            dataIndex: "unit",
            key: "unit",
        },
        {
            title: "物料数量",
            dataIndex: "count",
            key: "count",
            render: (text, record) => (
                <span className={Number(text) < Number(record.threshold) ? "text-red-500" : ""}>
                    {text}
                </span>
            ),
        },
        {
            title: "库存阀值",
            dataIndex: "threshold",
            key: "threshold",
        },
        {
            title: "用途",
            dataIndex: "use",
            key: "use",
            width: 150,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate">{text}</div>
                </Tooltip>
            ),
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate">{text}</div>
                </Tooltip>
            ),
        },
    ];

    // 模拟库存数据
    const dataSource: StockItem[] = propDataSource || [
        {
            key: "1",
            title: "泥雨-止水器-DN65内扣式转DN65内扣式-锻造DN65内扣式转DN65内扣式-锻造",
            number: "MT-2024-001",
            unit: "个",
            count: "20",
            threshold: "100",
            use: "生产设备维护",
            remark: "定期检查库存",
        },
        {
            key: "2",
            title: "泥雨-三分器-DN65内扣式出转DN65×2内扣式出-锻造DN65内扣式出转DN65×2内扣式出-锻造",
            number: "MT-2024-002",
            unit: "个",
            count: "85",
            threshold: "50",
            use: "设备连接",
            remark: "库存充足",
        },
        {
            key: "3",
            title: "上海宝亚-正压式消防空气呼吸器-RHZK6.8/X 空呼全面罩，供气阀，背具显示HUD，空呼背板，液压缸系统 压力表装置",
            number: "MT-2024-003",
            unit: "个",
            count: "25",
            threshold: "10",
            use: "安全防护",
            remark: "重要安全设备",
        },
        {
            key: "4",
            title: "防爆电机",
            number: "MT-2024-004",
            unit: "个",
            count: "2",
            threshold: "5",
            use: "动力设备",
            remark: "防爆等级ExdIIBT4",
        },
        {
            key: "5",
            title: "不锈钢管道",
            number: "MT-2024-005",
            unit: "米",
            count: "500",
            threshold: "300",
            use: "管道连接",
            remark: "304不锈钢材质",
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={pagination || {
                pageSize: 10,
                showQuickJumper: true,
            }}
        />
    );
}
