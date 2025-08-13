"use client";
import WeekTable from "@/components/calendar/WeekTable";
import { useDutyLogCalendarList } from "@/queries/dutyLog/calendar/index";
import { Spin, Alert, DatePicker } from "antd";
import { useState } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

// 扩展dayjs插件
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export default function WeekPage() {
    // 状态管理：选择的周
    const [selectedWeek, setSelectedWeek] = useState(dayjs());

    // 根据选择的周获取日期范围
    const getWeekRange = (weekDate) => {
        const startOfWeek = weekDate.startOf('isoWeek'); // 周一开始
        const endOfWeek = weekDate.endOf('isoWeek'); // 周日结束

        return {
            start_duty_date: startOfWeek.format('YYYY-MM-DD'),
            end_duty_date: endOfWeek.format('YYYY-MM-DD'),
        };
    };

    // 处理周选择变化
    const handleWeekChange = (date) => {
        if (date) {
            setSelectedWeek(date);
        }
    };

    // 获取选择周的值班数据
    const { data: dutyData, isLoading, error } = useDutyLogCalendarList(getWeekRange(selectedWeek));

    if (isLoading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large">
                    <div style={{ padding: "20px" }}>加载值班数据中...</div>
                </Spin>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <Alert
                    message="数据加载失败"
                    description={error.message || "无法获取值班数据，请稍后重试"}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    // 创建周选择器组件
    const weekSelector = (
        <DatePicker
            picker="week"
            value={selectedWeek}
            onChange={handleWeekChange}
            format="YYYY年第WW周"
            placeholder="请选择周"
            style={{ width: '200px' }}
            allowClear={false}
        />
    );

    // 获取选择周的信息
    const selectedWeekInfo = {
        title: selectedWeek.format('YYYY年第WW周'),
        startDate: getWeekRange(selectedWeek).start_duty_date,
        endDate: getWeekRange(selectedWeek).end_duty_date,
    };

    return (
        <div>
            <WeekTable 
                apiData={{ data: dutyData }} 
                weekSelector={weekSelector}
                selectedWeekInfo={selectedWeekInfo}
            />
        </div>
    );
}
