"use client";
"use client";
import { useRouter } from "next/navigation";
import { Button, Table, App, Alert, Tag, Skeleton, Card, Space, Tooltip } from "antd";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { useMaterialQuery } from "@/queries/materials";
import type { ColumnsType } from "antd/es/table";

// 定义库存数据类型
interface StockItem {
    wuzibianma: string;
    wuzimingcheng: string;
    guigexinghao: string;
    ruku: number;
    chuku: number;
    danwei: string;
    fazhi: number;
    lei: string;
    kucun: number;
}

export default function Materials() {
    const { message } = App.useApp();
    const router = useRouter();

    // 使用useMaterialQuery查询库存数据（无请求体）
    const { data: stockData, isLoading, error } = useMaterialQuery(null);

    // 获取类别文本
    const getCategoryText = (lei: string) => {
        return lei === "0" ? "物资物品" : lei === "1" ? "药品" : "未知";
    };

    // 获取库存状态
    const getStockStatus = (kucun: number, fazhi: number) => {
        if (kucun <= 0) {
            return { status: "error", text: "无库存", color: "red" };
        } else if (kucun <= fazhi) {
            return { status: "warning", text: "库存不足", color: "orange" };
        } else {
            return { status: "success", text: "库存充足", color: "green" };
        }
    };

    // 表格列定义
    const columns: ColumnsType<StockItem> = [
        {
            title: "物料编码",
            dataIndex: "wuzibianma",
            key: "wuzibianma",
            width: 120,
            render: (text: string) => <span className="font-mono text-blue-600">{text}</span>,
        },
        {
            title: "物料名称",
            dataIndex: "wuzimingcheng",
            key: "wuzimingcheng",
            width: 200,
            ellipsis: true,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="font-medium">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "规格型号",
            dataIndex: "guigexinghao",
            key: "guigexinghao",
            width: 120,
            render: (text: string) => text || "-",
        },
        {
            title: "单位",
            dataIndex: "danwei",
            key: "danwei",
            width: 80,
            align: "center",
            render: (text: string) => text || "-",
        },
        {
            title: "入库数量",
            dataIndex: "ruku",
            key: "ruku",
            width: 100,
            align: "right",
            render: (value: number) => (
                <span className="text-green-600 font-semibold">{value}</span>
            ),
        },
        {
            title: "出库数量",
            dataIndex: "chuku",
            key: "chuku",
            width: 100,
            align: "right",
            render: (value: number) => <span className="text-red-600 font-semibold">{value}</span>,
        },
        {
            title: "当前库存",
            dataIndex: "kucun",
            key: "kucun",
            width: 100,
            align: "right",
            render: (value: number, record: StockItem) => {
                const status = getStockStatus(value, record.fazhi);
                return (
                    <Space>
                        <span className={`font-bold text-${status.color}-600`}>{value}</span>
                        {status.status === "warning" && (
                            <Tooltip title="库存不足">
                                <WarningOutlined className="text-orange-500" />
                            </Tooltip>
                        )}
                        {status.status === "error" && (
                            <Tooltip title="无库存">
                                <WarningOutlined className="text-red-500" />
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
        {
            title: "库存阈值",
            dataIndex: "fazhi",
            key: "fazhi",
            width: 100,
            align: "right",
            render: (value: number) => <span className="text-gray-600">{value}</span>,
        },
        {
            title: "类别",
            dataIndex: "lei",
            key: "lei",
            width: 100,
            render: (text: string) => (
                <Tag color={text === "0" ? "blue" : "purple"}>{getCategoryText(text)}</Tag>
            ),
        },
        {
            title: "库存状态",
            key: "status",
            width: 100,
            render: (_: any, record: StockItem) => {
                const status = getStockStatus(record.kucun, record.fazhi);
                return <Tag color={status.color}>{status.text}</Tag>;
            },
        },
    ];

    // 骨架屏组件
    const TableSkeleton = () => (
        <Card>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton.Button style={{ width: 200, height: 40 }} active />
                    <Skeleton.Button style={{ width: 120, height: 40 }} active />
                </div>
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        </Card>
    );

    // 错误处理
    if (error) {
        return (
            <div className="p-6">
                <Alert
                    message="数据加载失败"
                    description={error.message || "请检查网络连接或联系管理员"}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // 加载状态显示骨架屏
    if (isLoading) {
        return (
            <div className="p-6">
                <TableSkeleton />
            </div>
        );
    }

    // 获取库存数据
    const stockItems = stockData?.data || [];

    // 统计信息
    const totalItems = stockItems.length;
    const lowStockItems = stockItems.filter(
        (item: StockItem) => item.kucun <= item.fazhi && item.kucun > 0
    ).length;
    const outOfStockItems = stockItems.filter((item: StockItem) => item.kucun <= 0).length;

    return (
        <div className="p-6">
            {/* 页面标题和统计信息 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">库存管理</h1>
                        <p className="text-gray-600 text-sm mt-1">管理物料和药品库存信息</p>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        className="shadow-sm"
                        onClick={() => router.push("/materials/applicants")}
                    >
                        申请单
                    </Button>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <Card size="small" className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
                        <div className="text-gray-600">总物料数</div>
                    </Card>
                    <Card size="small" className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {totalItems - lowStockItems - outOfStockItems}
                        </div>
                        <div className="text-gray-600">库存充足</div>
                    </Card>
                    <Card size="small" className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{lowStockItems}</div>
                        <div className="text-gray-600">库存不足</div>
                    </Card>
                    <Card size="small" className="text-center">
                        <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                        <div className="text-gray-600">无库存</div>
                    </Card>
                </div>

                <div className="border-t pt-4"></div>
            </div>

            {/* 数据表格 */}
            <Table
                columns={columns}
                dataSource={stockItems}
                rowKey={(record) => `${record.wuzibianma}-${record.guigexinghao}-${record.lei}`}
                scroll={{ x: 1200 }}
                pagination={{
                    pageSize: 15,
                    showQuickJumper: true,
                }}
                locale={{
                    emptyText: "暂无库存数据",
                }}
                size="middle"
                rowClassName={(record: StockItem) => {
                    const status = getStockStatus(record.kucun, record.fazhi);
                    if (status.status === "error") return "bg-red-50";
                    if (status.status === "warning") return "bg-orange-50";
                    return "";
                }}
            />
        </div>
    );
}
