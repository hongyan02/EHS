"use client";
import Risk from "../../modules/dangerSource/risk";
import Area from "../../modules/dangerSource/area";
import { AlertTwoTone, AppstoreTwoTone } from "@ant-design/icons";
import { Segmented } from "antd";
import { useState } from "react";

export default function DangerSourcePage() {
    const [view, setView] = useState("危险源");
    return (
        <div className="w-full h-full">
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">危险源管理</h1>
                <Segmented
                    options={[
                        {
                            key: "danger-source",
                            value: "危险源",
                            label: "危险源",
                            icon: <AlertTwoTone />,
                        },
                        {
                            key: "area",
                            value: "区域",
                            label: "区域",
                            icon: <AppstoreTwoTone />,
                        },
                    ]}
                    value={view}
                    onChange={setView}
                />
            </div>

            {/* 根据选中的视图渲染不同内容 */}
            <div className="h-full w-full">
                {view === "危险源" && <Risk />}
                {view === "区域" && <Area />}
            </div>
        </div>
    );
}
