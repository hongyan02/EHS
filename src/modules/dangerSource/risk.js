"use client";
import { Input, Button, Table, Tooltip, Tag, message, Modal } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import {
    useGetRiskSourceList,
    useAddRiskSource,
    useDeleteRiskSource,
    useEditRiskSource,
    useSearchRiskSource,
} from "@/queries/dangerSource/risk";
import AddRiskModal from "@/components/risk/AddRiskModal";

export default function Risk() {
    // 表格筛选状态
    const [tableFilters, setTableFilters] = useState({});
    // 模态框显示状态
    const [modalVisible, setModalVisible] = useState(false);
    // 编辑模式状态
    const [editMode, setEditMode] = useState(false);
    // 当前编辑的数据
    const [currentEditData, setCurrentEditData] = useState(null);
    // 搜索输入框的值
    const [searchInput, setSearchInput] = useState("");
    // 当前搜索关键字（用于触发查询）
    const [searchKeyword, setSearchKeyword] = useState("");

    // 获取完整列表和搜索结果
    const { data: allData, isLoading: isLoadingAll } = useGetRiskSourceList();
    const { data: searchData, isLoading: isLoadingSearch } = useSearchRiskSource(searchKeyword);

    const addMutation = useAddRiskSource();
    const deleteMutation = useDeleteRiskSource();
    const editMutation = useEditRiskSource();

    // 根据是否有搜索关键字决定数据源和加载状态
    const data = searchKeyword ? searchData : allData;
    const isLoading = searchKeyword ? isLoadingSearch : isLoadingAll;
    // 数据源 - 从API响应中提取数据数组
    const dataSource = data || [];

    /**
     * 从数据中提取唯一值作为筛选选项
     * @param {string} field - 字段名
     * @returns {Array} 筛选选项数组
     */
    const _getFilterOptions = (field) => {
        const uniqueValues = [...new Set(dataSource.map((item) => item[field]).filter(Boolean))];
        return uniqueValues.map((value) => ({
            text: value,
            value: value,
        }));
    };

    /**
     * 渲染风险等级标签
     * @param {string} level - 风险等级
     * @returns {JSX.Element} 风险等级标签
     */
    const _renderRiskLevel = (level) => {
        const colorMap = {
            极低风险: "#52c41a",
            低风险: "#1890ff",
            中等风险: "#faad14",
            高风险: "#ff7a45",
            极高风险: "#ff4d4f",
        };
        return <Tag color={colorMap[level] || "#d9d9d9"}>{level}</Tag>;
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
     * 渲染操作按钮
     * @param {Object} record - 表格行数据
     * @returns {JSX.Element} 操作按钮
     */
    const _renderAction = (_, record) => (
        <div className="flex gap-2">
            <Button type="link" size="small">
                查看
            </Button>
            <Button type="link" size="small" onClick={() => _handleEdit(record)}>
                编辑
            </Button>
            <Button
                type="link"
                size="small"
                danger
                onClick={() => _handleDelete(record)}
                loading={deleteMutation.isPending}
            >
                删除
            </Button>
        </div>
    );

    /**
     * 打开添加模态框
     */
    const _handleAdd = () => {
        setEditMode(false);
        setCurrentEditData(null);
        setModalVisible(true);
    };

    /**
     * 打开编辑模态框
     * @param {Object} record - 要编辑的记录
     */
    const _handleEdit = (record) => {
        setEditMode(true);
        setCurrentEditData(record);
        setModalVisible(true);
    };

    /**
     * 关闭模态框
     */
    const _handleCancel = () => {
        setModalVisible(false);
        setEditMode(false);
        setCurrentEditData(null);
    };

    /**
     * 处理搜索确认
     */
    const _handleSearch = () => {
        if (searchInput.trim()) {
            setSearchKeyword(searchInput.trim());
            setTableFilters({}); // 清空表格筛选，避免与搜索冲突
        } else {
            message.warning("请输入搜索关键字");
        }
    };

    /**
     * 处理重置
     */
    const _handleReset = () => {
        setSearchInput(""); // 清空搜索框
        setSearchKeyword(""); // 清空搜索关键字，回到完整列表
        setTableFilters({}); // 清空表格筛选
    };

    /**
     * 处理表格变化（分页、排序、筛选等）
     * @param {Object} pagination - 分页信息
     * @param {Object} filters - 筛选信息
     * @param {Object} sorter - 排序信息
     */
    const _handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    /**
     * 检查是否有活跃的筛选
     * @returns {boolean} 是否有筛选条件
     */
    const _hasActiveFilters = () => {
        return (
            Object.keys(tableFilters).length > 0 &&
            Object.values(tableFilters).some((filter) => filter && filter.length > 0)
        );
    };

    /**
     * 处理表单提交
     * @param {Object} riskData - 风险源数据或编辑数据对象
     */
    const _handleSubmit = async (riskData) => {
        try {
            if (editMode) {
                // 编辑模式
                await editMutation.mutateAsync(riskData);
                message.success("风险源更新成功！");
            } else {
                // 新增模式
                await addMutation.mutateAsync(riskData);
                message.success("风险源添加成功！");
            }
            setModalVisible(false);
            setEditMode(false);
            setCurrentEditData(null);
        } catch (error) {
            console.error(editMode ? "更新风险源失败:" : "添加风险源失败:", error);
            message.error(editMode ? "更新风险源失败，请重试" : "添加风险源失败，请重试");
        }
    };

    /**
     * 处理删除操作
     * @param {Object} record - 要删除的记录
     */
    const _handleDelete = (record) => {
        Modal.confirm({
            title: "确认删除",
            content: `确定要删除这个风险源吗？此操作不可撤销。`,
            okText: "确认删除",
            cancelText: "取消",
            okType: "danger",
            icon: <DeleteOutlined />,
            onOk: async () => {
                try {
                    await deleteMutation.mutateAsync(record.risk_source_id);
                    message.success("风险源删除成功！");
                } catch (error) {
                    console.error("删除风险源失败:", error);
                    message.error("删除风险源失败，请重试");
                }
            },
        });
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
            dataIndex: "isMajorRisk",
            key: "isMajorRisk",
            width: 150,
            align: "center",
            render: _renderMajorRisk,
            filters: [
                { text: "是", value: true },
                { text: "否", value: false },
            ],
            filteredValue: tableFilters.isMajorRisk || null,
            onFilter: (value, record) => record.isMajorRisk === value,
        },
        {
            title: "当前控制措施",
            dataIndex: "current_control_measures",
            key: "current_control_measures",
            width: 200,
            align: "center",
            ellipsis: true,
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            width: 160,
            align: "center",
            render: _renderAction,
        },
    ];
    return (
        <div className="w-full h-full">
            <div className="p-4 flex justify-start items-center gap-2 h-20 w-full bg-white rounded-lg">
                <div className="flex justify-center items-center h-full w-1/5">
                    <Input
                        type="text"
                        size="large"
                        placeholder="请输入要查询的内容"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onPressEnter={_handleSearch}
                    />
                </div>
                <Button
                    type="primary"
                    size="large"
                    onClick={_handleSearch}
                    loading={isLoadingSearch}
                >
                    <SearchOutlined />
                    确认
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={_handleReset}
                    title="清除搜索和所有筛选条件"
                >
                    <ReloadOutlined />
                    重置
                </Button>
                <Button type="dashed" color="primary" size="large" onClick={_handleAdd}>
                    <PlusOutlined />
                    添加
                </Button>
            </div>

            <div className="p-4 w-full h-full">
                <Table
                    rowKey="risk_source_id"
                    loading={isLoading}
                    dataSource={dataSource}
                    columns={columns}
                    size="middle"
                    scroll={{ x: 1840, y: 500 }}
                    locale={{
                        emptyText: searchKeyword
                            ? "未找到匹配的风险源，请尝试其他关键字"
                            : "暂无数据，请添加",
                    }}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total, range) =>
                            `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                        size: "middle",
                    }}
                    onChange={_handleTableChange}
                />
            </div>

            {/* 添加/编辑风险源模态框 */}
            <AddRiskModal
                visible={modalVisible}
                onCancel={_handleCancel}
                onSubmit={_handleSubmit}
                loading={editMode ? editMutation.isPending : addMutation.isPending}
                editMode={editMode}
                initialData={currentEditData}
            />
        </div>
    );
}
