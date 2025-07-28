"use client";
import React, { useState } from "react";
import { Calendar, Badge, Button } from "antd";
import { useRouter } from "next/navigation";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import dayjs from "dayjs";
import { useDutyLogCalendarList } from "../../queries/dutyLog/calendar/index";

/**
 * 值班日志日历组件
 * @returns {JSX.Element} 日历组件
 */
export default function DutyLogCalendar() {
    const router = useRouter();
    const [currentShift, setCurrentShift] = useState("day");
    const [currentMonth, setCurrentMonth] = useState(dayjs());

    // 根据当前月份生成查询参数
    const getQueryParams = (month) => {
        const startDate = month.startOf('month').format('YYYY-MM-DD');
        const endDate = month.endOf('month').format('YYYY-MM-DD');
        return {
            start_duty_date: startDate,
            end_duty_date: endDate
        };
    };

    // 使用API获取值班数据
    const { data: dutyData = [], isLoading, error } = useDutyLogCalendarList(getQueryParams(currentMonth));

    /**
     * 获取指定日期的值班数据
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {Array} 值班数据列表
     */
    const _getListData = (value) => {
        const dateStr = value.format("YYYY-MM-DD");
        return dutyData.filter((item) => item.duty_date === dateStr);
    };

    /**
     * 获取指定月份的统计数据
     * @param {dayjs.Dayjs} value - 日期值
     * @returns {number} 统计数量
     */
    const _getMonthData = (value) => {
        const monthStr = value.format("YYYY-MM");
        const monthData = dutyData.filter((item) => item.duty_date.startsWith(monthStr));
        let totalCount = 0;

        monthData.forEach((item) => {
            // 根据shift_type筛选班次："0"为白班，"1"为夜班
            if ((currentShift === "day" && item.shift_type === "0") || 
                (currentShift === "night" && item.shift_type === "1")) {
                totalCount += (item.employees || []).length;
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

        const badgeItems = [];

        // 根据当前班次筛选数据
        const filteredData = dateData.filter(item => {
            return (currentShift === "day" && item.shift_type === "0") || 
                   (currentShift === "night" && item.shift_type === "1");
        });

        if (!filteredData.length) return null;

        // 职位映射表
        const positionLabels = {
            // 白班职位
            'dayDutyLeader': '值班领导',
            'dayDutyManager': '带班干部',
            'daySafetyManager': '安全管理人员',
            'daySafetyOfficer': '安全员',
            // 夜班职位
            'nightDutyLeader': '值班领导',
            'nightSafetyOfficer': '安全员'
        };

        // 渲染每个值班记录
        filteredData.forEach((dutyItem, dutyIndex) => {
            const employees = dutyItem.employees || [];
            employees.forEach((employee, empIndex) => {
                const badgeStatus = currentShift === "day" ? "processing" : "error";
                const positionLabel = positionLabels[employee.position] || '职员';
                const displayText = `${positionLabel}：${employee.employee_name}`;
                
                badgeItems.push(
                    <li key={`${dutyIndex}-${empIndex}`} className="text-xs leading-tight">
                        <Badge status={badgeStatus} text={displayText} />
                    </li>
                );
            });
        });

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

    /**
     * 处理月份变化
     * @param {dayjs.Dayjs} date - 新的月份
     */
    const _handlePanelChange = (date) => {
        setCurrentMonth(date);
    };

    if (isLoading) {
        return <div className="text-center p-4">加载中...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">加载失败：{error.message}</div>;
    }

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
            <Calendar 
                locale={zhCN} 
                cellRender={_cellRender} 
                onPanelChange={_handlePanelChange}
            />
        </div>
    );
}
