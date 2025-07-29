"use client";
import { useState, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { App } from "antd";
import {
    useDutyLogCalendarList,
    useCreateDutyLogCalendar,
    useUpdateDutyLogCalendar,
} from "../queries/dutyLog/calendar/index";

/**
 * 值班表管理自定义Hook
 * @param {dayjs.Dayjs} selectedMonth - 选择的月份
 * @returns {Object} 值班表相关的状态和方法
 */
export const useDutyLog = (selectedMonth) => {
    const { message } = App.useApp();
    const createDutyLogMutation = useCreateDutyLogCalendar();
    const updateDutyLogMutation = useUpdateDutyLogCalendar();

    // 生成查询参数
    const getQueryParams = useCallback((month) => {
        const startDate = month.startOf("month").format("YYYY-MM-DD");
        const endDate = month.endOf("month").format("YYYY-MM-DD");
        return {
            start_duty_date: startDate,
            end_duty_date: endDate,
        };
    }, []);

    // 生成查询参数
    const queryParams = useMemo(
        () => getQueryParams(selectedMonth),
        [selectedMonth, getQueryParams]
    );

    // 使用hook获取数据，让React Query自动处理缓存
    const { data: dutyData = [] } = useDutyLogCalendarList(queryParams);

    // 确保数据是数组类型
    const finalData = useMemo(() => (Array.isArray(dutyData) ? dutyData : []), [dutyData]);

    /**
     * 从员工数据中提取白班表单初始值
     * @param {Array} employees - 员工数组
     * @returns {Object} 白班表单初始值
     */
    const getDayShiftInitialValues = useCallback((employees) => {
        if (!Array.isArray(employees)) return {};

        const values = {};
        employees.forEach((emp) => {
            switch (emp.position) {
                case "dayDutyLeader":
                    values.dayDutyLeader = emp.employee_name;
                    values.dayDutyLeaderPhone = emp.phone;
                    break;
                case "dayDutyManager":
                    values.dayDutyManager = emp.employee_name;
                    values.dayDutyManagerPhone = emp.phone;
                    break;
                case "daySafetyManager":
                    values.daySafetyManager = emp.employee_name;
                    values.daySafetyManagerPhone = emp.phone;
                    break;
                case "daySafetyOfficer":
                    values.daySafetyOfficer = emp.employee_name;
                    values.daySafetyOfficerPhone = emp.phone;
                    break;
            }
        });
        return values;
    }, []);

    /**
     * 从员工数据中提取夜班表单初始值
     * @param {Array} employees - 员工数组
     * @returns {Object} 夜班表单初始值
     */
    const getNightShiftInitialValues = useCallback((employees) => {
        if (!Array.isArray(employees)) return {};

        const values = {};
        employees.forEach((emp) => {
            switch (emp.position) {
                case "nightDutyLeader":
                    values.nightDutyLeader = emp.employee_name;
                    values.nightDutyLeaderPhone = emp.phone;
                    break;
                case "nightSafetyOfficer":
                    values.nightSafetyOfficer = emp.employee_name;
                    values.nightSafetyOfficerPhone = emp.phone;
                    break;
            }
        });
        return values;
    }, []);

    /**
     * 获取指定日期的值班数据
     * @param {string} dateStr - 日期字符串
     * @returns {Object|null} 值班数据
     */
    const getDutyDataByDate = useCallback(
        (dateStr) => {
            return finalData.find((item) => item.duty_date === dateStr) || null;
        },
        [finalData]
    );

    /**
     * 获取指定日期和班次的值班数据
     * @param {string} dateStr - 日期字符串
     * @param {string} shiftType - 班次类型 "0"=白班, "1"=夜班
     * @returns {Object|null} 值班数据
     */
    const getDutyDataByDateAndShift = useCallback(
        (dateStr, shiftType) => {
            return (
                finalData.find(
                    (item) => item.duty_date === dateStr && item.shift_type === shiftType
                ) || null
            );
        },
        [finalData]
    );

    /**
     * 检查指定日期是否有值班表
     * @param {string} dateStr - 日期字符串 YYYY-MM-DD
     * @returns {boolean} 是否有值班表
     */
    const hasDutySchedule = useCallback(
        (dateStr) => {
            return Array.isArray(finalData) && finalData.some((item) => item.duty_date === dateStr);
        },
        [finalData]
    );

    /**
     * 检查指定日期是否有白班值班表
     * @param {string} dateStr - 日期字符串 YYYY-MM-DD
     * @returns {boolean} 是否有白班值班表
     */
    const hasDayShiftSchedule = useCallback(
        (dateStr) => {
            return (
                Array.isArray(finalData) &&
                finalData.some((item) => item.duty_date === dateStr && item.shift_type === "0")
            );
        },
        [finalData]
    );

    /**
     * 检查指定日期是否有夜班值班表
     * @param {string} dateStr - 日期字符串 YYYY-MM-DD
     * @returns {boolean} 是否有夜班值班表
     */
    const hasNightShiftSchedule = useCallback(
        (dateStr) => {
            return (
                Array.isArray(finalData) &&
                finalData.some((item) => item.duty_date === dateStr && item.shift_type === "1")
            );
        },
        [finalData]
    );

    /**
     * 处理添加白班值班表
     * @param {string} date - 日期字符串
     */
    const handleAddDayShiftSchedule = useCallback(
        (date) => {
            // 获取星期几 (0=周日, 1=周一, ..., 6=周六)
            const weekDay = dayjs(date).day();

            // 创建空的白班值班表记录
            const dutyData = {
                duty_date: date,
                employees: [],
                phone: "",
                position: "",
                shift_type: "0", // 白班
                week: weekDay,
            };

            // 调用创建API
            createDutyLogMutation.mutate(dutyData, {
                onSuccess: () => {
                    // 创建成功
                    message.success("白班值班表创建成功");
                },
                onError: (error) => {
                    console.error("创建白班值班表失败:", error);
                    message.error("创建白班值班表失败，请重试");
                },
            });
        },
        [createDutyLogMutation, message]
    );

    /**
     * 处理添加夜班值班表
     * @param {string} date - 日期字符串
     */
    const handleAddNightShiftSchedule = useCallback(
        (date) => {
            // 获取星期几 (0=周日, 1=周一, ..., 6=周六)
            const weekDay = dayjs(date).day();

            // 创建空的夜班值班表记录
            const dutyData = {
                duty_date: date,
                employees: [],
                phone: "",
                position: "",
                shift_type: "1", // 夜班
                week: weekDay,
            };

            // 调用创建API
            createDutyLogMutation.mutate(dutyData, {
                onSuccess: () => {
                    // 创建成功
                    message.success("夜班值班表创建成功");
                },
                onError: (error) => {
                    console.error("创建夜班值班表失败:", error);
                    message.error("创建夜班值班表失败，请重试");
                },
            });
        },
        [createDutyLogMutation, message]
    );

    /**
     * 处理添加值班表（兼容旧接口，默认创建白班）
     * @param {string} date - 日期字符串
     */
    const handleAddDutySchedule = useCallback(
        (date) => {
            handleAddDayShiftSchedule(date);
        },
        [handleAddDayShiftSchedule]
    );

    /**
     * 处理白班表单保存
     * @param {string} date - 日期字符串
     * @param {Object} values - 表单数据
     */
    const handleSaveDayShift = useCallback(
        (date, values) => {
            // 从缓存中查找对应日期的白班值班表记录
            const dutyRecord = getDutyDataByDateAndShift(date, "0");
            if (!dutyRecord) {
                console.error("未找到对应日期的白班值班表记录");
                return;
            }

            // 构建employees数组
            const employees = [];

            // 处理白班各个岗位的人员信息
            const positions = [
                {
                    field: "dayDutyLeader",
                    phoneField: "dayDutyLeaderPhone",
                    position: "dayDutyLeader",
                },
                {
                    field: "dayDutyManager",
                    phoneField: "dayDutyManagerPhone",
                    position: "dayDutyManager",
                },
                {
                    field: "daySafetyManager",
                    phoneField: "daySafetyManagerPhone",
                    position: "daySafetyManager",
                },
                {
                    field: "daySafetyOfficer",
                    phoneField: "daySafetyOfficerPhone",
                    position: "daySafetyOfficer",
                },
            ];

            positions.forEach(({ field, phoneField, position }) => {
                if (values[field]) {
                    employees.push({
                        employee_id: "",
                        employee_name: values[field],
                        phone: values[phoneField] || "",
                        position: position,
                    });
                }
            });

            // 构建更新请求体
            const updateData = {
                duty_date: date,
                employees: employees,
                id: dutyRecord.id,
                shift_type: "0", // 白班
                week: dayjs(date).day(),
            };

            // 调用更新API
            updateDutyLogMutation.mutate(updateData, {
                onSuccess: () => {
                    message.success("白班信息保存成功！");
                },
                onError: (error) => {
                    console.error("保存白班信息失败:", error);
                    message.error("保存白班信息失败，请重试");
                },
            });
        },
        [updateDutyLogMutation, getDutyDataByDateAndShift, message]
    );

    /**
     * 处理夜班表单保存
     * @param {string} date - 日期字符串
     * @param {Object} values - 表单数据
     */
    const handleSaveNightShift = useCallback(
        (date, values) => {
            // 从缓存中查找对应日期的夜班值班表记录
            const dutyRecord = getDutyDataByDateAndShift(date, "1");
            if (!dutyRecord) {
                console.error("未找到对应日期的夜班值班表记录");
                return;
            }

            // 构建employees数组
            const employees = [];

            // 处理夜班各个岗位的人员信息
            const positions = [
                {
                    field: "nightDutyLeader",
                    phoneField: "nightDutyLeaderPhone",
                    position: "nightDutyLeader",
                },
                {
                    field: "nightSafetyOfficer",
                    phoneField: "nightSafetyOfficerPhone",
                    position: "nightSafetyOfficer",
                },
            ];

            positions.forEach(({ field, phoneField, position }) => {
                if (values[field]) {
                    employees.push({
                        employee_id: "",
                        employee_name: values[field],
                        phone: values[phoneField] || "",
                        position: position,
                    });
                }
            });

            // 构建更新请求体
            const updateData = {
                duty_date: date,
                employees: employees,
                id: dutyRecord.id,
                shift_type: "1", // 夜班
                week: dayjs(date).day(),
            };

            // 调用更新API
            updateDutyLogMutation.mutate(updateData, {
                onSuccess: () => {
                    message.success("夜班信息保存成功！");
                },
                onError: (error) => {
                    console.error("保存夜班信息失败:", error);
                    message.error("保存夜班信息失败，请重试");
                },
            });
        },
        [getDutyDataByDateAndShift, message, updateDutyLogMutation]
    );

    return {
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
    };
};
