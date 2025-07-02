"use client";
import { Table, Tag, Button, Popconfirm, Space, App } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDeleteRiskSource } from "@/hooks/useRiskSourceQuery";

/**
 * 危险源表格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.dataSource - 表格数据源
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onEdit - 编辑回调函数
 * @param {Function} props.onDelete - 删除回调函数
 * @param {Object} props.tableFilters - 表格筛选状态
 * @param {Function} props.onTableChange - 表格变化回调
 * @param {string} props.error - 错误信息
 * @returns {JSX.Element} 危险源表格
 */
export default function DangerSourceTable({
    dataSource = [],
    loading = false,
    onEdit,
    onDelete,
    tableFilters = {},
    onTableChange,
    error,
}) {
    const { message } = App.useApp();

    // 删除风险源
    const deleteMutation = useDeleteRiskSource({
        onSuccess: () => {
            message.success("危险源删除成功");
            // 调用父组件的删除回调
            onDelete?.();
        },
        onError: (error) => {
            console.error("删除危险源失败:", error);
            message.error("删除失败，请重试");
        },
    });

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
     * 处理编辑危险源
     * @param {Object} record - 当前行数据
     */
    const _handleEdit = (record) => {
        console.log("编辑危险源，当前行数据:", record);
        onEdit?.(record);
    };

    /**
     * 处理删除危险源
     * @param {string} riskSourceId - 风险源ID
     */
    const _handleDelete = (riskSourceId) => {
        deleteMutation.mutate(riskSourceId);
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
     * 渲染操作列
     * @param {Object} record - 当前行数据
     * @returns {JSX.Element} 操作按钮
     */
    const _renderAction = (_, record) => (
        <Space size="small">
            <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => _handleEdit(record)}
                size="small"
            >
                编辑
            </Button>
            <Popconfirm
                title="确认删除"
                description="确定要删除这个危险源吗？此操作不可撤销。"
                onConfirm={() => _handleDelete(record.riskSourceId)}
                okText="确定"
                cancelText="取消"
                okType="danger"
            >
                <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deleteMutation.isPending}
                    size="small"
                >
                    删除
                </Button>
            </Popconfirm>
        </Space>
    );

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
            filters: _getFilterOptions("area"),
            filteredValue: tableFilters.area || null,
            onFilter: (value, record) => record.area === value,
            filterSearch: true,
        },
        {
            title: "工作岗位",
            dataIndex: "workPosition",
            key: "workPosition",
            width: 120,
            filters: _getFilterOptions("workPosition"),
            filteredValue: tableFilters.workPosition || null,
            onFilter: (value, record) => record.workPosition === value,
            filterSearch: true,
        },
        {
            title: "作业活动",
            dataIndex: "workActivity",
            key: "workActivity",
            width: 150,
            filters: _getFilterOptions("workActivity"),
            filteredValue: tableFilters.workActivity || null,
            onFilter: (value, record) => record.workActivity === value,
            filterSearch: true,
        },
        {
            title: "危险源辨识",
            children: [
                {
                    title: "危险源描述",
                    dataIndex: "dangerSourceDescription",
                    key: "dangerSourceDescription",
                    width: 200,
                    ellipsis: true,
                },
                {
                    title: "可能导致的事故",
                    dataIndex: "possibleAccident",
                    key: "possibleAccident",
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: "事故案例",
                    dataIndex: "accidentCase",
                    key: "accidentCase",
                    width: 150,
                    ellipsis: true,
                },
            ],
        },
        {
            title: "职业病危害因素",
            dataIndex: "occupationalDisease",
            key: "occupationalDisease",
            width: 120,
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
                    width: 100,
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
            width: 120,
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
            dataIndex: "currentControlMeasures",
            key: "currentControlMeasures",
            width: 200,
            ellipsis: true,
        },
        {
            title: "操作",
            dataIndex: "action",
            key: "action",
            width: 120,
            align: "center",
            render: _renderAction,
        },
    ];

    if (error) {
        return (
            <div className="flex justify-center items-center h-32">
                <span className="text-red-500">数据加载失败，请重试</span>
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto">
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={(record) => record.riskSourceId}
                loading={loading}
                onChange={onTableChange}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showSizeChanger: false,
                    showQuickJumper: false,
                    showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                    size: "small",
                }}
                bordered
                size="middle"
                scroll={{
                    x: "max-content",
                    y: "calc(100vh - 280px)",
                }}
                className="h-full custom-table"
                style={{ minWidth: "100%" }}
            />
        </div>
    );
}
