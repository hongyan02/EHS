"use client";
import { Collapse, DatePicker, Space, Button } from "antd";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import DayShiftForm from "../../components/calendar/DayShiftForm";
import NightShiftForm from "../../components/calendar/NightShiftForm";
import { useDutyLog } from "../../hooks/use-duty-log";

dayjs.locale("zh-cn");

/**
 * 日期折叠面板组件
 * 根据选择的月份动态渲染当月天数的折叠面板
 * @returns {JSX.Element} 日期折叠面板组件
 */
export default function CollapseDate() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    // 使用自定义hook管理值班表逻辑
    const {
        finalData,
        getDayShiftInitialValues,
        getNightShiftInitialValues,
        getDutyDataByDate,
        getDutyDataByDateAndShift,
        hasDutySchedule,
        hasDayShiftSchedule,
        hasNightShiftSchedule,
        handleAddDutySchedule,
        handleAddDayShiftSchedule,
        handleAddNightShiftSchedule,
        handleSaveDayShift,
        handleSaveNightShift,
    } = useDutyLog(selectedMonth);

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
            const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day
                .toString()
                .padStart(2, "0")}`;
            const hasDayShift = hasDayShiftSchedule(dateStr);
            const hasNightShift = hasNightShiftSchedule(dateStr);
            const hasDuty = hasDayShift || hasNightShift;

            // 分别获取白班和夜班数据
            const dayShiftData = getDutyDataByDateAndShift(dateStr, "0");
            const nightShiftData = getDutyDataByDateAndShift(dateStr, "1");

            // 获取表单初始值
            const dayShiftInitialValues = dayShiftData
                ? getDayShiftInitialValues(dayShiftData.employees)
                : {};
            const nightShiftInitialValues = nightShiftData
                ? getNightShiftInitialValues(nightShiftData.employees)
                : {};

            return {
                key: day.toString(),
                label: `${year}年${month}月${day}日 (${weekday})${hasDuty ? " ✓" : ""}`,
                children: (
                    <div className="flex flex-col gap-6">
                        {/* 白班部分 */}
                        {hasDayShift ? (
                            <>
                                <DayShiftForm
                                    date={dateStr}
                                    initialValues={dayShiftInitialValues}
                                    onSave={handleSaveDayShift}
                                />
                                <div className="text-right">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        form={`day-shift-form-${dateStr}`}
                                    >
                                        保存白班信息
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-4 border border-blue-200 rounded">
                                <p className="text-gray-500 mb-4">该日期暂无白班值班表</p>
                                <Button
                                    type="primary"
                                    onClick={() => handleAddDayShiftSchedule(dateStr)}
                                >
                                    添加白班值班表
                                </Button>
                            </div>
                        )}

                        {/* 夜班部分 */}
                        {hasNightShift ? (
                            <>
                                <NightShiftForm
                                    date={dateStr}
                                    initialValues={nightShiftInitialValues}
                                    onSave={handleSaveNightShift}
                                />
                                <div className="text-right">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        form={`night-shift-form-${dateStr}`}
                                    >
                                        保存夜班信息
                                    </Button>
                                </div>
                            </>
                        ) : hasDayShift ? (
                            <div className="text-center p-4 border border-red-200 rounded">
                                <p className="text-gray-500 mb-4">该日期暂无夜班值班表</p>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => handleAddNightShiftSchedule(dateStr)}
                                >
                                    添加夜班值班表
                                </Button>
                            </div>
                        ) : null}
                    </div>
                ),
            };
        });
    }, [
        selectedMonth,
        // handleAddDutySchedule,
        handleAddDayShiftSchedule,
        handleAddNightShiftSchedule,
        // hasDutySchedule,
        hasDayShiftSchedule,
        hasNightShiftSchedule,
        handleSaveDayShift,
        handleSaveNightShift,
        // getDutyDataByDate,
        getDutyDataByDateAndShift,
        getDayShiftInitialValues,
        getNightShiftInitialValues,
    ]);

    /**
     * 处理月份选择变化
     * @param {dayjs.Dayjs} date - 选择的日期
     */
    const _handleMonthChange = useCallback((date) => {
        setSelectedMonth(date || dayjs());
    }, []);

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <DatePicker.MonthPicker
                value={selectedMonth}
                onChange={_handleMonthChange}
                placeholder="选择月份"
                style={{ width: 200 }}
                format="YYYY年MM月"
            />
            <Collapse items={items} defaultActiveKey={[""]} size="small" />
        </Space>
    );
}
