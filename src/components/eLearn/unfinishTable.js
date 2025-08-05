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

    // 使用传入的数据源或默认假数据
    const tableData = dataSource;

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
            title: "姓名",
            dataIndex: "name",
            key: "name",
            align: "center",
        },
        {
            title: "工号",
            dataIndex: "employee_id",
            key: "employee_id",
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
