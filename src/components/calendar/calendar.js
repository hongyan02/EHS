"use client";
import React, { useState } from "react";
import { Calendar, Badge, Button } from "antd";
import { useRouter } from "next/navigation";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

/**
 * 值班日志日历组件
 * @returns {JSX.Element} 日历组件
 */
export default function DutyLogCalendar() {
    const router = useRouter();
    const [currentShift, setCurrentShift] = useState("day");

    const dutyData = [
        {
            dutyDate: "2025-07-14",
            // 白班数据
            dayDutyLeader: ["张三"],
            dayDutyManager: ["李四"],
            daySafetyManager: ["王五"],
            daySafetyOfficer: ["赵六"],
            // 夜班数据
            nightDutyLeader: ["孙七"],
            nightSafetyOfficer: ["周八"],
        },
        {
            dutyDate: "2025-07-15",
            // 白班数据
            dayDutyLeader: ["刘九"],
            dayDutyManager: ["陈十"],
            daySafetyManager: [],
            daySafetyOfficer: ["吴十一"],
            // 夜班数据
            nightDutyLeader: ["郑十二"],
            nightSafetyOfficer: [],
        },
        {
            dutyDate: "2025-07-16",
            // 白班数据
            dayDutyLeader: ["马十三"],
            dayDutyManager: [],
            daySafetyManager: ["朱十四"],
            daySafetyOfficer: ["许十五"],
            // 夜班数据
            nightDutyLeader: [],
            nightSafetyOfficer: ["何十六"],
        },
        {
            dutyDate: "2025-07-17",
            // 白班数据
            dayDutyLeader: ["高十七", "林十八"],
            dayDutyManager: ["谢十九"],
            daySafetyManager: ["袁二十"],
            daySafetyOfficer: [],
            // 夜班数据
            nightDutyLeader: ["钱二一"],
            nightSafetyOfficer: ["孙二二", "李二三"],
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
        const monthData = dutyData.filter((item) => item.dutyDate.startsWith(monthStr));
        let totalCount = 0;

        monthData.forEach((item) => {
            if (currentShift === "day") {
                // 只统计白班岗位人数
                totalCount += (item.dayDutyLeader || []).length;
                totalCount += (item.dayDutyManager || []).length;
                totalCount += (item.daySafetyManager || []).length;
                totalCount += (item.daySafetyOfficer || []).length;
            } else {
                // 只统计夜班岗位人数
                totalCount += (item.nightDutyLeader || []).length;
                totalCount += (item.nightSafetyOfficer || []).length;
            }
        });

        return totalCount > 0 ? totalCount : null;
    };

    /**
     * 渲染月份单元格内容
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {JSX.Element|null} 月份单元格内容
     */
    const _monthCellRender = (value) => {
        const num = _getMonthData(value);
        const shiftText = currentShift === "day" ? "白班" : "夜班";
        const textColor = currentShift === "day" ? "text-blue-600" : "text-red-600";

        return num ? (
            <div className="text-center text-xs">
                <div className={`text-lg font-bold ${textColor}`}>{num}</div>
                <span className="text-gray-600">{shiftText}安排</span>
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
        const dateData = _getListData(value);
        if (!dateData.length) return null;

        const data = dateData[0]; // 取第一条数据
        const badgeItems = [];

        // 白班岗位配置（蓝色Badge）
        const dayShiftRoles = [
            { key: "dayDutyLeader", label: "值班领导" },
            { key: "dayDutyManager", label: "带班干部" },
            { key: "daySafetyManager", label: "安全管理人员" },
            { key: "daySafetyOfficer", label: "安全员" },
        ];

        // 夜班岗位配置（红色Badge）
        const nightShiftRoles = [
            { key: "nightDutyLeader", label: "值班领导" },
            { key: "nightSafetyOfficer", label: "安全员" },
        ];

        if (currentShift === "day") {
            // 只显示白班岗位Badge
            dayShiftRoles.forEach((role) => {
                const personnel = data[role.key] || [];
                personnel.forEach((person, index) => {
                    badgeItems.push(
                        <li key={`day-${role.key}-${index}`} className="text-xs leading-tight">
                            <Badge status="processing" text={`${role.label}：${person}`} />
                        </li>
                    );
                });
            });
        } else {
            // 只显示夜班岗位Badge
            nightShiftRoles.forEach((role) => {
                const personnel = data[role.key] || [];
                personnel.forEach((person, index) => {
                    badgeItems.push(
                        <li key={`night-${role.key}-${index}`} className="text-xs leading-tight">
                            <Badge status="error" text={`${role.label}：${person}`} />
                        </li>
                    );
                });
            });
        }

        return (
            <div
                className="w-full h-full p-1 rounded cursor-pointer transition-colors duration-200"
                onDoubleClick={() => _handleDateDoubleClick(value)}
            >
                <ul className="list-none m-0 p-0 space-y-0.5">{badgeItems}</ul>
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

    /**
     * 处理班次切换
     */
    const _handleShiftToggle = () => {
        setCurrentShift(currentShift === "day" ? "night" : "day");
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <Button
                    type="primary"
                    size="large"
                    onClick={_handleShiftToggle}
                    style={{
                        backgroundColor: currentShift === "day" ? "#1890ff" : "#ff4d4f",
                        borderColor: currentShift === "day" ? "#1890ff" : "#ff4d4f",
                        minWidth: "120px",
                    }}
                >
                    <span className="font-semibold">
                        {currentShift === "day" ? "白班" : "夜班"}
                    </span>
                </Button>
            </div>
            <Calendar locale={zhCN} cellRender={_cellRender} />
        </div>
    );
}
