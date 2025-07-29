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
            shift_type: shiftType
        };
    }, []);

    // 查询白班日志
    const dayShiftParams = useMemo(() => getQueryParams(selectedMonth, "0"), [selectedMonth, getQueryParams]);
    const { data: dayShiftLogs = [] } = useGetDutyLogs(dayShiftParams);

    // 查询夜班日志
    const nightShiftParams = useMemo(() => getQueryParams(selectedMonth, "1"), [selectedMonth, getQueryParams]);
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
            const dayShiftLog = dayShiftLogs.find(log => log.duty_date === dateStr);
            const nightShiftLog = nightShiftLogs.find(log => log.duty_date === dateStr);

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

            return {
                key: day.toString(),
                date: dateStr,
                day: day,
                weekday: weekday,
                isToday: date.isSame(dayjs(), "day"),
                logs: {
                    dayShift: dayShiftLog ? {
                        recorder: dayShiftLog.employee_name || "未知",
                        details: dayShiftLog.duty_log || "暂无日志内容",
                        todos: parseTodos(dayShiftLog.todo_log),
                    } : (day <= 3 ? {
                        recorder: "张三",
                        details: `<h3>白班工作总结</h3><p>今日完成了以下工作：</p><ul><li><strong>设备巡检</strong>：完成了所有生产设备的例行巡检</li><li><em>安全检查</em>：发现并处理了2处安全隐患</li><li><u>数据记录</u>：更新了设备运行参数</li></ul><blockquote><p>特别注意：3号设备需要在下周进行维护保养</p></blockquote><p>明日计划：</p><ol><li>继续设备巡检工作</li><li>配合维修人员进行设备检修</li><li>完成月度安全报告</li></ol><p>备注：<code>设备编号A001</code>运行正常，<mark>温度控制在正常范围内</mark>。</p>`,
                        todos: ["完成设备维护记录", "提交安全检查报告", "准备下周培训材料"],
                    } : null),
                    nightShift: nightShiftLog ? {
                        recorder: nightShiftLog.employee_name || "未知",
                        details: nightShiftLog.duty_log || "暂无日志内容",
                        todos: parseTodos(nightShiftLog.todo_log),
                    } : (day <= 2 ? {
                        recorder: "李四",
                        details: `<h3>夜班值守记录</h3><p>夜班期间主要工作内容：</p><ul><li><strong>监控系统</strong>：全程监控生产线运行状态</li><li><strong>应急处理</strong>：处理了一起设备报警事件</li><li><strong>交接准备</strong>：整理了交接班记录</li></ul><p>异常情况处理：</p><blockquote><p><strong>时间</strong>：23:30<br><strong>事件</strong>：2号生产线温度异常<br><strong>处理</strong>：及时调整参数，恢复正常运行</p></blockquote><p>需要关注的事项：</p><ol><li>设备运行参数需要持续监控</li><li>原料库存即将不足，需要及时补充</li><li>下班前完成设备清洁工作</li></ol><p><mark>重要提醒</mark>：明日白班需要重点关注<code>设备B002</code>的运行状态。</p>`,
                        todos: ["监控设备运行状态", "处理异常报警", "准备交接班记录"],
                    } : null),
                },
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
                                                                    content={item.logs.dayShift.details}
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
                                                                                {todo}
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
                                                                    content={item.logs.nightShift.details}
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
                                                                                {todo}
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
