"use client";
import { Collapse, DatePicker, Space, Button } from "antd";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import LogForm from "../../components/calendar/LogForm.js";
import { useDutyLog } from "../../hooks/use-duty-log";
import {
    useCreateDutyLog,
    useUpdateDutyLog,
    useGetDutyLogs,
    useDeleteDutyLog,
} from "../../queries/dutyLog/log/index";

dayjs.locale("zh-cn");

/**
 * 日志记录组件
 * 根据选择的月份动态渲染当月天数的折叠面板，每天可以记录日志
 * @returns {JSX.Element} 日志记录组件
 */
export default function WriteLog() {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const [showLogForm, setShowLogForm] = useState({});

    // 使用自定义hook管理值班表逻辑
    const {
        getDutyDataByDateAndShift,
        hasDayShiftSchedule,
        hasNightShiftSchedule,
        handleAddDayShiftSchedule,
        handleAddNightShiftSchedule,
    } = useDutyLog(selectedMonth);

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

    // 创建日志的mutation
    const createDutyLogMutation = useCreateDutyLog();
    // 更新日志的mutation
    const updateDutyLogMutation = useUpdateDutyLog();
    // 删除日志的mutation
    const deleteDutyLogMutation = useDeleteDutyLog();

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

            // 从API查询结果中获取当天的白班和夜班日志数据
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

            const hasLog = dayShiftLog || nightShiftLog;

            // 处理创建白班日志
            const handleCreateDayShiftLog = () => {
                const requestData = {
                    duty_date: dateStr,
                    duty_log: "",
                    employee_id: "",
                    employee_name: "",
                    shift_type: "0",
                    todo_log: "",
                };

                createDutyLogMutation.mutate(requestData, {
                    onSuccess: () => {
                        console.log("白班日志创建成功");
                        // 创建成功后显示表单
                        setShowLogForm((prev) => ({
                            ...prev,
                            [`${dateStr}-day`]: true,
                        }));
                    },
                    onError: (error) => {
                        console.error("白班日志创建失败:", error);
                    },
                });
            };

            // 处理创建夜班日志
            const handleCreateNightShiftLog = () => {
                const requestData = {
                    duty_date: dateStr,
                    duty_log: "",
                    employee_id: "",
                    employee_name: "",
                    shift_type: "1",
                    todo_log: "",
                };

                createDutyLogMutation.mutate(requestData, {
                    onSuccess: () => {
                        console.log("夜班日志创建成功");
                        // 创建成功后显示表单
                        setShowLogForm((prev) => ({
                            ...prev,
                            [`${dateStr}-night`]: true,
                        }));
                    },
                    onError: (error) => {
                        console.error("夜班日志创建失败:", error);
                    },
                });
            };

            // 处理日志保存
            const handleSaveLog = (formData, shiftType) => {
                const logData = shiftType === "day" ? dayShiftLog : nightShiftLog;
                const requestData = {
                    duty_date: dateStr,
                    duty_log: formData.content || "",
                    employee_id: formData.author || "",
                    employee_name: formData.author || "",
                    id: logData?.id || 0,
                    shift_type: shiftType === "day" ? "0" : "1",
                    todo_log: formData.todoItems ? JSON.stringify(formData.todoItems) : "",
                };

                updateDutyLogMutation.mutate(requestData, {
                    onSuccess: () => {
                        console.log(`${shiftType === "day" ? "白班" : "夜班"}日志保存成功`);
                        // 保存成功后隐藏表单
                        setShowLogForm((prev) => ({
                            ...prev,
                            [`${dateStr}-${shiftType}`]: false,
                        }));
                    },
                    onError: (error) => {
                        console.error(
                            `${shiftType === "day" ? "白班" : "夜班"}日志保存失败:`,
                            error
                        );
                    },
                });
            };

            // 处理日志删除
            const handleDeleteLog = (shiftType) => {
                const logData = shiftType === "day" ? dayShiftLog : nightShiftLog;
                if (!logData?.id) {
                    console.error("无法删除：缺少日志ID");
                    return;
                }

                deleteDutyLogMutation.mutate(logData.id, {
                    onSuccess: () => {
                        console.log(`${shiftType === "day" ? "白班" : "夜班"}日志删除成功`);
                    },
                    onError: (error) => {
                        console.error(
                            `${shiftType === "day" ? "白班" : "夜班"}日志删除失败:`,
                            error
                        );
                    },
                });
            };

            // 处理取消创建日志
            const handleCancelLog = (shiftType) => {
                setShowLogForm((prev) => ({
                    ...prev,
                    [`${dateStr}-${shiftType}`]: false,
                }));
            };

            return {
                key: day.toString(),
                label: `${year}年${month}月${day}日 (${weekday})${hasLog ? " 📝" : ""}`,
                children: (
                    <div className="flex flex-col gap-6">
                        {/* 白班部分 */}
                        {hasDayShift ? (
                            <div className="border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-blue-600">白班日志</h3>
                                    <div className="flex gap-2">
                                        {!dayShiftLog && !showLogForm[`${dateStr}-day`] && (
                                            <Button
                                                type="primary"
                                                onClick={handleCreateDayShiftLog}
                                                disabled={!hasDayShift}
                                            >
                                                创建白班日志
                                            </Button>
                                        )}
                                        {dayShiftLog && (
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => handleDeleteLog("day")}
                                            >
                                                删除日志
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {dayShiftLog || showLogForm[`${dateStr}-day`] ? (
                                    <div>
                                        {dayShiftLog?.is_commit ? (
                                            // 已提交的日志，只显示只读内容
                                            <div className="bg-gray-50 p-4 rounded border">
                                                <div className="mb-2">
                                                    <span className="font-medium">作者：</span>
                                                    <span>{dayShiftLog?.employee_name}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="font-medium">日志内容：</span>
                                                    <div className="mt-1 p-2 bg-white rounded border">
                                                        {dayShiftLog?.duty_log || "暂无内容"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">待办事项：</span>
                                                    <div className="mt-1">
                                                        {parseTodos(dayShiftLog?.todo_log).length >
                                                        0 ? (
                                                            <ul className="list-disc list-inside">
                                                                {parseTodos(
                                                                    dayShiftLog?.todo_log
                                                                ).map((todo, index) => (
                                                                    <li
                                                                        key={index}
                                                                        className="text-gray-700"
                                                                    >
                                                                        {typeof todo === "string"
                                                                            ? todo
                                                                            : todo.text || todo}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                暂无待办事项
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-sm text-green-600 font-medium">
                                                    ✓ 已提交
                                                </div>
                                            </div>
                                        ) : (
                                            // 未提交的日志，显示编辑表单
                                            <LogForm
                                                initialValues={{
                                                    author: dayShiftLog?.employee_name || "",
                                                    content: dayShiftLog?.duty_log || "",
                                                    todoItems:
                                                        parseTodos(dayShiftLog?.todo_log) || [],
                                                }}
                                                onSave={(formData) =>
                                                    handleSaveLog(formData, "day")
                                                }
                                            />
                                        )}
                                        {showLogForm[`${dateStr}-day`] && (
                                            <div className="flex justify-end mt-4">
                                                <Button onClick={() => handleCancelLog("day")}>
                                                    取消
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">暂无白班日志记录</p>
                                )}
                            </div>
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
                            <div className="border border-red-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-red-600">夜班日志</h3>
                                    <div className="flex gap-2">
                                        {!nightShiftLog && !showLogForm[`${dateStr}-night`] && (
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={handleCreateNightShiftLog}
                                                disabled={!hasNightShift}
                                            >
                                                创建夜班日志
                                            </Button>
                                        )}
                                        {nightShiftLog && (
                                            <Button
                                                type="primary"
                                                danger
                                                onClick={() => handleDeleteLog("night")}
                                            >
                                                删除日志
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {nightShiftLog || showLogForm[`${dateStr}-night`] ? (
                                    <div>
                                        {nightShiftLog?.is_commit ? (
                                            // 已提交的日志，只显示只读内容
                                            <div className="bg-gray-50 p-4 rounded border">
                                                <div className="mb-2">
                                                    <span className="font-medium">作者：</span>
                                                    <span>{nightShiftLog?.employee_name}</span>
                                                </div>
                                                <div className="mb-2">
                                                    <span className="font-medium">日志内容：</span>
                                                    <div className="mt-1 p-2 bg-white rounded border">
                                                        {nightShiftLog?.duty_log || "暂无内容"}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="font-medium">待办事项：</span>
                                                    <div className="mt-1">
                                                        {parseTodos(nightShiftLog?.todo_log)
                                                            .length > 0 ? (
                                                            <ul className="list-disc list-inside">
                                                                {parseTodos(
                                                                    nightShiftLog?.todo_log
                                                                ).map((todo, index) => (
                                                                    <li
                                                                        key={index}
                                                                        className="text-gray-700"
                                                                    >
                                                                        {typeof todo === "string"
                                                                            ? todo
                                                                            : todo.text || todo}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <span className="text-gray-500">
                                                                暂无待办事项
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-sm text-green-600 font-medium">
                                                    ✓ 已提交
                                                </div>
                                            </div>
                                        ) : (
                                            // 未提交的日志，显示编辑表单
                                            <LogForm
                                                initialValues={{
                                                    author: nightShiftLog?.employee_name || "",
                                                    content: nightShiftLog?.duty_log || "",
                                                    todoItems:
                                                        parseTodos(nightShiftLog?.todo_log) || [],
                                                }}
                                                onSave={(formData) =>
                                                    handleSaveLog(formData, "night")
                                                }
                                            />
                                        )}
                                        {showLogForm[`${dateStr}-night`] && (
                                            <div className="flex justify-end mt-4">
                                                <Button onClick={() => handleCancelLog("night")}>
                                                    取消
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">暂无夜班日志记录</p>
                                )}
                            </div>
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
        showLogForm,
        hasDayShiftSchedule,
        hasNightShiftSchedule,
        dayShiftLogs,
        nightShiftLogs,
        handleAddDayShiftSchedule,
        handleAddNightShiftSchedule,
        createDutyLogMutation,
        updateDutyLogMutation,
        deleteDutyLogMutation,
    ]);

    /**
     * 处理月份选择变化
     * @param {dayjs.Dayjs} date - 选择的日期
     */
    const _handleMonthChange = useCallback((date) => {
        setSelectedMonth(date || dayjs());
    }, []);

    return (
        <Space
            direction="vertical"
            size="middle"
            style={{ width: "100%" }}
        >
            <DatePicker.MonthPicker
                value={selectedMonth}
                onChange={_handleMonthChange}
                placeholder="选择月份"
                style={{ width: 200 }}
                format="YYYY年MM月"
            />
            <Collapse
                items={items}
                defaultActiveKey={[""]}
                size="small"
            />
        </Space>
    );
}
