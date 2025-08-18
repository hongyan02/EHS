"use client";

import InList from "@/components/materials/InList";
import ApplicationForm from "@/components/materials/ApplicationForm";
import { Button, Spin, Alert, Modal } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import { useMaterialsIn } from "@/hooks/materials/use-materials-in";

export default function Page() {
    const { data: materialsData, isLoading, error } = useMaterialsIn();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleShowModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log('申请数据:', values);
        setIsModalVisible(false);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/materials">
                            <Button
                                icon={<ArrowLeftOutlined />}
                                type="text"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                返回
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">物料入库管理</h1>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        className="shadow-sm"
                        onClick={handleShowModal}
                    >
                        新增入库申请
                    </Button>
                </div>
                <p className="text-gray-600 text-sm mb-4">管理物料入库申请和审批流程</p>
                <div className="border-t pt-4"></div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Spin size="large">
                        <div className="p-8">加载中...</div>
                    </Spin>
                </div>
            ) : error ? (
                <Alert
                    message="加载失败"
                    description={error.message || "获取入库申请数据时发生错误"}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            ) : (
                <InList data={materialsData} />
            )}

            <Modal
                title="新增入库申请"
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                destroyOnHidden
            >
                <ApplicationForm
                    onSubmit={handleSubmit}
                />
            </Modal>
        </div>
    );
}
