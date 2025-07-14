"use client";
import { Table } from "antd";
import { useState } from "react";

/**
 * 未完成人员表格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.dataSource - 表格数据源，格式为API返回的uncompleted_users数组
 * @returns {JSX.Element} 表格组件
 */
export default function UnfinishTable({ dataSource }) {
    const [filters, setFilters] = useState({});
    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
    });

    // 假数据 - 未完成人员列表
    const mockData = [
        {
            index: 1,
            jobNumber: "EMP001",
            name: "陈明",
            department: "工程部",
            status: "未开始",
        },
        {
            index: 2,
            jobNumber: "EMP045",
            name: "刘华",
            department: "工程部",
            status: "进行中",
        },
        {
            index: 3,
            jobNumber: "EMP089",
            name: "王强",
            department: "品质部",
            status: "未开始",
        },
        {
            index: 4,
            jobNumber: "EMP123",
            name: "李娜",
            department: "工艺部",
            status: "进行中",
        },
        {
            index: 5,
            jobNumber: "EMP156",
            name: "张伟",
            department: "工艺部",
            status: "未开始",
        },
        {
            index: 6,
            jobNumber: "EMP234",
            name: "赵敏",
            department: "运营部",
            status: "进行中",
        },
        {
            index: 7,
            jobNumber: "EMP267",
            name: "孙杰",
            department: "运营部",
            status: "未开始",
        },
        {
            index: 8,
            jobNumber: "EMP301",
            name: "周丽",
            department: "安全环境部",
            status: "未开始",
        },
        {
            index: 9,
            jobNumber: "EMP345",
            name: "吴峰",
            department: "运营部",
            status: "进行中",
        },
        {
            index: 10,
            jobNumber: "EMP389",
            name: "郑雪",
            department: "工程部",
            status: "未开始",
        },
        {
            index: 11,
            jobNumber: "EMP412",
            name: "马林",
            department: "品质部",
            status: "进行中",
        },
        {
            index: 12,
            jobNumber: "EMP456",
            name: "何静",
            department: "工艺部",
            status: "未开始",
        },
    ];

    // 使用传入的数据源或默认假数据
    const tableData = dataSource || mockData;

    /**
     * 从数据中提取唯一值作为筛选选项
     * @param {string} field - 字段名
     * @returns {Array} 筛选选项数组
     */
    const _getFilterOptions = (field) => {
        if (!tableData || !Array.isArray(tableData)) {
            return [];
        }
        const uniqueValues = [...new Set(tableData.map((item) => item[field]).filter(Boolean))];
        return uniqueValues.map((value) => ({
            text: value,
            value: value,
        }));
    };

    /**
     * 处理表格变化（分页、筛选、排序）
     * @param {Object} paginationInfo - 分页信息
     * @param {Object} filters - 筛选条件
     * @param {Object} sorter - 排序信息
     */
    const _handleTableChange = (paginationInfo, filters, sorter) => {
        setFilters(filters);
        setPagination(paginationInfo);
    };

    const columns = [
        {
            title: "序号",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (text, record, index) => {
                // 计算跨页的正确序号
                return (pagination.current - 1) * pagination.pageSize + index + 1;
            },
        },
        {
            title: "工号",
            dataIndex: "employee_id",
            key: "employee_id",
            align: "center",
        },
        {
            title: "姓名",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: "部门",
            dataIndex: "primary_dept",
            key: "primary_dept",
            filters: _getFilterOptions("primary_dept"),
            filteredValue: filters.primary_dept || null,
            onFilter: (value, record) => record.primary_dept === value,
            filterSearch: true,
            align: "center",
        },
        {
            title: "完成情况",
            dataIndex: "progress",
            key: "progress",
            align: "center",
            render: (progress, record) => {
                if (record.is_completed) {
                    return "已完成";
                } else if (progress > 0) {
                    return `进行中 (${progress}%)`;
                } else {
                    return "未开始";
                }
            },
        },
    ];

    return (
        <Table
            dataSource={tableData}
            columns={columns}
            bordered={true}
            pagination={pagination}
            onChange={_handleTableChange}
            rowKey="employee_id"
        />
    );
}
