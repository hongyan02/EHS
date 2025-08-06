import React from "react";
import { Button, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { AccidentActionButtonsProps } from "@/types/accident";

export default function ActionButtons({ 
    selectedRowKeys = [], 
    selectedIds = [],
    onAdd, 
    onEdit, 
    onDelete 
}: AccidentActionButtonsProps): React.JSX.Element {
    const handleAdd = () => {
        console.log("新增事故记录");
        onAdd?.();
    };

    const handleEdit = () => {
        if (selectedIds.length === 1) {
            console.log("编辑事故记录，ID:", selectedIds[0]);
            onEdit?.(selectedIds[0]);
        }
    };

    const handleDelete = () => {
        if (selectedIds.length > 0) {
            console.log("删除事故记录，IDs:", selectedIds);
            onDelete?.(selectedIds);
        }
    };

    // 编辑按钮：只能选择一行时启用
    const canEdit = selectedRowKeys.length === 1;
    // 删除按钮：选择一行或多行时启用
    const canDelete = selectedRowKeys.length > 0;

    return (
        <div className="mb-4">
            <Space>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={handleAdd}
                >
                    新增
                </Button>
                <Button 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                    disabled={!canEdit}
                    title={!canEdit ? "请选择一行数据进行编辑" : ""}
                >
                    修改
                </Button>
                <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={handleDelete}
                    disabled={!canDelete}
                    title={!canDelete ? "请选择要删除的数据" : ""}
                >
                    删除
                </Button>
            </Space>
            {/* {selectedRowKeys.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                    已选择 {selectedRowKeys.length} 条记录
                </div>
            )} */}
        </div>
    );
}