"use client";
import { Collapse, DatePicker, Space } from "antd";
import { useState, useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DutyForm from "@/components/calendar/DutyForm";

dayjs.locale("zh-cn");

/**
 * 日期折叠面板组件
 * 根据选择的月份动态渲染当月天数的折叠面板
 * @returns {JSX.Element} 日期折叠面板组件
 */
export default function CollapseDate() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    /**
     * 根据选择的月份生成当月天数的items
     */
    const items = useMemo(() => {
        const daysInMonth = selectedMonth.daysInMonth();
        const year = selectedMonth.year();
        const month = selectedMonth.month() + 1; // dayjs月份从0开始

        return Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const date = dayjs(
                `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
            );
            const weekday = date.format("dddd");

            return {
                key: day.toString(),
                label: `${year}年${month}月${day}日 (${weekday})`,
                children: (
                    <DutyForm
                        date={`${year}-${month.toString().padStart(2, "0")}-${day
                            .toString()
                            .padStart(2, "0")}`}
                    />
                ),
            };
        });
    }, [selectedMonth]);

    /**
     * 处理月份选择变化
     * @param {dayjs.Dayjs} date - 选择的日期
     */
    const _handleMonthChange = (date) => {
        setSelectedMonth(date || dayjs());
    };

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <DatePicker.MonthPicker
                value={selectedMonth}
                onChange={_handleMonthChange}
                placeholder="选择月份"
                style={{ width: 200 }}
                format="YYYY年MM月"
            />
            <Collapse items={items} defaultActiveKey={["1"]} size="small" />
        </Space>
    );
}
