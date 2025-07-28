"use client";
import DutyTabs from "../../modules/dutyLog/dutyTabs";
import DutyLogHeader from "../../modules/dutyLog/header";

export default function DutyLog() {
    return (
        <div className="h-full w-full bg-white">
            <DutyLogHeader />
            <DutyTabs />
        </div>
    );
}
