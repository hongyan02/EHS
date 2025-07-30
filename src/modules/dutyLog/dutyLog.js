"use client";
import { DatePicker, Space } from "antd";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useGetDutyLogs } from "../../queries/dutyLog/log/index";
import ReadOnlyTiptapEditor from "../../components/ReadOnlyTiptapEditor";

dayjs.locale("zh-cn");

/**
 * 值班日志组件
 * 以时间线形式展示选定月份的每日日志
 * @returns {JSX.Element} 值班日志组件
 */
export default function DutyLog() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    // 生成查询参数
    const getQueryParams = useCallback((month, shiftType) => {
        const startDate = month.startOf("month").format("YYYY-MM-DD");
        const endDate = month.endOf("month").format("YYYY-MM-DD");
        return {
            employee_id: "",
            employee_name: "",
            start_date: startDate,
            end_date: endDate,
            shift_type: shiftType,
        };
    }, []);

    // 查询白班日志
    const dayShiftParams = useMemo(
        () => getQueryParams(selectedMonth, "0"),
        [selectedMonth, getQueryParams]
    );
    const { data: dayShiftLogs = [] } = useGetDutyLogs(dayShiftParams);

    // 查询夜班日志
    const nightShiftParams = useMemo(
        () => getQueryParams(selectedMonth, "1"),
        [selectedMonth, getQueryParams]
    );
    const { data: nightShiftLogs = [] } = useGetDutyLogs(nightShiftParams);

    /**
     * 根据选择的月份生成当月天数的时间线项目
     */
    const timelineItems = useMemo(() => {
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

            // 查找当天的白班和夜班日志
            const dayShiftLog = dayShiftLogs.find((log) => log.duty_date === dateStr);
            const nightShiftLog = nightShiftLogs.find((log) => log.duty_date === dateStr);

            // 解析待办事项
            const parseTodos = (todoLog) => {
                if (!todoLog) return [];
                try {
                    const parsed = JSON.parse(todoLog);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            };

            // 检查白班日志数据是否存在且有内容
            const isDayShiftDataEmpty =
                !dayShiftLog ||
                ((!dayShiftLog.employee_name || dayShiftLog.employee_name.trim() === "") &&
                    (!dayShiftLog.duty_log || dayShiftLog.duty_log.trim() === "") &&
                    (!dayShiftLog.todo_log || parseTodos(dayShiftLog.todo_log).length === 0));

            // 检查夜班日志数据是否存在且有内容
            const isNightShiftDataEmpty =
                !nightShiftLog ||
                ((!nightShiftLog.employee_name || nightShiftLog.employee_name.trim() === "") &&
                    (!nightShiftLog.duty_log || nightShiftLog.duty_log.trim() === "") &&
                    (!nightShiftLog.todo_log || parseTodos(nightShiftLog.todo_log).length === 0));

            // 判断是否有API返回的日期记录（即使数据为空）
            const hasDayShiftRecord = !!dayShiftLog;
            const hasNightShiftRecord = !!nightShiftLog;

            return {
                key: day.toString(),
                date: dateStr,
                day: day,
                weekday: weekday,
                isToday: date.isSame(dayjs(), "day"),
                logs: {
                    dayShift:
                        hasDayShiftRecord && !isDayShiftDataEmpty
                            ? {
                                  recorder: dayShiftLog.employee_name || "未知",
                                  details: dayShiftLog.duty_log || "暂无日志内容",
                                  todos: parseTodos(dayShiftLog.todo_log),
                              }
                            : null,
                    nightShift:
                        hasNightShiftRecord && !isNightShiftDataEmpty
                            ? {
                                  recorder: nightShiftLog.employee_name || "未知",
                                  details: nightShiftLog.duty_log || "暂无日志内容",
                                  todos: parseTodos(nightShiftLog.todo_log),
                              }
                            : null,
                },
                // 新增字段用于区分两种空状态
                hasAnyRecord: hasDayShiftRecord || hasNightShiftRecord,
                hasEmptyData:
                    (hasDayShiftRecord && isDayShiftDataEmpty) ||
                    (hasNightShiftRecord && isNightShiftDataEmpty),
            };
        });
    }, [selectedMonth, dayShiftLogs, nightShiftLogs]);

    /**
     * 处理月份选择变化
     * @param {dayjs.Dayjs} date - 选择的日期
     */
    const handleMonthChange = useCallback((date) => {
        setSelectedMonth(date || dayjs());
    }, []);

    return (
        <div className="h-full w-full bg-white p-6">
            <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
            >
                {/* 月份选择器 */}
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">值班日志</h2>
                    <DatePicker.MonthPicker
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        placeholder="选择月份"
                        style={{ width: 200 }}
                        format="YYYY年MM月"
                    />
                </div>

                {/* 时间线样式的日志展示 */}
                <div className="relative">
                    {timelineItems.map((item, index) => (
                        <div
                            key={item.key}
                            className="relative flex items-start"
                        >
                            {/* 时间线左侧 - 日期信息 */}
                            <div className="flex-shrink-0 w-32 text-right pr-6">
                                <div
                                    className={`text-lg font-semibold ${
                                        item.isToday ? "text-blue-600" : "text-gray-800"
                                    }`}
                                >
                                    {item.day}日
                                </div>
                                <div className="text-sm text-gray-500">{item.weekday}</div>
                            </div>

                            {/* 时间线中间 - 圆点和连接线 */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                {/* 圆点 */}
                                <div
                                    className={`w-4 h-4 rounded-full border-2 ${
                                        item.isToday
                                            ? "bg-blue-600 border-blue-600"
                                            : item.logs.dayShift || item.logs.nightShift
                                            ? "bg-green-500 border-green-500"
                                            : "bg-gray-300 border-gray-300"
                                    }`}
                                ></div>

                                {/* 连接线 - 除了最后一个项目 */}
                                {index < timelineItems.length - 1 && (
                                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                                )}
                            </div>

                            {/* 时间线右侧 - 日志内容 */}
                            <div className="flex-1 pl-6 pb-16">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {/* <div className="text-sm font-medium text-gray-800 mb-2">
                                        {selectedMonth.year()}年{selectedMonth.month() + 1}月{item.day}日
                                    </div> */}

                                    {item.logs.dayShift || item.logs.nightShift ? (
                                        <div className="space-y-4">
                                            {/* 白班 */}
                                            {item.logs.dayShift && (
                                                <div className="border-l-4 border-blue-500 pl-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-l text-white font-mono bg-blue-500 px-2 py-1 rounded">
                                                            白班
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                记录人：
                                                            </span>
                                                            {item.logs.dayShift.recorder}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                详细日志：
                                                            </span>
                                                            <div className="mt-1">
                                                                <ReadOnlyTiptapEditor
                                                                    content={
                                                                        item.logs.dayShift.details
                                                                    }
                                                                    className="text-sm border border-gray-200 rounded-md p-3 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                待办项：
                                                            </span>
                                                            <div className="mt-1 border border-gray-200 rounded-md p-3 bg-white">
                                                                <ul className="list-disc list-inside">
                                                                    {item.logs.dayShift.todos.map(
                                                                        (todo, todoIndex) => (
                                                                            <li
                                                                                key={todoIndex}
                                                                                className="text-gray-700"
                                                                            >
                                                                                {typeof todo ===
                                                                                "string"
                                                                                    ? todo
                                                                                    : todo.text ||
                                                                                      todo}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 夜班 */}
                                            {item.logs.nightShift && (
                                                <div className="border-l-4 border-red-500 pl-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-l text-white font-mono bg-red-500 px-2 py-1 rounded">
                                                            夜班
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                记录人：
                                                            </span>
                                                            {item.logs.nightShift.recorder}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                详细日志：
                                                            </span>
                                                            <div className="mt-1">
                                                                <ReadOnlyTiptapEditor
                                                                    content={
                                                                        item.logs.nightShift.details
                                                                    }
                                                                    className="text-sm border border-gray-200 rounded-md p-3 bg-white"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                待办项：
                                                            </span>
                                                            <div className="mt-1 border border-gray-200 rounded-md p-3 bg-white">
                                                                <ul className="list-disc list-inside">
                                                                    {item.logs.nightShift.todos.map(
                                                                        (todo, todoIndex) => (
                                                                            <li
                                                                                key={todoIndex}
                                                                                className="text-gray-700"
                                                                            >
                                                                                {typeof todo ===
                                                                                "string"
                                                                                    ? todo
                                                                                    : todo.text ||
                                                                                      todo}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic flex items-center justify-center py-8">
                                            <div className="text-center">
                                                <div className="text-gray-300 text-2xl mb-2">
                                                    {item.hasAnyRecord ? "📝" : "📋"}
                                                </div>
                                                <div>
                                                    {item.hasAnyRecord
                                                        ? "暂未上传日志"
                                                        : "未创建日志"}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Space>
        </div>
    );
}
