"use client";

import { Button, Modal, Space, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HazardsTable from "@/components/healthy/HazardsTable";
import HazardForm from "@/components/healthy/HazardsForm";
import { useHealthyHazards } from "@/hooks/use-healthy-hazards";

function HealthyPageContent() {
    const {
        // 数据状态
        hazards,
        error,
        refetch,

        // UI 状态
        isModalOpen,
        selectedRowKeys,
        editingRecord,

        // 操作方法
        handleSelectionChange,
        handleAddNew,
        handleEdit,
        handleDelete,
        handleCancel,
        handleSubmit,

        // 工具方法
        getLoadingState,
        getFormLoadingState,
    } = useHealthyHazards();

    // 错误处理
    if (error) {
        return (
            <div style={{ padding: "24px", textAlign: "center" }}>
                <p>数据加载失败: {error.message}</p>
                <Button onClick={() => refetch()}>重新加载</Button>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            {/* 页面标题和操作按钮 */}
            <div
                style={{
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
                    职业健康危害管理
                </h1>
                <Space>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                        新增危害因素
                    </Button>
                </Space>
            </div>

            {/* 数据表格 */}
            <HazardsTable
                dataSource={hazards}
                loading={getLoadingState()}
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={handleSelectionChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* 添加/编辑表单模态框 */}
            <Modal
                title={editingRecord ? "编辑职业健康危害因素" : "新增职业健康危害因素"}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={1000}
                destroyOnHidden
            >
                <HazardForm
                    initialValues={editingRecord || undefined}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={getFormLoadingState()}
                />
            </Modal>
        </div>
    );
}

export default function HealthyPage() {
    return (
        <App>
            <HealthyPageContent />
        </App>
    );
}
