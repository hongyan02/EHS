import { Transfer, Table, Tag } from "antd";

/**
 * 表格穿梭框组件
 * @param {Object} props - 组件属性
 * @param {Array} props.dataSource - 数据源
 * @param {Array} props.targetKeys - 目标键
 * @param {Function} props.onChange - 变化回调
 * @param {boolean} props.loading - 加载状态
 * @returns {JSX.Element} 表格穿梭框组件
 */
export default function TableTransfer({
    dataSource = [],
    targetKeys = [],
    onChange,
    loading = false,
    ...restProps
}) {
    // 处理数据源，确保每个项都有正确的key
    const processedDataSource = dataSource.map((item, index) => ({
        ...item,
        key: item.risk_source_id || item.id || `fallback-transfer-${index}`,
    }));
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

    // 表格列配置
    const columns = [
        {
            title: "序号",
            dataIndex: "risk_source_id",
            key: "risk_source_id",
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: "产品系列",
            dataIndex: "product",
            key: "product",
            width: 100,
            align: "center",
            ellipsis: true,
        },
        {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 80,
            align: "center",
            ellipsis: true,
        },
        {
            title: "区域",
            dataIndex: "area",
            key: "area",
            width: 80,
            align: "center",
            ellipsis: true,
        },
        {
            title: "工作岗位",
            dataIndex: "work_position",
            key: "work_position",
            width: 100,
            align: "center",
            ellipsis: true,
        },
        {
            title: "危险源描述",
            dataIndex: "danger_source_description",
            key: "danger_source_description",
            width: 150,
            align: "center",
            ellipsis: true,
        },
        {
            title: "风险等级",
            dataIndex: "level",
            key: "level",
            width: 100,
            align: "center",
            render: _renderRiskLevel,
        },
        {
            title: "重大风险",
            dataIndex: "is_major_risk",
            key: "is_major_risk",
            width: 100,
            align: "center",
            render: _renderMajorRisk,
        },
    ];

    /**
     * 自定义过滤函数，处理null值的情况
     * @param {string} inputValue - 输入值
     * @param {Object} item - 数据项
     * @returns {boolean} 是否匹配
     */
    const _filterOption = (inputValue, item) => {
        const searchValue = inputValue.toLowerCase();

        // 需要搜索的字段列表
        const searchFields = [
            "product",
            "department",
            "area",
            "work_position",
            "danger_source_description",
            "level",
        ];

        return searchFields.some((field) => {
            const fieldValue = item[field];
            // 检查字段值是否为null、undefined或空，如果是则返回false
            if (fieldValue == null || fieldValue === "") {
                return false;
            }
            // 将字段值转换为字符串并转为小写进行比较
            return String(fieldValue).toLowerCase().includes(searchValue);
        });
    };

    return (
        <div className="w-full h-full">
            <Transfer
                dataSource={processedDataSource}
                targetKeys={targetKeys}
                showSearch
                onChange={onChange}
                titles={["全部危险源", "当前区域危险源"]}
                filterOption={_filterOption}
                loading={loading}
                oneWay={true} // 只允许单向转移（左到右）
                operations={["", ""]} // 自定义按钮文字，只显示右向箭头
                style={{
                    width: "100%",
                    height: "100%",
                }}
                listStyle={{
                    width: "45%",
                    height: "100%",
                }}
                {...restProps}
            >
                {({
                    direction,
                    filteredItems,
                    onItemSelect,
                    onItemSelectAll,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const rowSelection = {
                        getCheckboxProps: () => ({ disabled: listDisabled }),
                        onChange(selectedRowKeys) {
                            onItemSelectAll(selectedRowKeys, "replace");
                        },
                        selectedRowKeys: listSelectedKeys,
                        selections: [
                            Table.SELECTION_ALL,
                            Table.SELECTION_INVERT,
                            Table.SELECTION_NONE,
                        ],
                    };

                    return (
                        <Table
                            rowKey="risk_source_id"
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            style={{ pointerEvents: listDisabled ? "none" : undefined }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) {
                                        return;
                                    }
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                            pagination={false}
                            scroll={{ x: "max-content", y: 500 }}
                        />
                    );
                }}
            </Transfer>
        </div>
    );
}
