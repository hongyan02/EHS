"use client";
import { Tabs } from "antd";
import DutyLogCalendar from "../../components/calendar/calendar.js";
import CollapseDate from "./collapseDate.js";
import LogForm from "../../components/calendar/LogForm.js";
import DutyLog from "./dutyLog.js";
import WriteLog from "./writeLog.js";

/**
 * 值班选项卡组件
 * 在移动端只显示"值班管理"选项卡，桌面端显示所有选项卡
 * @returns {JSX.Element} 值班选项卡组件
 */
export default function DutyTabs() {
    // 桌面端显示所有选项卡
    const desktopItems = [
        {
            key: "1",
            label: "日历",
            children: <DutyLogCalendar />,
        },
        {
            key: "2",
            label: "值班记录",
            children: <DutyLog />,
        },
        {
            key: "3",
            label: "值班管理",
            children: <CollapseDate />,
        },
        {
            key: "4",
            label: "值班日志",
            children: <WriteLog />,
        },
    ];

    return (
        <div className="p-4">
            <Tabs items={desktopItems} type="card" defaultActiveKey="1" />
        </div>
    );
}
