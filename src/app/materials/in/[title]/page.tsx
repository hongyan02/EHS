"use client";
import { useParams } from 'next/navigation';
import { Card, Descriptions, Steps, Button } from 'antd';
import type { StepsProps } from 'antd';

export default function MaterialDetailPage() {
    const params = useParams();
    const title = decodeURIComponent(params.title as string);

    // 模拟数据，实际应该从API获取
    const materialData = {
        title: title,
        applicant: "李泓言",
        applicationDate: "2025-08-07",
        category: "消防器材",
        specification: "DN65内扣式转DN65内扣式-锻造自锁开关",
        quantity: "1套",
        urgency: "普通",
        reason: "日常维护更换",
        current: 1,
        status: "process" as StepsProps["status"]
    };

    const steps = [
        {
            title: "已申请",
            description: "申请已提交"
        },
        {
            title: "入库中",
            description: "正在处理入库"
        },
        {
            title: "已完成",
            description: "入库完成"
        }
    ];

    return (
        <div className="p-6">
            <Card title="物料入库详情" className="mb-6">
                <Descriptions column={2} bordered>
                    <Descriptions.Item label="物料名称" span={2}>
                        {materialData.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="申请人">
                        {materialData.applicant}
                    </Descriptions.Item>
                    <Descriptions.Item label="申请时间">
                        {materialData.applicationDate}
                    </Descriptions.Item>
                    <Descriptions.Item label="物料类别">
                        {materialData.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="规格型号">
                        {materialData.specification}
                    </Descriptions.Item>
                    <Descriptions.Item label="申请数量">
                        {materialData.quantity}
                    </Descriptions.Item>
                    <Descriptions.Item label="紧急程度">
                        {materialData.urgency}
                    </Descriptions.Item>
                    <Descriptions.Item label="申请原因" span={2}>
                        {materialData.reason}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="入库进度">
                <Steps
                    current={materialData.current}
                    status={materialData.status}
                    direction="vertical"
                    items={steps}
                />
                
                <div className="mt-6">
                    <Button type="primary" className="mr-2">
                        编辑申请
                    </Button>
                    <Button>
                        取消申请
                    </Button>
                </div>
            </Card>
        </div>
    );
}