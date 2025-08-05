"use client"
import React, { useState } from "react";
import ATable from "@/components/accident/Atable";
import ActionButtons from "@/components/accident/ActionButtons";
import type { AccidentData, AccidentSelectionState } from "@/types/accident";

export default function AccidentPage(): React.JSX.Element {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<AccidentData[]>([]);

    // 处理行选择变化
    const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: AccidentData[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    // 获取选中行的ID数组
    const selectedIds = selectedRows.map(row => row.id).filter(Boolean);

    const handleAdd = () => {
        console.log("新增事故记录");
        // TODO: 实现新增功能
    };

    const handleEdit = (id: string) => {
        console.log("编辑事故记录，ID:", id);
        // TODO: 实现编辑功能，传递选中的ID
    };

    const handleDelete = (ids: string[]) => {
        console.log("删除事故记录，IDs:", ids);
        // TODO: 实现删除功能，传递选中的ID数组
        // 删除成功后清空选择
        // setSelectedRowKeys([]);
        // setSelectedRows([]);
    };

    return (
        <div className="p-6">
            {/* 操作按钮栏 */}
            <ActionButtons 
                selectedRowKeys={selectedRowKeys}
                selectedIds={selectedIds}
                onAdd={handleAdd} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
            />
            
            {/* 表格组件 */}
            <ATable 
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={handleSelectionChange}
            />
        </div>
    );
}
