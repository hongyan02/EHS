"use client";
import { useParams } from "next/navigation";
import { Card, Descriptions, Button, Space } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function MaterialStockDetailPage() {
    const params = useParams();
    const title = decodeURIComponent(Array.isArray(params.title) ? params.title[0] : params.title || '');

    // 模拟物料库存详情数据
    const materialDetail = {
        title: title,
        number: "MT-2024-001",
        count: "150件",
        use: "生产设备维护",
        usePosition: "生产车间A区",
        remark: "定期检查库存，确保充足供应",
        category: "机械配件",
        specification: "标准规格",
        supplier: "供应商A",
        storageLocation: "仓库B-3-15",
        lastUpdateTime: "2024-01-15 14:30:00",
        minStock: "50件",
        maxStock: "200件"
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Space>
                    <Link href="/materials/stock">
                        <Button icon={<ArrowLeftOutlined />} type="text">
                            返回库存列表
                        </Button>
                    </Link>
                </Space>
            </div>

            <Card 
                title={`物料库存详情 - ${materialDetail.title}`}
                extra={
                    <Button type="primary" icon={<EditOutlined />}>
                        编辑库存
                    </Button>
                }
            >
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="物料名称">
                        {materialDetail.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="物料编号">
                        {materialDetail.number}
                    </Descriptions.Item>
                    <Descriptions.Item label="当前库存">
                        <span className="text-lg font-semibold text-blue-600">
                            {materialDetail.count}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="物料类别">
                        {materialDetail.category}
                    </Descriptions.Item>
                    <Descriptions.Item label="规格型号">
                        {materialDetail.specification}
                    </Descriptions.Item>
                    <Descriptions.Item label="供应商">
                        {materialDetail.supplier}
                    </Descriptions.Item>
                    <Descriptions.Item label="存储位置">
                        {materialDetail.storageLocation}
                    </Descriptions.Item>
                    <Descriptions.Item label="用途">
                        {materialDetail.use}
                    </Descriptions.Item>
                    <Descriptions.Item label="使用位置">
                        {materialDetail.usePosition}
                    </Descriptions.Item>
                    <Descriptions.Item label="最小库存">
                        <span className="text-orange-500">{materialDetail.minStock}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="最大库存">
                        <span className="text-green-500">{materialDetail.maxStock}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="最后更新时间">
                        {materialDetail.lastUpdateTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={2}>
                        {materialDetail.remark}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}