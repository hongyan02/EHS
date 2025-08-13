"use client";
import { Table, Button } from "antd";
import { useMemo } from "react";
import { DownloadOutlined } from "@ant-design/icons";
import { getCurrentYear, getCurrentMonth, getCurrentWeekOfMonth } from "@/util/timeUtils";
import { transformDutyDataForTable } from "@/util/dutyDataTransformer";
import { exportWeekTableToExcel } from "@/util/export";

const year = getCurrentYear();
const month = getCurrentMonth();
const week = getCurrentWeekOfMonth();

function getRowSpan(index) {
    if (index === 0) {
        return 4;
    }
    if (index === 1) {
        return 0;
    }
    if (index === 2) {
        return 2;
    }
    if (index === 3) {
        return 0;
    }
    return 1;
}

// 合并表格的列配置
const Columns = [
    {
        title: "日期",
        dataIndex: "duty_date",
        key: "duty_date",
        onCell: (_, index) => {
            const groupSize = 4; // 每组的行数
            if (index % groupSize === 0) {
                // 每组第一行
                return { rowSpan: groupSize };
            } else {
                // 被合并掉的行
                return { rowSpan: 0 };
            }
        },
    },
    {
        title: "人员",
        dataIndex: "position",
        key: "position",
    },
    {
        title: "白班",
        children: [
            {
                title: "姓名",
                dataIndex: "day_person",
                key: "day_person",
            },
            {
                title: "联系方式",
                dataIndex: "day_phone",
                key: "day_phone",
            },
        ],
    },
    {
        title: "人员",
        dataIndex: "night_position",
        key: "night_position",
        onCell: (_, index) => {
            const groupSize = 2; // 每组合并的行数
            if (index % groupSize === 0) {
                // 每组的第一行
                return { rowSpan: groupSize };
            }
            // 其它行隐藏
            return { rowSpan: 0 };
        },
    },
    {
        title: "夜班",
        children: [
            {
                title: "姓名",
                dataIndex: "night_person",
                key: "night_person",
                onCell: (_, index) => {
                    const groupSize = 2; // 每组合并的行数
                    if (index % groupSize === 0) {
                        // 每组的第一行
                        return { rowSpan: groupSize };
                    }
                    // 其它行隐藏
                    return { rowSpan: 0 };
                },
            },
            {
                title: "联系方式",
                dataIndex: "night_phone",
                key: "night_phone",
                onCell: (_, index) => {
                    const groupSize = 2; // 每组合并的行数
                    if (index % groupSize === 0) {
                        // 每组的第一行
                        return { rowSpan: groupSize };
                    }
                    // 其它行隐藏
                    return { rowSpan: 0 };
                },
            },
        ],
    },
];

export default function WeekTable({ apiData = null }) {
    // 使用useMemo优化数据转换性能
    const tableData = useMemo(() => {
        if (!apiData) {
            // 如果没有API数据，返回空数组
            return [];
        }

        const transformedData = transformDutyDataForTable(apiData);
        // 为每行数据添加key
        return transformedData.map((item, index) => ({
            ...item,
            key: `${item.duty_date}_${item.position}_${index}`,
        }));
    }, [apiData]);

    // 导出功能
    const handleExport = async () => {
        if (!tableData || tableData.length === 0) {
            console.warn("没有数据可导出");
            return;
        }

        const title = `8BU-60A工厂${year}年${month}月第${week}周应急值班表`;
        const filename = `8BU-60A工厂_${year}年${month}月第${week}周_应急值班表`;
        await exportWeekTableToExcel(tableData, title, filename);
    };

    return (
        <div>
            {/* 表格标题和导出按钮 */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex-1 text-center font-bold text-2xl">
                    8BU-60A工厂{year}年{month}月第{week}周应急值班表
                </div>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={!tableData || tableData.length === 0}
                >
                    导出Excel
                </Button>
            </div>

            {/* 合并表格 */}
            <Table
                columns={Columns}
                dataSource={tableData}
                pagination={false}
                bordered
                locale={{
                    emptyText: apiData ? "暂无值班数据" : "请提供值班数据",
                }}
            />
        </div>
    );
}
