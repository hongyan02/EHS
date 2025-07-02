"use client";
import { useState } from "react";
import { Button, Modal, Input } from "antd";
import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import BaseForm from "@/components/common/BaseForm";
import { areaFormFields } from "@/config/formFields";
import { useCreateAreaMutation, useUpdateAreaMutation } from "@/hooks/useAreaQuery";
import useDangerAreaStore from "@/store/dangerAreaStore";

/**
 * 危险区域操作栏组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onDataChange - 数据变更回调函数
 * @returns {JSX.Element} 危险区域操作栏组件
 */
export default function DangerAreaActionBar({ onDataChange }) {
    const {
        searchParams,
        setSearchParams,
        resetSearchParams,
        setLoading,
        modalVisible,
        editingItem,
        openModal,
        closeModal,
    } = useDangerAreaStore();

    const [searchKeyword, setSearchKeyword] = useState(searchParams.keyword || "");

    // 判断是否为编辑模式
    const isEditMode = !!editingItem;

    // 创建区域的mutation
    const createAreaMutation = useCreateAreaMutation({
        onSuccess: () => {
            closeModal();
            // 通知父组件数据已变更
            if (onDataChange) {
                onDataChange();
            }
        },
    });

    // 更新区域的mutation
    const updateAreaMutation = useUpdateAreaMutation({
        onSuccess: () => {
            closeModal();
            // 通知父组件数据已变更
            if (onDataChange) {
                onDataChange();
            }
        },
    });

    /**
     * 处理搜索
     */
    const _handleSearch = () => {
        setLoading(true);
        setSearchParams({ keyword: searchKeyword.trim() });
        console.log("搜索区域:", searchKeyword.trim());
    };

    /**
     * 处理重置
     */
    const _handleReset = () => {
        setSearchKeyword("");
        setLoading(true);
        resetSearchParams();
        console.log("重置区域搜索");
    };

    /**
     * 处理键盘事件
     */
    const _handleKeyPress = (e) => {
        if (e.key === "Enter") {
            _handleSearch();
        }
    };

    /**
     * 显示新增表单
     */
    const _showModal = () => {
        openModal();
    };

    /**
     * 隐藏表单
     */
    const _hideModal = () => {
        closeModal();
    };

    /**
     * 处理表单提交
     */
    const _handleSubmit = async (values) => {
        console.log("提交区域数据:", values);

        if (isEditMode) {
            // 编辑模式
            updateAreaMutation.mutate({
                areaId: editingItem.areaId,
                data: values,
            });
        } else {
            // 新增模式
            createAreaMutation.mutate(values);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between w-full">
                {/* 左侧：搜索区域 */}
                <div className="flex items-center gap-3 flex-1 max-w-lg">
                    <Input
                        placeholder="搜索区域..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onPressEnter={_handleKeyPress}
                        size="large"
                        allowClear
                        className="flex-1"
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        size="large"
                        onClick={_handleSearch}
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
                </div>

                {/* 右侧：操作按钮 */}
                <div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={_showModal}
                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                    >
                        新增区域
                    </Button>
                </div>
            </div>

            {/* 新增/编辑表单模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        {isEditMode ? "编辑区域" : "新增区域"}
                    </div>
                }
                open={modalVisible}
                onCancel={_hideModal}
                footer={null}
                width={600}
                destroyOnHidden
                centered
                maskClosable={false}
            >
                <BaseForm
                    fields={areaFormFields}
                    initialValues={isEditMode ? editingItem : {}}
                    onSubmit={_handleSubmit}
                    onCancel={_hideModal}
                    loading={createAreaMutation.isPending || updateAreaMutation.isPending}
                    submitText={isEditMode ? "更新区域" : "新增区域"}
                />
            </Modal>
        </>
    );
}
