import { Drawer, Table, Tag, Button, Empty, App } from "antd";
import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import useAreaStore from "../../store/useAreaStore";
import TableTransfer from "./TableTransfer";
import { useGetAreaToRisk, useBatchAreaToRisk } from "../../queries/dangerSource/areaToRisk";
import { useGetRiskSourceList } from "../../queries/dangerSource/risk";

/**
 * 区域详情抽屉组件
 * @returns {JSX.Element} 区域详情抽屉
 */
export default function AreaDetailDrawer() {
    const { message, modal } = App.useApp();
    const {
        isDetailDrawerOpen,
        selectedArea,
        closeDetailDrawer,
        isSubDrawerOpen,
        closeSubDrawer,
        openSubDrawer,
    } = useAreaStore();

    // 表格筛选状态
    const [tableFilters, setTableFilters] = useState({});

    // 穿梭框状态
    const [targetKeys, setTargetKeys] = useState([]);

    // 获取全部危险源数据（用于穿梭框左边）
    const { data: allRiskSourceData, isLoading: isLoadingAllRiskData } = useGetRiskSourceList();

    // 获取区域关联的风险源数据（用于穿梭框右边和主表格显示）
    const { data: areaToRiskData, isLoading: isLoadingAreaRiskData } = useGetAreaToRisk(
        selectedArea?.area_id
    );

    // 批量关联区域和风险源的 mutation
    const batchAreaToRiskMutation = useBatchAreaToRisk();

    // 处理全部危险源数据（穿梭框的 dataSource）
    const allRiskSourceList = allRiskSourceData || [];
    const allDataSource = allRiskSourceList.map((item, index) => ({
        ...item,
        key: item.risk_source_id || item.id || `fallback-all-${index}`,
    }));

    // 处理区域关联的危险源数据（主表格显示）
    const areaRiskSourceList = areaToRiskData?.data || [];
    const dataSource = areaRiskSourceList.map((item, index) => ({
        ...item,
        key: item.risk_source_id || item.id || `fallback-area-${index}`,
    }));

    // 当区域变化时，更新 targetKeys（初始化右侧已关联的危险源）
    React.useEffect(() => {
        if (!selectedArea?.area_id) {
            setTargetKeys([]);
            return;
        }

        // 如果数据还在加载中，不做任何操作
        if (isLoadingAreaRiskData) {
            return;
        }

        // 数据加载完成后，设置 targetKeys（右侧显示的已关联危险源）
        if (areaToRiskData?.data && areaToRiskData.data.length > 0) {
            const keys = areaToRiskData.data.map(
                (item, index) => item.risk_source_id || item.id || `fallback-area-${index}`
            );
            setTargetKeys(keys);
        } else {
            setTargetKeys([]);
        }
    }, [selectedArea?.area_id, isLoadingAreaRiskData, areaToRiskData?.data?.length, areaToRiskData.data]);

    // 当抽屉关闭时，重置穿梭框状态
    React.useEffect(() => {
        if (!isDetailDrawerOpen) {
            setTargetKeys([]);
        }
    }, [isDetailDrawerOpen]);

    /**
     * 从数据中提取唯一值作为筛选选项
     * @param {string} field - 字段名
     * @returns {Array} 筛选选项数组
     */
    const _getFilterOptions = React.useCallback(
        (field) => {
            const uniqueValues = [
                ...new Set(
                    dataSource
                        .map((item) => item[field])
                        .filter((item) => item !== null && item !== undefined)
                ),
            ];

            // 特殊处理 level 字段
            if (field === "level") {
                const levelMap = {
                    0: "极低风险",
                    1: "低风险",
                    2: "中等风险",
                    3: "高风险",
                    4: "极高风险",
                };

                return uniqueValues.map((value) => ({
                    text: typeof value === "number" ? levelMap[value] : value,
                    value: value,
                }));
            }

            return uniqueValues.map((value) => ({
                text: value,
                value: value,
            }));
        },
        [dataSource]
    );

    /**
     * 渲染风险等级标签
     * @param {number|string} level - 风险等级（数字或字符串）
     * @returns {JSX.Element} 风险等级标签
     */
    const _renderRiskLevel = (level) => {
        // 数字等级到文字等级的映射
        const levelMap = {
            0: "极低风险",
            1: "低风险",
            2: "中等风险",
            3: "高风险",
            4: "极高风险",
        };

        const colorMap = {
            极低风险: "#52c41a",
            低风险: "#1890ff",
            中等风险: "#faad14",
            高风险: "#ff7a45",
            极高风险: "#ff4d4f",
        };

        // 如果是数字，转换为对应的文字等级
        const levelText = typeof level === "number" ? levelMap[level] : level;

        return <Tag color={colorMap[levelText] || "#d9d9d9"}>{levelText || "未知"}</Tag>;
    };

    /**
     * 渲染重大风险标签
     * @param {boolean} isMajor - 是否重大风险
     * @returns {JSX.Element} 重大风险标签
     */
    const _renderMajorRisk = (isMajor) => (
        <Tag color={isMajor ? "red" : "green"}>{isMajor ? "是" : "否"}</Tag>
    );

    /**
     * 处理穿梭框变化（只允许添加，不允许移除）
     * @param {Array} nextTargetKeys - 新的目标键数组
     */
    const _handleTransferChange = async (nextTargetKeys) => {
        if (!selectedArea?.area_id) {
            message.error("请先选择区域");
            return;
        }

        const currentKeys = targetKeys;
        const addedKeys = nextTargetKeys.filter((key) => !currentKeys.includes(key));
        const removedKeys = currentKeys.filter((key) => !nextTargetKeys.includes(key));

        // 只允许新增，不允许移除
        if (removedKeys.length > 0) {
            message.warning("不允许移除已关联的危险源");
            return;
        }

        // 如果没有新增项，直接返回
        if (addedKeys.length === 0) {
            return;
        }

        modal.confirm({
            title: "确认添加",
            content: `将新增 ${addedKeys.length} 个风险源关联到区域"${selectedArea.area_name}"，确定要继续吗？`,
            onOk: async () => {
                try {
                    // 立即更新 UI 状态
                    setTargetKeys(nextTargetKeys);

                    // 调用 API 保存更改
                    await batchAreaToRiskMutation.mutateAsync({
                        areaId: selectedArea.area_id,
                        riskSourceIds: nextTargetKeys,
                    });

                    message.success("危险源关联添加成功");
                } catch (error) {
                    console.error("添加危险源关联失败:", error);
                    message.error("添加失败，请重试");

                    // 失败时恢复到原来的状态
                    setTargetKeys(currentKeys);
                }
            },
        });
    };

    /**
     * 打开表格配置子抽屉
     */
    const _handleTableConfig = () => {
        openSubDrawer("table-config");
    };

    // 表格列配置
    const columns = [
        {
            title: "序号",
            dataIndex: "id",
            key: "id",
            width: 100,
            render: (_, __, index) => index + 1,
        },
        {
            title: "产品系列",
            dataIndex: "product",
            key: "product",
            width: 120,
            align: "center",
            filters: _getFilterOptions("product"),
            filteredValue: tableFilters.product || null,
            onFilter: (value, record) => record.product === value,
            filterSearch: true,
        },
        {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 100,
            align: "center",
            filters: _getFilterOptions("department"),
            filteredValue: tableFilters.department || null,
            onFilter: (value, record) => record.department === value,
            filterSearch: true,
        },
        {
            title: "区域",
            dataIndex: "area",
            key: "area",
            width: 100,
            align: "center",
            filters: _getFilterOptions("area"),
            filteredValue: tableFilters.area || null,
            onFilter: (value, record) => record.area === value,
            filterSearch: true,
        },
        {
            title: "工作岗位",
            dataIndex: "work_position",
            key: "work_position",
            width: 120,
            align: "center",
            filters: _getFilterOptions("work_position"),
            filteredValue: tableFilters.work_position || null,
            onFilter: (value, record) => record.work_position === value,
            filterSearch: true,
        },
        {
            title: "作业活动",
            dataIndex: "work_activity",
            key: "work_activity",
            width: 150,
            align: "center",
            filters: _getFilterOptions("work_activity"),
            filteredValue: tableFilters.work_activity || null,
            onFilter: (value, record) => record.work_activity === value,
            filterSearch: true,
        },
        {
            title: "危险源辨识",
            children: [
                {
                    title: "危险源描述",
                    dataIndex: "danger_source_description",
                    key: "danger_source_description",
                    width: 200,
                    align: "center",
                    ellipsis: true,
                },
                {
                    title: "可能导致的事故",
                    dataIndex: "possible_accident",
                    key: "possible_accident",
                    width: 150,
                    align: "center",
                    ellipsis: true,
                },
                {
                    title: "事故案例",
                    dataIndex: "accident_case",
                    key: "accident_case",
                    width: 150,
                    align: "center",
                    ellipsis: true,
                },
            ],
        },
        {
            title: "职业病危害因素",
            dataIndex: "occupational_disease",
            key: "occupational_disease",
            width: 150,
            align: "center",
            ellipsis: true,
        },
        {
            title: "固有风险",
            children: [
                {
                    title: "L",
                    dataIndex: "l",
                    key: "l",
                    width: 60,
                    align: "center",
                },
                {
                    title: "S",
                    dataIndex: "s",
                    key: "s",
                    width: 60,
                    align: "center",
                },
                {
                    title: "R",
                    dataIndex: "r",
                    key: "r",
                    width: 60,
                    align: "center",
                },
                {
                    title: "风险等级",
                    dataIndex: "level",
                    key: "level",
                    width: 120,
                    align: "center",
                    render: _renderRiskLevel,
                    filters: _getFilterOptions("level"),
                    filteredValue: tableFilters.level || null,
                    onFilter: (value, record) => record.level === value,
                    filterSearch: true,
                },
            ],
        },
        {
            title: "是否重大风险",
            dataIndex: "is_major_risk",
            key: "is_major_risk",
            width: 150,
            align: "center",
            render: _renderMajorRisk,
            filters: [
                { text: "是", value: true },
                { text: "否", value: false },
            ],
            filteredValue: tableFilters.is_major_risk || null,
            onFilter: (value, record) => record.is_major_risk === value,
        },
        {
            title: "当前控制措施",
            dataIndex: "current_control_measures",
            key: "current_control_measures",
            width: 200,
            align: "center",
            ellipsis: true,
        },
    ];

    return (
        <Drawer
            title={
                <div className="flex items-center justify-between">
                    <span>{selectedArea?.area_name}</span>
                    <Button type="text" icon={<CloseOutlined />} onClick={closeDetailDrawer} />
                </div>
            }
            placement="bottom"
            height="66vh"
            open={isDetailDrawerOpen}
            onClose={closeDetailDrawer}
            closable={false}
            styles={{ body: { padding: "24px" } }}
        >
            {/* 表格配置按钮区域 */}
            <div className="mb-4 flex justify-end py-2">
                <Button
                    type="primary"
                    icon={<SettingOutlined />}
                    onClick={_handleTableConfig}
                    size="small"
                >
                    配置表格
                </Button>
            </div>

            <Table
                rowKey="risk_source_id"
                dataSource={dataSource}
                columns={columns}
                loading={isLoadingAreaRiskData}
                pagination={false}
                scroll={{ x: "max-content" }}
                locale={{ emptyText: <Empty description="暂无数据" /> }}
                size="middle"
                bordered
                className="w-full"
            />

            {/* 嵌套的子抽屉 */}
            <Drawer
                title="表格配置"
                width="100%"
                height="80vh"
                placement="bottom"
                closable={false}
                onClose={closeSubDrawer}
                open={isSubDrawerOpen}
                maskClosable={true}
            >
                <TableTransfer
                    dataSource={allDataSource}
                    targetKeys={targetKeys}
                    onChange={_handleTransferChange}
                    loading={isLoadingAllRiskData || batchAreaToRiskMutation.isPending}
                />
            </Drawer>
        </Drawer>
    );
}
