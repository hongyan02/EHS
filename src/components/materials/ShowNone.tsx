"use client"
import { Row, Col, Card } from 'antd';

interface MaterialItem {
    key: string;
    title: string;
    currentStock: number;
    threshold: number;
}

interface ShowNoneProps {
    dataSource?: MaterialItem[];
    loading?: boolean;
}

export default function ShowNone({ dataSource, loading }: ShowNoneProps = {}) {
    // 模拟数据
    const data: MaterialItem[] = dataSource || [
        {
            key: "1",
            title: "沱雨-止水器-DN65内扣式",
            currentStock: 2,
            threshold: 5
        },
        {
            key: "2",
            title: "沱雨-二分水器-DN65内扣式",
            currentStock: 8,
            threshold: 10
        },
        {
            key: "3",
            title: "正压式消防空气呼吸器",
            currentStock: 1,
            threshold: 3
        },
        {
            key: "4",
            title: "防爆电机",
            currentStock: 2,
            threshold: 5
        },
        {
            key: "5",
            title: "不锈钢管道",
            currentStock: 100,
            threshold: 50
        },
        {
            key: "6",
            title: "阿司匹林肠溶片",
            currentStock: 20,
            threshold: 50
        },
        {
            key: "7",
            title: "碘伏消毒液",
            currentStock: 5,
            threshold: 20
        }
    ];

    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-gray-500 text-sm">暂无数据</span>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Row gutter={[16, 16]}>
                {data.map((item) => (
                    <Col xs={24} sm={12} md={8} key={item.key}>
                        <Card 
                            size="small" 
                            loading={loading}
                            className="h-full"
                        >
                            <div className="space-y-2">
                                <div className="font-medium text-sm line-clamp-2" title={item.title}>
                                    {item.title}
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-600">现有数量:</span>
                                        <span className={item.currentStock < item.threshold ? "text-red-500 font-medium" : "text-gray-900"}>
                                            {item.currentStock}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-600">阈值数量:</span>
                                        <span className="text-gray-900">{item.threshold}</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
