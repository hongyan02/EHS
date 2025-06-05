"use client";
import { Table, Tag } from "antd";

/**
 * 事故事件台账表格组件
 * @returns {JSX.Element} 表格组件
 */
export default function LedgerTable() {
    /**
     * 事故状态选项
     */
    const STATUS_OPTIONS = [
        { text: "已完成", value: "已完成" },
        { text: "进行中", value: "进行中" },
        { text: "待处理", value: "待处理" },
        { text: "已关闭", value: "已关闭" },
    ];

    /**
     * 事故类型选项
     */
    const TYPE_OPTIONS = [
        { text: "日常检查", value: "日常检查" },
        { text: "风险排查", value: "风险排查" },
        { text: "事故处理", value: "事故处理" },
        { text: "隐患整改", value: "隐患整改" },
    ];

    /**
     * 渲染状态标签
     * @param {string} status - 状态值
     * @returns {JSX.Element} 状态标签
     */
    const _renderStatus = (status) => {
        const statusColors = {
            已完成: "success",
            进行中: "warning",
            待处理: "default",
            已关闭: "default",
        };

        return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
    };

    /**
     * 渲染类型标签
     * @param {string} category - 类型值
     * @returns {JSX.Element} 类型标签
     */
    const _renderCategory = (category) => {
        return <Tag color="blue">{category}</Tag>;
    };

    /**
     * 渲染操作按钮
     * @param {Object} record - 行数据
     * @returns {JSX.Element} 操作按钮
     */
    const _renderActions = (_, record) => (
        <div className="flex gap-2 justify-center">
            <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                    e.preventDefault();
                    console.log("查看记录:", record);
                }}
            >
                查看
            </a>
            <span className="text-gray-300">|</span>
            <a
                href="#"
                className="text-blue-600 hover:text-blue-800 text-sm"
                onClick={(e) => {
                    e.preventDefault();
                    console.log("编辑记录:", record);
                }}
            >
                编辑
            </a>
        </div>
    );

    /**
     * 表格列配置
     */
    const columns = [
        {
            title: "序号",
            dataIndex: "id",
            key: "id",
            width: 60,
            align: "center",
        },
        {
            title: "记录日期",
            dataIndex: "date",
            key: "date",
            width: 120,
            align: "center",
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
            minWidth: 200,
        },
        {
            title: "类型",
            dataIndex: "category",
            key: "category",
            width: 120,
            align: "center",
            filters: TYPE_OPTIONS,
            onFilter: (value, record) => record.category === value,
            render: _renderCategory,
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 100,
            align: "center",
            filters: STATUS_OPTIONS,
            onFilter: (value, record) => record.status === value,
            render: _renderStatus,
        },
        {
            title: "操作",
            key: "action",
            width: 120,
            align: "center",
            render: _renderActions,
        },
    ];

    /**
     * 表格数据源
     */
    const dataSource = [
        {
            key: "1",
            id: 1,
            date: "2024-01-15",
            title: "车间设备安全检查记录 - 发现潜在隐患需要整改",
            category: "日常检查",
            status: "已完成",
        },
        {
            key: "2",
            id: 2,
            date: "2024-01-16",
            title: "高危作业区域风险排查 - 电气设备老化问题",
            category: "风险排查",
            status: "进行中",
        },
        {
            key: "3",
            id: 3,
            date: "2024-01-17",
            title: "员工轻微工伤事故处理及后续跟进",
            category: "事故处理",
            status: "已完成",
        },
        {
            key: "4",
            id: 4,
            date: "2024-01-18",
            title: "消防通道堵塞隐患整改方案制定",
            category: "隐患整改",
            status: "待处理",
        },
        {
            key: "5",
            id: 5,
            date: "2024-01-19",
            title: "化学品存储区域安全检查",
            category: "日常检查",
            status: "进行中",
        },
        {
            key: "6",
            id: 6,
            date: "2024-01-20",
            title: "电气设备维护记录及安全验收",
            category: "隐患整改",
            status: "已完成",
        },
        {
            key: "7",
            id: 7,
            date: "2024-01-21",
            title: "员工安全培训记录及考核结果",
            category: "日常检查",
            status: "已完成",
        },
        {
            key: "8",
            id: 8,
            date: "2024-01-22",
            title: "机械设备安全检查及维护计划",
            category: "风险排查",
            status: "进行中",
        },
        {
            key: "9",
            id: 9,
            date: "2024-01-23",
            title: "环境污染事件应急处理记录",
            category: "事故处理",
            status: "待处理",
        },
        {
            key: "10",
            id: 10,
            date: "2024-01-24",
            title: "安全标识更新维护及验收确认",
            category: "隐患整改",
            status: "已完成",
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{
                pageSize: 20, // 增加每页显示数量
                showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
                size: "small",
            }}
            bordered={false}
            size="middle"
            scroll={{
                x: 800,
                y: "calc(100vh - 280px)", // 设置固定高度，减去头部和搜索区域的高度
            }}
            className="h-full"
        />
    );
}
