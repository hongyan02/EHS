import { Tabs } from "antd";
import DutyLogCalendar from "@/components/calendar/calendar";

export default function DutyTabs() {
    const items = [
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
    ];
    return (
        <div className="p-4">
            <Tabs items={items} type="card" />
        </div>
    );
}
