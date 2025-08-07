"use client";
import { Card, Collapse, Tooltip } from "antd";
import { DownOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function MobileStockList() {
    // 模拟库存数据
    const dataSource = [
        {
            key: "1",
            title: "泥雨-止水器-DN65内扣式转DN65内扣式-锻造DN65内扣式转DN65内扣式-锻造",
            number: "MT-2024-001",
            count: "150件",
            use: "生产设备维护",
            remark: "定期检查库存",
        },
        {
            key: "2",
            title: "泥雨-三分器-DN65内扣式出转DN65×2内扣式出-锻造DN65内扣式出转DN65×2内扣式出-锻造",
            number: "MT-2024-002",
            count: "85件",
            use: "设备连接",
            remark: "库存充足",
        },
        {
            key: "3",
            title: "上海宝亚-正压式消防空气呼吸器-RHZK6.8/X 空呼全面罩，供气阀，背具显示HUD，空呼背板，液压缸系统 压力表装置",
            number: "MT-2024-003",
            count: "25套",
            use: "安全防护",
            remark: "重要安全设备",
        },
        {
            key: "4",
            title: "防爆电机",
            number: "MT-2024-004",
            count: "12台",
            use: "动力设备",
            remark: "防爆等级ExdIIBT4",
        },
        {
            key: "5",
            title: "不锈钢管道",
            number: "MT-2024-005",
            count: "500米",
            use: "管道连接",
            remark: "304不锈钢材质",
        },
    ];

    // 移动端列表项渲染
    const renderMobileItem = (item) => {
        const expandedContent = (
            <div className="space-y-2 pt-2 border-t border-gray-100 mt-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">数量</span>
                        <span className="font-semibold text-blue-600 text-sm">{item.count}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">用途</span>
                        <span className="font-medium text-xs text-gray-700">{item.use}</span>
                    </div>
                </div>
                <div className="flex items-start space-x-2">
                    <span className="text-gray-500 text-xs">备注</span>
                    <span className="font-medium text-xs text-gray-600 flex-1">{item.remark}</span>
                </div>
            </div>
        );

        return (
            <Collapse
                size="small"
                ghost
                expandIcon={({ isActive }) => (
                    <DownOutlined
                        rotate={isActive ? 180 : 0}
                        className="text-gray-300 transition-transform duration-200 text-xs"
                    />
                )}
                items={[
                    {
                        key: item.key,
                        label: (
                            <div className="flex justify-between items-center w-full pr-4">
                                <div className="flex-1 min-w-0 max-w-[calc(100%-3rem)]">
                                    <Link
                                        href={`/materials/stock/${item.number}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium block mb-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Tooltip title={item.title} placement="topLeft">
                                            <div
                                                className="text-xs font-semibold leading-4 max-w-full overflow-hidden"
                                                style={{
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: "vertical",
                                                    maxHeight: "1rem",
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                        </Tooltip>
                                    </Link>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        {item.number}
                                    </div>
                                </div>
                            </div>
                        ),
                        children: expandedContent,
                    },
                ]}
                className="border-none"
            />
        );
    };

    return (
        <div className="space-y-2 px-1">
            <div className="text-xs text-gray-500 mb-3 px-2">共 {dataSource.length} 条记录</div>
            {dataSource.map((item) => (
                <Card
                    key={item.key}
                    size="small"
                    className="shadow-sm hover:shadow-md transition-all duration-200 border-0 bg-white rounded-lg"
                    styles={{ body: { padding: "8px 12px" } }}
                >
                    {renderMobileItem(item)}
                </Card>
            ))}
        </div>
    );
}
