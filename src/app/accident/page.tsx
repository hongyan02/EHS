"use client"
import React, { useState } from "react";
import { Modal, App } from "antd";
import ATable from "@/components/accident/Atable";
import ActionButtons from "@/components/accident/ActionButtons";
import AccidentForm from "@/components/accident/AccidentForm";
import { useCreateAccident, useUpdateAccident, useDeleteAccident } from "@/queries/accidents";
import type { AccidentData, AccidentSelectionState } from "@/types/accident";

export default function AccidentPage(): React.JSX.Element {
    const { message } = App.useApp();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<AccidentData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const [editingData, setEditingData] = useState<AccidentData | undefined>(undefined);
    const [formLoading, setFormLoading] = useState(false);

    // React Query hooks
    const createAccidentMutation = useCreateAccident();
    const updateAccidentMutation = useUpdateAccident();
    const deleteAccidentMutation = useDeleteAccident();

    // 处理行选择变化
    const handleSelectionChange = (selectedRowKeys: React.Key[], selectedRows: AccidentData[]) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    };

    // 获取选中行的ID数组
    const selectedIds = selectedRows.map(row => row.id).filter(Boolean);

    const handleAdd = () => {
        setFormMode('create');
        setEditingData(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (id: string) => {
        const editData = selectedRows.find(row => row.id === id);
        if (editData) {
            setFormMode('edit');
            setEditingData(editData);
            setIsModalOpen(true);
        } else {
            message.error('未找到要编辑的记录');
        }
    };

    const handleDelete = async (ids: string[]) => {
        try {
            // 批量删除
            await Promise.all(ids.map(id => deleteAccidentMutation.mutateAsync(id)));
            message.success(`成功删除 ${ids.length} 条记录`);
            // 删除成功后清空选择
            setSelectedRowKeys([]);
            setSelectedRows([]);
        } catch (error) {
            message.error('删除失败');
            console.error('删除事故记录失败:', error);
        }
    };

    const handleFormSubmit = async (values: Partial<AccidentData>) => {
        setFormLoading(true);
        try {
            if (formMode === 'create') {
                await createAccidentMutation.mutateAsync(values as AccidentData);
                message.success('事故记录创建成功');
            } else {
                if (editingData?.id) {
                    await updateAccidentMutation.mutateAsync({ 
                        id: editingData.id, 
                        ...values 
                    } as AccidentData);
                    message.success('事故记录更新成功');
                }
            }
            setIsModalOpen(false);
            setEditingData(undefined);
        } catch (error) {
            message.error(formMode === 'create' ? '创建失败' : '更新失败');
            console.error('表单提交失败:', error);
        } finally {
            setFormLoading(false);
        }
    };

    const handleFormCancel = () => {
        setIsModalOpen(false);
        setEditingData(undefined);
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="p-6 flex-shrink-0">
                {/* 操作按钮栏 */}
                <ActionButtons 
                    selectedRowKeys={selectedRowKeys}
                    selectedIds={selectedIds}
                    onAdd={handleAdd} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete} 
                />
            </div>
            
            {/* 表格组件 */}
            <div className="flex-1 overflow-hidden px-6 pb-6">
                <ATable 
                    selectedRowKeys={selectedRowKeys}
                    onSelectionChange={handleSelectionChange}
                />
            </div>

            {/* 表单弹窗 */}
            <Modal
                title={formMode === 'create' ? '新增事故记录' : '编辑事故记录'}
                open={isModalOpen}
                onCancel={handleFormCancel}
                footer={null}
                width={1400}
                // destroyOnClose
                destroyOnHidden
            >
                <AccidentForm
                    mode={formMode}
                    initialData={editingData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    loading={formLoading}
                />
            </Modal>
        </div>
    );
}
