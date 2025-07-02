// components/TableTransfer.jsx
import React from "react";
import { Table, Transfer, Tag } from "antd";

/**
 * 渲染风险等级标签
 * @param {string} level - 风险等级
 * @returns {JSX.Element} 风险等级标签
 */
const _renderRiskLevel = (level) => {
    const config = {
        极高风险: { color: "red", text: "极高" },
        高风险: { color: "orange", text: "高" },
        中等风险: { color: "gold", text: "中等" },
        低风险: { color: "green", text: "低" },
    };

    const { color, text } = config[level] || { color: "default", text: level };
    return <Tag color={color}>{text}</Tag>;
};

/**
 * 渲染重大风险标识
 * @param {boolean} isMajorRisk - 是否重大风险
 * @returns {JSX.Element} 重大风险标识
 */
const _renderMajorRisk = (isMajorRisk) => {
    return isMajorRisk ? <Tag color="red">重大</Tag> : <Tag color="default">一般</Tag>;
};

/**
 * 获取过滤选项
 * @param {Array} dataSource - 数据源
 * @param {string} field - 字段名
 * @returns {Array} 过滤选项
 */
const _getFilterOptions = (dataSource, field) => {
    if (!dataSource || !Array.isArray(dataSource)) return [];

    const uniqueValues = [...new Set(dataSource.map((item) => item[field]).filter(Boolean))];
    return uniqueValues.map((value) => ({
        text: value,
        value: value,
    }));
};

/**
 * 默认左侧列配置（可选择的危险源）
 * @param {Array} dataSource - 数据源，用于生成过滤选项
 * @returns {Array} 列配置
 */
const getDefaultLeftColumns = (dataSource = []) => [
    {
        title: "危险源描述",
        dataIndex: "dangerSourceDescription",
        key: "dangerSourceDescription",
        width: 200,
        ellipsis: true,
    },
    {
        title: "产品系列",
        dataIndex: "product",
        key: "product",
        width: 100,
        filters: _getFilterOptions(dataSource, "product"),
        onFilter: (value, record) => record.product === value,
        filterSearch: true,
    },
    {
        title: "部门",
        dataIndex: "department",
        key: "department",
        width: 80,
        filters: _getFilterOptions(dataSource, "department"),
        onFilter: (value, record) => record.department === value,
        filterSearch: true,
    },
    {
        title: "工作岗位",
        dataIndex: "workPosition",
        key: "workPosition",
        width: 100,
        filters: _getFilterOptions(dataSource, "workPosition"),
        onFilter: (value, record) => record.workPosition === value,
        filterSearch: true,
    },
    {
        title: "风险等级",
        dataIndex: "level",
        key: "level",
        width: 80,
        align: "center",
        render: _renderRiskLevel,
        filters: _getFilterOptions(dataSource, "level"),
        onFilter: (value, record) => record.level === value,
        filterSearch: true,
    },
    {
        title: "重大风险",
        dataIndex: "isMajorRisk",
        key: "isMajorRisk",
        width: 80,
        align: "center",
        render: _renderMajorRisk,
        filters: [
            { text: "是", value: true },
            { text: "否", value: false },
        ],
        onFilter: (value, record) => record.isMajorRisk === value,
    },
];

/**
 * 默认右侧列配置（已选择的危险源）
 * @param {Array} dataSource - 数据源，用于生成过滤选项
 * @returns {Array} 列配置
 */
const getDefaultRightColumns = (dataSource = []) => [
    {
        title: "危险源描述",
        dataIndex: "dangerSourceDescription",
        key: "dangerSourceDescription",
        width: 200,
        ellipsis: true,
    },
    {
        title: "产品系列",
        dataIndex: "product",
        key: "product",
        width: 100,
    },
    {
        title: "部门",
        dataIndex: "department",
        key: "department",
        width: 80,
    },
    {
        title: "风险等级",
        dataIndex: "level",
        key: "level",
        width: 80,
        align: "center",
        render: _renderRiskLevel,
    },
    {
        title: "重大风险",
        dataIndex: "isMajorRisk",
        key: "isMajorRisk",
        width: 80,
        align: "center",
        render: _renderMajorRisk,
    },
];

/**
 * 表格穿梭框组件
 * @param {Object} props - 组件属性
 * @param {Array} props.leftColumns - 左侧表格列配置
 * @param {Array} props.rightColumns - 右侧表格列配置
 * @param {Array} props.dataSource - 数据源
 * @param {Array} props.targetKeys - 目标keys
 * @param {Function} props.onChange - 变化回调
 * @returns {JSX.Element} 表格穿梭框组件
 */
const TableTransfer = (props) => {
    const { leftColumns, rightColumns, dataSource = [], ...restProps } = props;

    // 使用传入的列配置或默认配置
    const finalLeftColumns = leftColumns || getDefaultLeftColumns(dataSource);
    const finalRightColumns = rightColumns || getDefaultRightColumns(dataSource);

    const transferProps = Object.fromEntries(
        Object.entries(restProps).filter(
            ([key]) => !["leftColumns", "rightColumns", "dataSource"].includes(key)
        )
    );

    return (
        <Transfer style={{ width: "100%" }} dataSource={dataSource} {...transferProps}>
            {({
                direction,
                filteredItems,
                onItemSelect,
                onItemSelectAll,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled,
            }) => {
                const columns = direction === "left" ? finalLeftColumns : finalRightColumns;
                const rowSelection = {
                    getCheckboxProps: () => ({ disabled: listDisabled }),
                    onChange(selectedRowKeys) {
                        onItemSelectAll(selectedRowKeys, "replace");
                    },
                    selectedRowKeys: listSelectedKeys,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                };

                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={filteredItems}
                        size="small"
                        style={{ pointerEvents: listDisabled ? "none" : undefined }}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: () => {
                                if (itemDisabled || listDisabled) return;
                                onItemSelect(key, !listSelectedKeys.includes(key));
                            },
                        })}
                        pagination={false}
                        scroll={{ y: 400 }}
                    />
                );
            }}
        </Transfer>
    );
};

export default TableTransfer;
export { getDefaultLeftColumns, getDefaultRightColumns };
