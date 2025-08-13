"use client";
import WeekTable from "@/components/calendar/WeekTable";
import { useDutyLogCalendarList } from "@/queries/dutyLog/calendar/index";
import { Spin, Alert } from "antd";

export default function WeekPage() {
    // 获取当月的开始和结束日期
    const getCurrentMonthRange = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        // 当月第一天
        const startDate = new Date(year, month, 1);
        // 当月最后一天
        const endDate = new Date(year, month + 1, 0);

        return {
            start_duty_date: startDate.toISOString().split("T")[0], // yyyy-mm-dd格式
            end_duty_date: endDate.toISOString().split("T")[0], // yyyy-mm-dd格式
        };
    };

    // 获取当前月的值班数据
    const { data: dutyData, isLoading, error } = useDutyLogCalendarList(getCurrentMonthRange());

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

    return (
        <div>
            <WeekTable apiData={{ data: dutyData }} />
        </div>
    );
}
