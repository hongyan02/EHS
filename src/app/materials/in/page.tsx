"use client";

import InList from "@/components/materials/InList";
import ApplicationForm from "@/components/materials/ApplicationForm";
import { Button, Spin, Alert, Modal } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useApplicationQuery } from "@/queries/materials";
import useMaterialsStore from "@/store/useMaterialsStore";

export default function Page() {
    const { data: rawMaterialsData, isLoading, error } = useApplicationQuery();
    const { setMaterialsData, setLoading, setError } = useMaterialsStore();
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 将原始数据同步到store中
    useEffect(() => {
        setLoading(isLoading);
        if (rawMaterialsData?.data) {
            setMaterialsData(rawMaterialsData.data);
        }
        if (error) {
            setError(error);
        }
    }, [rawMaterialsData, isLoading, error, setMaterialsData, setLoading, setError]);

    // 过滤出入库类型的数据并转换格式（用于显示）
    const materialsData = useMemo(() => {
        if (!rawMaterialsData?.data) {
            return [];
        }

        return rawMaterialsData.data
            .filter((item) => item.leibie === "in")
            .map((item) => ({
                id: item.id,
                title: item.title || "未填写标题",
                danhao: item.danhao,
                chuangjianren: item.chuangjianren || "未知",
                chuangjianshijian: item.chuangjianshijian || "未知",
                querenshijian: item.querenshijian,
                querenren: item.querenren,
                // 根据确认时间判断状态
                current: item.querenshijian ? 2 : 0,
                status: item.querenshijian ? "finish" : "process",
            }));
    }, [rawMaterialsData]);
    const handleShowModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log("申请数据:", values);
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
                <ApplicationForm onSubmit={handleSubmit} />
            </Modal>
        </div>
    );
}
