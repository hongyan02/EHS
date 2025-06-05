"use client";
import { useState } from "react";
import { Button, Modal, Input, message } from "antd";
import { PlusOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import DangerSourceForm from "./danger-source-form";
import useDangerSourceStore from "@/store/danger-source-store";
import { useAddDangerSourceMutation } from "@/hooks/use-danger-source-query";

/**
 * 危险源操作栏组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onDataChange - 数据变更回调函数
 * @returns {JSX.Element} 危险源操作栏组件
 */
export default function DangerSourceActionBar({ onDataChange }) {
    const { searchParams, setSearchParams, resetSearchParams, setLoading } = useDangerSourceStore();

    const [searchKeyword, setSearchKeyword] = useState(searchParams.keyword);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // 使用mutation hook
    const addMutation = useAddDangerSourceMutation();

    /**
     * 处理搜索
     */
    const _handleSearch = () => {
        setLoading(true);
        setSearchParams({ keyword: searchKeyword.trim() });
    };

    /**
     * 处理重置
     */
    const _handleReset = () => {
        setSearchKeyword("");
        setLoading(true);
        resetSearchParams();
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
        setIsModalVisible(true);
    };

    /**
     * 隐藏表单
     */
    const _hideModal = () => {
        setIsModalVisible(false);
    };

    /**
     * 处理表单提交
     */
    const _handleSubmit = async (values) => {
        try {
            await addMutation.mutateAsync(values);
            message.success("危险源新增成功！");
            _hideModal();

            // 通知父组件数据已变更
            if (onDataChange) {
                onDataChange();
            }
        } catch (error) {
            message.error("新增失败，请重试！");
        }
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
                        className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
                    >
                        新增危险源
                    </Button>
                </div>
            </div>

            {/* 新增表单模态框 */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <PlusOutlined className="text-green-500" />
                        新增危险源
                    </div>
                }
                open={isModalVisible}
                onCancel={_hideModal}
                footer={null}
                width={1200}
                destroyOnHidden
                centered
                maskClosable={false}
            >
                <DangerSourceForm
                    onSubmit={_handleSubmit}
                    onCancel={_hideModal}
                    loading={addMutation.isPending}
                />
            </Modal>
        </>
    );
}
