"use client";
import React from "react";
import { Table, Tag, Tooltip, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
// import type { Accident } from "@/lib/db/schema";
import { Accident } from "@/types/accident";
import { useAccidents } from "@/queries/accidents";
import type { AccidentTableRow, AccidentTableProps } from "@/types/accident";

type AccidentData = Partial<Accident> & { key: string };

interface ATableProps {
    selectedRowKeys?: React.Key[];
    onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: AccidentData[]) => void;
}

export default function ATable({
    selectedRowKeys,
    onSelectionChange,
}: AccidentTableProps): React.JSX.Element {
    const { data: accidents, isLoading, error } = useAccidents();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    // 处理数据格式
    const dataSource: AccidentTableRow[] = React.useMemo(() => {
        if (!accidents?.data) return [];
        return accidents.data.map((accident: any) => ({
            ...accident,
        }));
    }, [accidents]);

    // 行选择配置
    const rowSelection: TableRowSelection<AccidentTableRow> = {
        selectedRowKeys,
        onChange: (selectedRowKeys: React.Key[], selectedRows: AccidentTableRow[]) => {
            onSelectionChange?.(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: (record: AccidentTableRow) => ({
            name: record.id?.toString(),
        }),
    };

    const columns: ColumnsType<AccidentTableRow> = [
        {
            title: "序号",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 80,
            render: (_: any, __: AccidentTableRow, index: number) => {
                return (currentPage - 1) * pageSize + index + 1;
            },
        },
        {
            title: "事发日期",
            dataIndex: "happen_date",
            key: "happen_date",
            align: "center",
            width: 120,
        },
        {
            title: "所属月份",
            dataIndex: "month",
            key: "month",
            align: "center",
            width: 100,
            render: (month: string) => {
                // 将 yyyy-mm 格式转换为 yyyy/mm/01
                if (month && month.includes("-")) {
                    return month.replace("-", "/") + "/01";
                }
                return month;
            },
        },
        {
            title: "OA单据编号",
            dataIndex: "oa_number",
            key: "oa_number",
            align: "center",
            width: 150,
        },
        {
            title: "OA提交日期",
            dataIndex: "oa_submit_date",
            key: "oa_submit_date",
            align: "center",
            width: 160,
        },
        {
            title: "产品线",
            dataIndex: "product_line",
            key: "product_line",
            align: "center",
            width: 140,
            render: (text: string) => {
                return <Tag color="blue">{text}</Tag>;
            },
        },
        {
            title: "具体地点",
            dataIndex: "detail_place",
            key: "detail_place",
            align: "center",
            width: 200,
            render: (text: string) => {
                return (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                );
            },
        },
        {
            title: "自燃电芯类型",
            dataIndex: "self_ignite_cell_type",
            key: "self_ignite_cell_type",
            align: "center",
            width: 140,
        },
        {
            title: "自燃电芯数量",
            dataIndex: "self_ignite_cell_number",
            key: "self_ignite_cell_number",
            align: "center",
            width: 140,
        },
        {
            title: "电池自燃原因",
            dataIndex: "battery_self_ignite_reason",
            key: "battery_self_ignite_reason",
            align: "center",
            width: 240,
            render: (text: string) => {
                return (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                );
            },
        },
        {
            title: "具体内容描述",
            dataIndex: "detail_content",
            key: "detail_content",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) => {
                return (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                );
            },
        },
        {
            title: "事故or事件",
            dataIndex: "accident_or_event",
            key: "accident_or_event",
            align: "center",
            width: 120,
            render: (text: AccidentTableRow["accident_or_event"]) => {
                return <Tag color="blue">{text}</Tag>;
            },
        },
        {
            title: "事故起因",
            dataIndex: "accident_cause",
            key: "accident_cause",
            align: "center",
            width: 140,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "事故类型",
            dataIndex: "accident_type",
            key: "accident_type",
            align: "center",
            width: 140,
        },
        {
            title: "事故经济损失",
            dataIndex: "economic_loss",
            key: "economic_loss",
            align: "center",
            width: 120,
        },
        {
            title: "事故工时损失(H)",
            dataIndex: "work_hours_loss",
            key: "work_hours_loss",
            align: "center",
            width: 200,
        },
        {
            title: "事故等级",
            dataIndex: "accident_level",
            key: "accident_level",
            align: "center",
            width: 140,
        },
        {
            title: "内部or相关方事故",
            dataIndex: "internal_or_related",
            key: "internal_or_related",
            align: "center",
            width: 200,
        },
        {
            title: "是否厂外交通事故",
            dataIndex: "is_traffic_accident",
            key: "is_traffic_accident",
            align: "center",
            width: 180,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "是否火情事件",
            dataIndex: "is_fire_event",
            key: "is_fire_event",
            align: "center",
            width: 140,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "是否冒烟起火未遂事件",
            dataIndex: "is_smoke_fire_attempt",
            key: "is_smoke_fire_attempt",
            align: "center",
            width: 200,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "事件起因",
            dataIndex: "event_cause",
            key: "event_cause",
            align: "center",
            ellipsis: true,
            width: 120,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "事件类型",
            dataIndex: "event_type",
            key: "event_type",
            align: "center",
            width: 100,
        },
        {
            title: "事件经济损失",
            dataIndex: "event_economic_loss",
            key: "event_economic_loss",
            align: "center",
            width: 120,
        },
        {
            title: "未遂分类",
            dataIndex: "attempt_classification",
            key: "attempt_classification",
            align: "center",
            width: 100,
        },
        {
            title: "直接原因类型",
            dataIndex: "direct_cause_type",
            key: "direct_cause_type",
            align: "center",
            width: 120,
        },
        {
            title: "详细内容1",
            dataIndex: "detail_content1",
            key: "detail_content1",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "间接原因类型",
            dataIndex: "indirect_cause_type",
            key: "indirect_cause_type",
            align: "center",
            width: 120,
        },
        {
            title: "详细内容2",
            dataIndex: "detail_content2",
            key: "detail_content2",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "系统原因类型",
            dataIndex: "system_cause_type",
            key: "system_cause_type",
            align: "center",
            width: 120,
        },
        {
            title: "详细内容3",
            dataIndex: "detail_content3",
            key: "detail_content3",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "整改措施",
            dataIndex: "corrective_measures",
            key: "corrective_measures",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "整改完成情况",
            dataIndex: "completion_status",
            key: "completion_status",
            align: "center",
            width: 120,
        },
        {
            title: "是否属于责任事故",
            dataIndex: "is_responsible_accident",
            key: "is_responsible_accident",
            align: "center",
            width: 180,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "事故惩处是否完结",
            dataIndex: "punishment_completed",
            key: "punishment_completed",
            align: "center",
            width: 180,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "惩处信息",
            dataIndex: "punishment_info",
            key: "punishment_info",
            align: "center",
            width: 200,
            ellipsis: true,
            render: (text: string) =>
                text && (
                    <Tooltip placement="leftTop" title={text}>
                        {text}
                    </Tooltip>
                ),
        },
        {
            title: "是否上报",
            dataIndex: "is_reported",
            key: "is_reported",
            align: "center",
            width: 100,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "是否需要更新危险源清单",
            dataIndex: "need_update_hazard_list",
            key: "need_update_hazard_list",
            align: "center",
            width: 220,
            render: (value: boolean) => (value ? "是" : "否"),
        },
        {
            title: "是否需要更新安全操作规程",
            dataIndex: "need_update_safety_procedures",
            key: "need_update_safety_procedures",
            align: "center",
            width: 240,
            render: (value: boolean) => (value ? "是" : "否"),
        },
    ];

    // 错误处理
    if (error) {
        return (
            <div className="w-full">
                <Alert
                    message="数据加载失败"
                    description={error.message || "请检查网络连接或联系管理员"}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="w-full h-full">
            <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 5500, y: "calc(100vh - 200px)" }}
                size="middle"
                rowKey={(record) => record.id}
                loading={isLoading}
                rowSelection={rowSelection}
                pagination={{
                    showQuickJumper: true,
                    current: currentPage,
                    pageSize: pageSize,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size || 10);
                    },
                    onShowSizeChange: (current, size) => {
                        setCurrentPage(current);
                        setPageSize(size);
                    },
                }}
            />
        </div>
    );
}
