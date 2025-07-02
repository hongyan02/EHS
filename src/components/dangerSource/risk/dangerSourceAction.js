"use client";
import { useState } from "react";
import { Button, Modal, Input, App } from "antd";
import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import AdvancedForm from "@/components/common/AdvancedForm";
import { dangerSourceFormFields } from "@/config/formFields";
import useDangerSourceStore from "@/store/dangerSourceStore";
import { useCreateRiskSource, useUpdateRiskSource } from "@/hooks/useRiskSourceQuery";

/**
 * 危险源操作栏组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onDataChange - 数据变更回调函数
 * @returns {JSX.Element} 危险源操作栏组件
 */
export default function DangerSourceActionBar({ onDataChange }) {
    const queryClient = useQueryClient();
    const { message } = App.useApp();
    const {
        searchParams,
        setSearchKeyword: updateSearchKeyword,
        resetAll,
        modalVisible,
        editingItem,
        openModal,
        closeModal,
    } = useDangerSourceStore();

    const [searchKeyword, setSearchKeyword] = useState(searchParams.keyword || "");

    // 判断是否为编辑模式
    const isEditMode = !!editingItem;

    // 创建风险源API钩子
    const createMutation = useCreateRiskSource({
        onSuccess: (data) => {
            console.log("创建成功，返回数据:", data);
            message.success("风险源创建成功");
            closeModal();

            // 强制刷新所有相关查询
            setTimeout(() => {
                console.log("开始刷新查询缓存...");
                queryClient.invalidateQueries({
                    queryKey: ["riskSource"],
                    refetchType: "all",
                });
                queryClient.refetchQueries({
                    queryKey: ["riskSource", "list"],
                });
                queryClient.refetchQueries({
                    queryKey: ["riskSource", "search"],
                });
                console.log("查询缓存刷新完成");
            }, 100);
        },
        onError: (error) => {
            console.error("创建风险源失败:", error);
            message.error("创建失败，请重试");
        },
    });

    // 更新风险源API钩子
    const updateMutation = useUpdateRiskSource({
        onSuccess: (data) => {
            console.log("更新成功，返回数据:", data);
            message.success("危险源更新成功");
            closeModal();

            // 强制刷新所有相关查询
            setTimeout(() => {
                console.log("开始刷新查询缓存...");
                queryClient.invalidateQueries({
                    queryKey: ["riskSource"],
                    refetchType: "all",
                });
                queryClient.refetchQueries({
                    queryKey: ["riskSource", "list"],
                });
                queryClient.refetchQueries({
                    queryKey: ["riskSource", "search"],
                });
                console.log("查询缓存刷新完成");
            }, 100);
        },
        onError: (error) => {
            console.error("更新风险源失败:", error);
            message.error("更新失败，请重试");
        },
    });

    /**
     * 处理表单提交
     * @param {Object} values - 表单数据
     */
    const _handleSubmit = (values) => {
        if (isEditMode) {
            updateMutation.mutate({
                riskSourceId: editingItem.riskSourceId,
                data: values,
            });
        } else {
            createMutation.mutate(values);
        }
    };

    /**
     * 处理重置（重置搜索关键字、表格筛选和输入框）
     */
    const _handleReset = () => {
        setSearchKeyword("");
        resetAll();
        message.success("已重置搜索和筛选条件");
    };

    /**
     * 手动刷新数据
     */
    const _handleRefresh = () => {
        console.log("手动刷新数据...");
        queryClient.invalidateQueries({
            queryKey: ["riskSource"],
            refetchType: "all",
        });
        message.success("数据已刷新");
    };

    return (
        <>
            <div className="flex items-center justify-between w-full">
                {/* 左侧：搜索区域 */}
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                    <Input
                        placeholder="搜索危险源..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onPressEnter={() => updateSearchKeyword(searchKeyword)}
                        size="large"
                        allowClear
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={() => updateSearchKeyword(searchKeyword)}
                        disabled={!searchKeyword.trim()}
                        variant="outlined"
                        color="default"
                    >
                        搜索
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        size="large"
                        onClick={_handleReset}
                        title="重置搜索"
                        variant="outlined"
                        color="default"
                    >
                        重置
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        size="large"
                        onClick={_handleRefresh}
                        title="刷新数据"
                        type="default"
                    >
                        刷新
                    </Button>
                </div>

                {/* 右侧：操作按钮 */}
                <div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => openModal()}
                        className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
                    >
                        新增危险源
                    </Button>
                </div>
            </div>

            {/* 新增/编辑表单模态框 */}
            <Modal
                title={isEditMode ? "编辑危险源" : "新增危险源"}
                open={modalVisible}
                onCancel={closeModal}
                footer={null}
                width={1200}
                centered
                maskClosable={false}
            >
                <AdvancedForm
                    fieldGroups={dangerSourceFormFields}
                    initialValues={isEditMode ? { ...editingItem } : {}}
                    onSubmit={_handleSubmit}
                    onCancel={closeModal}
                    loading={createMutation.isPending || updateMutation.isPending}
                    submitText={isEditMode ? "更新危险源" : "创建危险源"}
                    autoCalculateRisk={true}
                />
            </Modal>
        </>
    );
}
