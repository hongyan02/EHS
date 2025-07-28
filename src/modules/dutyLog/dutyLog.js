"use client";
import { DatePicker, Space } from "antd";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

/**
 * 值班日志组件
 * 以时间线形式展示选定月份的每日日志
 * @returns {JSX.Element} 值班日志组件
 */
export default function DutyLog() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

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

            return {
                key: day.toString(),
                date: dateStr,
                day: day,
                weekday: weekday,
                isToday: date.isSame(dayjs(), "day"),
                // 这里可以添加实际的日志数据
                logs: {
                    dayShift: {
                        recorder: "张三",
                        details: "设备运行正常，无异常情况",
                        todos: ["检查设备运行状态", "填写运行记录"],
                    },
                    nightShift: {
                        recorder: "李四",
                        details: "夜间巡检完成，发现A区域温度偏高",
                        todos: ["调整A区域温控", "记录异常情况"],
                    },
                },
            };
        });
    }, [selectedMonth]);

    /**
     * 处理月份选择变化
     * @param {dayjs.Dayjs} date - 选择的日期
     */
    const handleMonthChange = useCallback((date) => {
        setSelectedMonth(date || dayjs());
    }, []);

    return (
        <div className="h-full w-full bg-white p-6">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
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
                        <div key={item.key} className="relative flex items-start">
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
                                                        <span className="text-xs text-white font-mono bg-blue-500 px-2 py-1 rounded">
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
                                                            {item.logs.dayShift.details}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                待办项：
                                                            </span>
                                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                                {item.logs.dayShift.todos.map(
                                                                    (todo, todoIndex) => (
                                                                        <li
                                                                            key={todoIndex}
                                                                            className="text-gray-700"
                                                                        >
                                                                            {todo}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 夜班 */}
                                            {item.logs.nightShift && (
                                                <div className="border-l-4 border-red-500 pl-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-xs text-white font-mono bg-red-500 px-2 py-1 rounded">
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
                                                            {item.logs.nightShift.details}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-600">
                                                                待办项：
                                                            </span>
                                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                                {item.logs.nightShift.todos.map(
                                                                    (todo, todoIndex) => (
                                                                        <li
                                                                            key={todoIndex}
                                                                            className="text-gray-700"
                                                                        >
                                                                            {todo}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-400 italic">
                                            暂无日志记录
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
