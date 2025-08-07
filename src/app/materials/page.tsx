"use client";
import { Card, Row, Col } from "antd";
import { InboxOutlined, DatabaseOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function Page() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">物料管理</h1>
            
            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={8}>
                    <Link href="/materials/in">
                        <Card 
                            className="h-40 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 hover:bg-gray-100"
                            styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }}
                        >
                            <InboxOutlined className="text-4xl text-blue-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">需求管理</h3>
                            <p className="text-gray-600">管理物料入库申请和审批流程</p>
                        </Card>
                    </Link>
                </Col>
                
                <Col xs={24} sm={12} lg={8}>
                    <Link href="/materials/stock">
                        <Card 
                            className="h-40 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 hover:bg-gray-100"
                            styles={{ body: { padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' } }}
                        >
                            <DatabaseOutlined className="text-4xl text-green-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">库存管理</h3>
                            <p className="text-gray-600">查看和管理物料库存信息</p>
                        </Card>
                    </Link>
                </Col>
            </Row>
        </div>
    )
}