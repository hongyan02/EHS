"use client";
import { Table, Tooltip } from "antd";
import Link from "next/link";
import type { StockItem, StockTableProps } from "@/types/materials";
import { useMaterialsStock } from "@/hooks/materials/use-materials-stock";

export default function StockTable({
    dataSource: propDataSource,
    loading: propLoading = false,
    pagination,
}: StockTableProps = {}) {
    const { data: stockData, isLoading, error } = useMaterialsStock();

    // 使用传入的数据源或API数据
    const dataSource = propDataSource || stockData;
    const loading = propLoading || isLoading;
    const columns = [
        {
            title: "物料名称",
            dataIndex: "wuzimingcheng",
            key: "wuzimingcheng",
            width: 200,
            render: (text, record) => (
                <Tooltip
                    title={text}
                    placement="topLeft"
                >
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
            dataIndex: "wuzibianma",
            key: "wuzibianma",
        },
        {
            title: "单位",
            dataIndex: "danwei",
            key: "danwei",
        },
        {
            title: "物料数量",
            dataIndex: "kucun",
            key: "kucun",
            render: (text, record) => (
                <span className={Number(text) < Number(record.fazhi) ? "text-red-500" : ""}>
                    {text}
                </span>
            ),
        },
        {
            title: "库存阀值",
            dataIndex: "fazhi",
            key: "fazhi",
        },
        {
            title: "用途",
            dataIndex: "use",
            key: "use",
            width: 150,
            render: (text) => (
                <Tooltip
                    title={text}
                    placement="topLeft"
                >
                    <div className="truncate">{text}</div>
                </Tooltip>
            ),
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            render: (text) => (
                <Tooltip
                    title={text}
                    placement="topLeft"
                >
                    <div className="truncate">{text}</div>
                </Tooltip>
            ),
        },
    ];

    // 如果有错误，显示错误信息
    if (error && !propDataSource) {
        console.error("获取物料库存数据失败:", error);
    }

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            pagination={
                pagination || {
                    pageSize: 10,
                    showQuickJumper: true,
                }
            }
        />
    );
}
