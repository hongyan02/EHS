"use client";
import React from "react";
import { Calendar, Badge } from "antd";
import { useRouter } from "next/navigation";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

/**
 * 值班日志日历组件
 * @returns {JSX.Element} 日历组件
 */
export default function DutyLogCalendar() {
    const router = useRouter();

    const dutyData = [
        {
            dutyDate: "2025-07-14",
            dutyType: "白班",
            dutyPerson: "张三",
        },
        {
            dutyDate: "2025-07-14",
            dutyType: "夜班",
            dutyPerson: "李四",
        },
        {
            dutyDate: "2025-07-15",
            dutyType: "夜班",
            dutyPerson: "李四",
        },
        {
            dutyDate: "2025-07-16",
            dutyType: "白班",
            dutyPerson: "王五",
        },
    ];

    /**
     * 获取指定日期的值班数据
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {Array} 值班数据列表
     */
    const _getListData = (value) => {
        const dateStr = value.format("YYYY-MM-DD");
        return dutyData.filter((item) => item.dutyDate === dateStr);
    };

    /**
     * 获取指定月份的统计数据
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {number} 统计数量
     */
    const _getMonthData = (value) => {
        const monthStr = value.format("YYYY-MM");
        const count = dutyData.filter((item) => item.dutyDate.startsWith(monthStr)).length;
        return count > 0 ? count : null;
    };

    /**
     * 渲染月份单元格内容
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {JSX.Element|null} 月份单元格内容
     */
    const _monthCellRender = (value) => {
        const num = _getMonthData(value);
        return num ? (
            <div className="text-center text-xs">
                <div className="text-lg font-bold text-blue-600">{num}</div>
                <span className="text-gray-600">值班安排</span>
            </div>
        ) : null;
    };

    /**
     * 处理日期双击事件
     * @param {dayjs.Dayjs} value - 点击的日期
     */
    const _handleDateDoubleClick = (value) => {
        const date = value.format("YYYY-MM-DD");
        router.push(`/dutyLog/${date}`);
    };

    /**
     * 渲染日期单元格内容
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {JSX.Element} 日期单元格内容
     */
    const _dateCellRender = (value) => {
        const listData = _getListData(value);
        return (
            <div
                className="w-full h-full p-1 rounded cursor-pointer transition-colors duration-200"
                onDoubleClick={() => _handleDateDoubleClick(value)}
            >
                <ul className="list-none m-0 p-0 space-y-0.5">
                    {listData.map((item) => (
                        <li
                            key={`${item.dutyType}-${item.dutyPerson}`}
                            className="text-xs leading-tight"
                        >
                            <Badge
                                status={item.dutyType === "白班" ? "processing" : "error"}
                                text={`${item.dutyType} - ${item.dutyPerson}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    /**
     * 单元格渲染函数
     * @param {dayjs.Dayjs} current - 当前日期
     * @param {Object} info - 渲染信息
     * @returns {JSX.Element} 渲染结果
     */
    const _cellRender = (current, info) => {
        if (info.type === "date") return _dateCellRender(current);
        if (info.type === "month") return _monthCellRender(current);
        return info.originNode;
    };

    return <Calendar locale={zhCN} cellRender={_cellRender} />;
}
