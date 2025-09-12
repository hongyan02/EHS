"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Table, Modal, App, Alert, Space, Tag, Skeleton, Card, Tabs } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useApplicationQuery, useDeleteApplication } from "@/queries/materials";
import ApplicationForm from "@/components/materials/ApplicationForm";
import type { ColumnsType } from "antd/es/table";

// 定义数据类型
interface ApplicationItem {
    id: number;
    title: string;
    danhao: string;
    leibie: string;
    lei: string;
    chuangjianshijian: string;
    chuangjianren: string;
    chuangjianrengonghao: string;
    laiyuan: string;
    beizhu: string;
    querenshijian: string;
    querenren: string;
    querenrengonghao: string;
}

export default function MaterialsApplicants() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("in");
    const { message } = App.useApp();
    const router = useRouter();

    const { data: applicationData, isLoading, error } = useApplicationQuery();
    const deleteApplicationMutation = useDeleteApplication();

    // 过滤不同类型的申请单数据
    const getFilteredApplications = (type: string) => {
        return applicationData?.data?.filter((item: ApplicationItem) => item.leibie === type) || [];
    };

    // 获取状态标签
    const getStatusTag = (record: ApplicationItem) => {
        if (record.querenshijian) {
            return <Tag color="green">已完成</Tag>;
        }
        return <Tag color="processing">待处理</Tag>;
    };

    // 获取类别文本
    const getCategoryText = (lei: string) => {
        return lei === "1" ? "物料" : lei === "2" ? "药品" : "未知";
    };

    // 获取申请类型文本
    const getApplicationTypeText = (leibie: string) => {
        return leibie === "in" ? "入库申请" : leibie === "out" ? "出库申请" : "未知";
    };

    // 处理查看详情
    const handleViewDetail = (record: ApplicationItem) => {
        router.push(`/materials/applicants/detail?danhao=${encodeURIComponent(record.danhao)}`);
    };

    // 处理删除
    const handleDelete = async (record: ApplicationItem) => {
        try {
            const formData = new URLSearchParams();
            formData.append("id", record.id.toString());
            await deleteApplicationMutation.mutateAsync(formData.toString());
            message.success("删除成功！");
        } catch (error) {
            message.error("删除失败，请重试");
        }
    };

    // 处理新建申请
    const handleCreateApplication = () => {
        setIsModalVisible(true);
    };

    // 表格列定义
    const columns: ColumnsType<ApplicationItem> = [
        {
            title: "申请单号",
            dataIndex: "danhao",
            key: "danhao",
            width: 180,
            render: (text: string) => <span className="font-mono text-blue-600">{text}</span>,
        },
        {
            title: "申请标题",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            width: 200,
            render: (text: string) => <span className="font-medium">{text || "未填写标题"}</span>,
        },
        {
            title: "申请人",
            dataIndex: "chuangjianren",
            key: "chuangjianren",
            width: 100,
            render: (text: string) => text || "未知",
        },
        {
            title: "工号",
            dataIndex: "chuangjianrengonghao",
            key: "chuangjianrengonghao",
            width: 100,
        },
        {
            title: "申请时间",
            dataIndex: "chuangjianshijian",
            key: "chuangjianshijian",
            width: 160,
            render: (text: string) => <span className="text-gray-600">{text}</span>,
        },
        {
            title: "来源",
            dataIndex: "laiyuan",
            key: "laiyuan",
            width: 100,
        },
        {
            title: "类别",
            dataIndex: "lei",
            key: "lei",
            width: 80,
            render: (text: string) => (
                <Tag color={text === "1" ? "blue" : "purple"}>{getCategoryText(text)}</Tag>
            ),
        },
        {
            title: "申请类型",
            dataIndex: "leibie",
            key: "leibie",
            width: 100,
            render: (text: string) => (
                <Tag color={text === "in" ? "green" : "orange"}>{getApplicationTypeText(text)}</Tag>
            ),
        },
        {
            title: "状态",
            key: "status",
            width: 100,
            render: (_: any, record: ApplicationItem) => getStatusTag(record),
        },
        {
            title: "备注",
            dataIndex: "beizhu",
            key: "beizhu",
            width: 150,
            ellipsis: true,
            render: (text: string) => (
                <span className="text-gray-600" title={text}>
                    {text || "无"}
                </span>
            ),
        },
        {
            title: "操作",
            key: "action",
            width: 200,
            fixed: "right",
            render: (_: any, record: ApplicationItem) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetail(record)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record)}
                        loading={deleteApplicationMutation.isPending}
                    >
                        删除
                    </Button>
                </Space>
            ),
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

    // 获取当前标签页的数据
    const currentData = getFilteredApplications(activeTab);

    // 标签页配置
    const tabItems = [
        {
            key: "in",
            label: `入库申请 (${getFilteredApplications("in").length})`,
            children: (
                <Table
                    columns={columns}
                    dataSource={currentData}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showQuickJumper: true,
                    }}
                    locale={{
                        emptyText: "暂无入库申请单数据",
                    }}
                />
            ),
        },
        {
            key: "out",
            label: `出库申请 (${getFilteredApplications("out").length})`,
            children: (
                <Table
                    columns={columns}
                    dataSource={currentData}
                    rowKey="id"
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showQuickJumper: true,
                    }}
                    locale={{
                        emptyText: "暂无出库申请单数据",
                    }}
                />
            ),
        },
    ];

    return (
        <div className="p-6">
            {/* 返回按钮 */}
            <div className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    type="text"
                    onClick={() => router.push("/materials")}
                    className="text-gray-600 hover:text-gray-800"
                >
                    返回库存管理
                </Button>
            </div>

            {/* 页面标题和新建按钮 */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">申请单管理</h1>
                        <p className="text-gray-600 text-sm mt-1">管理物料入库和出库申请</p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        className="shadow-sm"
                        onClick={handleCreateApplication}
                    >
                        新建申请
                    </Button>
                </div>
                <div className="border-t pt-4"></div>
            </div>

            {/* 标签页表格 */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} size="large" />

            {/* 新建申请模态框 */}
            <Modal
                title="新建申请"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={900}
                destroyOnHidden
            >
                <ApplicationForm
                    onSubmit={() => {
                        setIsModalVisible(false);
                        message.success("申请创建成功！");
                    }}
                />
            </Modal>
        </div>
    );
}
