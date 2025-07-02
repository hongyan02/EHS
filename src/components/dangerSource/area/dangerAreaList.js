"use client";
import { useState } from "react";
import { Card, List, Button, Drawer, Spin, Alert, Popconfirm, App } from "antd";
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
import TableTransfer from "./dangerAreaTransfer";
import DangerSourceTable from "../risk/dangerSoureTable";
import { useAreaListQuery, useDeleteAreaMutation } from "@/hooks/useAreaQuery";
import { useRiskSourceListQuery } from "@/hooks/useRiskSourceQuery";
import useDangerAreaStore from "@/store/dangerAreaStore";
import { calculateRisk } from "@/lib/utils/riskCalculator";

/**
 * 危险区域列表组件
 * @returns {JSX.Element} 危险区域列表
 */
export default function DangerAreaList() {
    // App hook for message API
    const { message } = App.useApp();

    // Zustand store
    const { openModal } = useDangerAreaStore();

    // Drawer状态管理
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedArea, setSelectedArea] = useState(null);
    const [childrenDrawer, setChildrenDrawer] = useState(false);

    // 穿梭框状态管理
    const [transferTargetKeys, setTransferTargetKeys] = useState([]);
    const [transferSelectedKeys, setTransferSelectedKeys] = useState([]);

    // 使用React Query获取区域数据
    const { data: areaData = [], isLoading, error } = useAreaListQuery();

    // 获取危险源数据用于穿梭框
    const {
        data: riskSourceData = [],
        isLoading: isRiskSourceLoading,
        error: riskSourceError,
    } = useRiskSourceListQuery();

    // 调试信息：显示API数据加载情况
    console.log("API风险源数据:", {
        count: riskSourceData.length,
        loading: isRiskSourceLoading,
        error: riskSourceError,
        sampleData: riskSourceData[0], // 显示第一条数据的结构
    });

    // 删除区域的mutation
    const deleteAreaMutation = useDeleteAreaMutation();

    /**
     * 处理编辑区域操作（编辑区域基本信息）
     * @param {Object} item - 区域项目
     */
    const _handleEdit = (item) => {
        console.log("编辑区域:", item);
        // 打开编辑模态框，传入当前区域数据
        openModal(item);
    };

    /**
     * 处理危险源配置操作（打开第二级抽屉）
     * @param {Object} item - 区域项目
     */
    const _handleDangerSourceConfig = (item) => {
        console.log("配置区域危险源:", item);
        // 初始化穿梭框数据 - 假设区域已关联的危险源IDs存储在 item.associatedRiskSourceIds
        const associatedIds = item.associatedRiskSourceIds || [];
        setTransferTargetKeys(associatedIds);
        setTransferSelectedKeys([]);
        // 打开子抽屉
        setChildrenDrawer(true);
    };

    /**
     * 处理查看详情操作
     * @param {Object} item - 区域项目
     */
    const _handleViewDetail = (item) => {
        setSelectedArea(item);
        setDrawerOpen(true);
    };

    /**
     * 关闭详情Drawer
     */
    const _closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedArea(null);
        setChildrenDrawer(false); // 关闭主抽屉时也关闭子抽屉
        // 重置穿梭框状态
        setTransferTargetKeys([]);
        setTransferSelectedKeys([]);
    };

    /**
     * 关闭子抽屉
     */
    const _closeChildrenDrawer = () => {
        setChildrenDrawer(false);
        // 重置穿梭框状态
        setTransferTargetKeys([]);
        setTransferSelectedKeys([]);
    };

    /**
     * 处理删除区域操作
     * @param {string} areaId - 区域ID
     */
    const _handleDelete = (areaId) => {
        console.log("删除区域ID:", areaId);
        deleteAreaMutation.mutate(areaId);
    };

    /**
     * 处理穿梭框变化
     * @param {Array} targetKeys - 目标keys
     * @param {string} direction - 移动方向
     * @param {Array} moveKeys - 移动的keys
     */
    const _handleTransferChange = (targetKeys, direction, moveKeys) => {
        console.log("穿梭框变化:", { targetKeys, direction, moveKeys });
        setTransferTargetKeys(targetKeys);
    };

    /**
     * 处理穿梭框选择变化
     * @param {Array} sourceSelectedKeys - 源选择keys
     * @param {Array} targetSelectedKeys - 目标选择keys
     */
    const _handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setTransferSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    /**
     * 保存危险源配置
     */
    const _handleSaveRiskSourceConfig = () => {
        if (!selectedArea) return;

        console.log("保存区域危险源配置:", {
            areaId: selectedArea.areaId,
            riskSourceIds: transferTargetKeys,
        });

        // TODO: 调用API保存配置
        // 这里应该调用相应的API来保存区域与危险源的关联关系

        message.success("危险源配置保存成功");
        _closeChildrenDrawer();
    };

    // 准备穿梭框数据源，添加key字段和计算风险等级
    const transferDataSource = riskSourceData.map((item) => {
        // 计算风险等级（如果API没有返回的话）
        const riskData =
            item.l && item.s
                ? calculateRisk(item.l, item.s)
                : {
                      r: item.r || 0,
                      level: item.level || "未知",
                      isMajorRisk: item.isMajorRisk || false,
                  };

        return {
            ...item,
            key: item.id || item.riskSourceId || item.key, // 确保有唯一key
            ...riskData, // 添加计算后的风险数据
        };
    });

    // 调试信息：显示处理后的穿梭框数据
    console.log("穿梭框数据源:", {
        count: transferDataSource.length,
        sampleProcessedData: transferDataSource[0], // 显示第一条处理后的数据
    });

    // 加载状态处理
    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Spin size="large" tip="加载中...">
                    <div style={{ minHeight: "200px" }} />
                </Spin>
            </div>
        );
    }

    // 错误状态处理
    if (error) {
        return (
            <div className="w-full h-full">
                <Alert
                    message="数据加载失败"
                    description={error.message || "请稍后重试"}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <List
                itemLayout="vertical"
                size="large"
                dataSource={areaData}
                rowKey="areaId"
                renderItem={(item) => (
                    <List.Item
                        key={item.areaId}
                        actions={[
                            <Button
                                key="edit"
                                type="link"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => _handleEdit(item)}
                            >
                                编辑
                            </Button>,
                            <Button
                                key="detail"
                                type="link"
                                size="small"
                                icon={<InfoCircleOutlined />}
                                onClick={() => _handleViewDetail(item)}
                            >
                                详情
                            </Button>,
                            <Popconfirm
                                key="delete"
                                title="确认删除"
                                description={`确定要删除区域"${item.areaName}"吗？此操作不可撤销。`}
                                onConfirm={() => _handleDelete(item.areaId)}
                                okText="确定"
                                cancelText="取消"
                                okType="danger"
                            >
                                <Button
                                    type="link"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    loading={deleteAreaMutation.isPending}
                                >
                                    删除
                                </Button>
                            </Popconfirm>,
                        ]}
                    >
                        <Card title={item.areaName}>
                            <Card.Meta description={item.notes} />
                        </Card>
                    </List.Item>
                )}
                pagination={{
                    pageSize: 10,
                    total: areaData.length,
                    showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 个区域`,
                }}
            />

            {/* 区域详情Drawer */}
            <Drawer
                title={selectedArea?.areaName}
                placement="right"
                width="66.67vw"
                closable={false}
                open={drawerOpen}
                onClose={_closeDrawer}
                destroyOnHidden={true}
            >
                {selectedArea && (
                    <div className="h-full flex flex-col">
                        {/* 操作按钮 */}
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {selectedArea.areaName}
                                </h3>
                                <p className="text-sm text-gray-600">{selectedArea.notes}</p>
                            </div>
                            <Button
                                type="primary"
                                icon={<EditOutlined />}
                                onClick={() => _handleDangerSourceConfig(selectedArea)}
                                className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                            >
                                危险源配置
                            </Button>
                        </div>

                        {/* 内容区域 */}
                        <div className="flex-1 overflow-hidden">
                            {/* 危险源表格 */}
                            <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                                <DangerSourceTable
                                    dataSource={[]}
                                    loading={false}
                                    error={null}
                                    tableFilters={{}}
                                    onTableChange={() => {}}
                                    onEdit={(record) => {
                                        console.log("编辑区域危险源:", record);
                                    }}
                                    onDelete={() => {
                                        console.log("区域危险源删除成功");
                                    }}
                                />
                            </div>
                        </div>

                        {/* 子抽屉 */}
                        <Drawer
                            title="编辑区域危险源"
                            width={1200}
                            closable={false}
                            onClose={_closeChildrenDrawer}
                            open={childrenDrawer}
                            footer={
                                <div className="flex justify-end space-x-2 mb-4">
                                    <Button onClick={_closeChildrenDrawer}>取消</Button>
                                    <Button
                                        type="primary"
                                        onClick={_handleSaveRiskSourceConfig}
                                        className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                                    >
                                        保存配置
                                    </Button>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="mb-4">
                                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                                        {selectedArea?.areaName} - 危险源配置
                                    </h4>
                                    <p className="text-gray-600 text-sm mb-2">
                                        左侧为可选择的危险源，右侧为已配置的危险源。可以通过点击箭头来移动危险源。
                                    </p>
                                </div>

                                {/* 穿梭框组件 */}
                                <div className="p-4">
                                    {riskSourceError ? (
                                        <Alert
                                            message="危险源数据加载失败"
                                            description={
                                                riskSourceError.message ||
                                                "无法获取危险源数据，请稍后重试"
                                            }
                                            type="error"
                                            showIcon
                                            style={{ marginBottom: 16 }}
                                        />
                                    ) : (
                                        <Spin
                                            spinning={isRiskSourceLoading}
                                            tip="加载危险源数据..."
                                        >
                                            <TableTransfer
                                                dataSource={transferDataSource}
                                                targetKeys={transferTargetKeys}
                                                selectedKeys={transferSelectedKeys}
                                                onChange={_handleTransferChange}
                                                onSelectChange={_handleTransferSelectChange}
                                                titles={["可选危险源", "已配置危险源"]}
                                                showSearch
                                                showSelectAll
                                                searchPlaceholder="搜索危险源..."
                                                listStyle={{
                                                    width: "48%",
                                                    height: 500,
                                                }}
                                                render={(item) =>
                                                    `${
                                                        item.dangerSourceDescription || "未知危险源"
                                                    } - ${item.product || "未分类"}`
                                                }
                                            />
                                        </Spin>
                                    )}
                                </div>
                            </div>
                        </Drawer>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
