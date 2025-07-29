"use client";
import { Collapse, DatePicker, Space, Button } from "antd";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import LogForm from "../../components/calendar/LogForm.js";
import { useDutyLog } from "../../hooks/use-duty-log";
import { useCreateDutyLog, useUpdateDutyLog } from "../../queries/dutyLog/log/index";

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

    // 创建日志的mutation
    const createDutyLogMutation = useCreateDutyLog();
    // 更新日志的mutation
    const updateDutyLogMutation = useUpdateDutyLog();

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

            // 获取当天的白班和夜班数据
            const dayShiftData = getDutyDataByDateAndShift(dateStr, "0");
            const nightShiftData = getDutyDataByDateAndShift(dateStr, "1");
            const hasLog =
                (dayShiftData && dayShiftData.logContent) ||
                (nightShiftData && nightShiftData.logContent);

            // 处理创建白班日志
            const handleCreateDayShiftLog = () => {
                const requestData = {
                    duty_date: dateStr,
                    duty_log: "",
                    employee_id: "",
                    employee_name: "",
                    shift_type: "0",
                    todo_log: ""
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
                    }
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
                    todo_log: ""
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
                    }
                });
            };

            // 处理日志保存
            const handleSaveLog = (formData, shiftType) => {
                const requestData = {
                    duty_date: dateStr,
                    duty_log: formData.content || "",
                    employee_id: "",
                    employee_name: "",
                    shift_type: shiftType === "day" ? "0" : "1",
                    todo_log: formData.todoItems ? JSON.stringify(formData.todoItems) : ""
                };

                updateDutyLogMutation.mutate(requestData, {
                    onSuccess: () => {
                        console.log(`${shiftType === "day" ? "白班" : "夜班"}日志更新成功`);
                        // 保存成功后隐藏表单
                        setShowLogForm((prev) => ({
                            ...prev,
                            [`${dateStr}-${shiftType}`]: false,
                        }));
                    },
                    onError: (error) => {
                        console.error(`${shiftType === "day" ? "白班" : "夜班"}日志更新失败:`, error);
                    }
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
                                    {!showLogForm[`${dateStr}-day`] && (
                                        <Button
                                            type="primary"
                                            onClick={handleCreateDayShiftLog}
                                            disabled={!hasDayShift}
                                        >
                                            创建白班日志
                                        </Button>
                                    )}
                                </div>

                                {showLogForm[`${dateStr}-day`] ? (
                                    <div>
                                        <LogForm
                                            initialValues={{
                                                author: dayShiftData?.author || "",
                                                content: dayShiftData?.logContent || "",
                                                todoItems: dayShiftData?.todoItems || [],
                                            }}
                                            onSave={(formData) => handleSaveLog(formData, "day")}
                                        />
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={() => handleCancelLog("day")}>
                                                取消
                                            </Button>
                                        </div>
                                    </div>
                                ) : dayShiftData?.logContent ? (
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">已有日志记录</p>
                                        <div className="mt-2 text-sm">
                                            {dayShiftData.logContent}
                                        </div>
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
                                    {!showLogForm[`${dateStr}-night`] && (
                                        <Button
                                            type="primary"
                                            danger
                                            onClick={handleCreateNightShiftLog}
                                            disabled={!hasNightShift}
                                        >
                                            创建夜班日志
                                        </Button>
                                    )}
                                </div>

                                {showLogForm[`${dateStr}-night`] ? (
                                    <div>
                                        <LogForm
                                            initialValues={{
                                                author: nightShiftData?.author || "",
                                                content: nightShiftData?.logContent || "",
                                                todoItems: nightShiftData?.todoItems || [],
                                            }}
                                            onSave={(formData) => handleSaveLog(formData, "night")}
                                        />
                                        <div className="flex justify-end mt-4">
                                            <Button onClick={() => handleCancelLog("night")}>
                                                取消
                                            </Button>
                                        </div>
                                    </div>
                                ) : nightShiftData?.logContent ? (
                                    <div className="bg-gray-50 p-3 rounded">
                                        <p className="text-sm text-gray-600">已有日志记录</p>
                                        <div className="mt-2 text-sm">
                                            {nightShiftData.logContent}
                                        </div>
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
        getDutyDataByDateAndShift,
        handleAddDayShiftSchedule,
        handleAddNightShiftSchedule,
        createDutyLogMutation,
        updateDutyLogMutation,
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
