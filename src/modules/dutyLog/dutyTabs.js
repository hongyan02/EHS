"use client";
import { Tabs } from "antd";
import DutyLogCalendar from "@/components/calendar/calendar";
import CollapseDate from "./collapseDate";
import { useMobile } from "@/hooks/use-mobile";

/**
 * 值班选项卡组件
 * 在移动端只显示"值班管理"选项卡，桌面端显示所有选项卡
 * @returns {JSX.Element} 值班选项卡组件
 */
export default function DutyTabs() {
    const isMobile = useMobile();

    // 移动端只显示值班管理选项卡
    const mobileItems = [
        {
            key: "3",
            label: "值班管理",
            children: <CollapseDate />,
        },
    ];

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
            children: <div>值班记录</div>,
        },
        {
            key: "3",
            label: "值班管理",
            children: <CollapseDate />,
        },
    ];

    // 根据设备类型选择对应的items
    const items = isMobile ? mobileItems : desktopItems;

    return (
        <div className="p-4">
            <Tabs items={items} type="card" defaultActiveKey={isMobile ? "3" : "1"} />
        </div>
    );
}
