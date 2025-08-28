"use client";

import { useState, useCallback } from "react";
import { App } from "antd";
import {
    useGetHazards,
    useUpdateHazardMutation,
    useDeleteHazardsMutation,
} from "@/queries/healthy";

/**
 * 职业健康危害管理自定义Hook
 * 提取页面业务逻辑，实现逻辑和UI分离
 * @returns {Object} 健康危害管理相关的状态和方法
 */
export const useHealthyHazards = () => {
    const { message, modal } = App.useApp();

    // API hooks
    const { data: hazards = [], isLoading, error, refetch } = useGetHazards();
    const updateHazardMutation = useUpdateHazardMutation();
    const deleteHazardsMutation = useDeleteHazardsMutation();

    // 本地状态
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);

    /**
     * 处理行选择变化
     * @param {Array} selectedRowKeys - 选中的行键
     * @param {Array} selectedRows - 选中的行数据
     */
    const handleSelectionChange = useCallback((selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }, []);

    /**
     * 打开新增表单模态框
     */
    const handleAddNew = useCallback(() => {
        setEditingRecord(null);
        setIsModalOpen(true);
    }, []);

    /**
     * 处理编辑操作
     * @param {Object} record - 要编辑的记录
     */
    const handleEdit = useCallback((record) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    }, []);

    /**
     * 处理删除操作
     * @param {Array} selectedKeys - 要删除的记录键
     */
    const handleDelete = useCallback(
        async (selectedKeys) => {
            modal.confirm({
                title: "确认删除",
                content: `确定要删除 ${selectedKeys.length} 条记录吗？此操作不可恢复。`,
                okText: "确定",
                cancelText: "取消",
                okType: "danger",
                onOk: async () => {
                    try {
                        // 构造删除请求的数据对象
                        const deleteData = {
                            ids: selectedKeys,
                        };

                        await deleteHazardsMutation.mutateAsync(deleteData);
                        message.success(`成功删除 ${selectedKeys.length} 条记录`);
                        setSelectedRowKeys([]);
                        setSelectedRows([]);
                    } catch (error) {
                        message.error("删除失败");
                        console.error("删除失败:", error);
                    }
                },
            });
        },
        [modal, message, deleteHazardsMutation]
    );

    /**
     * 关闭模态框
     */
    const handleCancel = useCallback(() => {
        setIsModalOpen(false);
        setEditingRecord(null);
    }, []);

    /**
     * 处理表单提交
     * @param {Object} values - 表单数据
     */
    const handleSubmit = useCallback(
        async (values) => {
            try {
                if (editingRecord) {
                    // 编辑模式 - 构造更新请求的数据对象
                    const updateData = {
                        id: editingRecord.ID,
                        ...values,
                    };

                    await updateHazardMutation.mutateAsync(updateData);
                    message.success("更新成功");
                } else {
                    // 新增模式
                    console.log("新增的数据:", values);
                    // TODO: 这里添加实际的新增API调用逻辑
                    message.success("添加成功");
                }

                setIsModalOpen(false);
                setEditingRecord(null);
                setSelectedRowKeys([]);
                setSelectedRows([]);
            } catch (error) {
                message.error(editingRecord ? "更新失败" : "添加失败");
                console.error("提交失败:", error);
            }
        },
        [editingRecord, updateHazardMutation, message]
    );

    /**
     * 获取加载状态
     * @returns {boolean} 是否正在加载
     */
    const getLoadingState = useCallback(() => {
        return isLoading || updateHazardMutation.isPending || deleteHazardsMutation.isPending;
    }, [isLoading, updateHazardMutation.isPending, deleteHazardsMutation.isPending]);

    /**
     * 获取表单加载状态
     * @returns {boolean} 表单是否正在提交
     */
    const getFormLoadingState = useCallback(() => {
        return updateHazardMutation.isPending;
    }, [updateHazardMutation.isPending]);

    return {
        // 数据状态
        hazards,
        isLoading,
        error,
        refetch,

        // UI 状态
        isModalOpen,
        selectedRowKeys,
        selectedRows,
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
    };
};
