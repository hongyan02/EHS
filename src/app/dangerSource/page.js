"use client";
import { useState } from "react";
import { Segmented } from "antd";
import { AlertTwoTone, AppstoreTwoTone } from "@ant-design/icons";
import DangerSourceTableView from "@/components/dangerSource/risk/index";
import DangerAreaView from "@/components/dangerSource/area/index";

/**
 * 危险源主页面组件
 * @returns {JSX.Element} 危险源主页面
 */
export default function DangerSourceMainPage() {
    const [view, setView] = useState("危险源");

    return (
        <div className="w-full bg-gray-50">
            <div className="w-full p-3 sm:p-4 lg:p-6">
                {/* 页面标题和视图切换 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800 px-1">危险源管理</h1>

                    {/* 视图切换Segmented */}
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
                <div>
                    {view === "危险源" && <DangerSourceTableView />}
                    {view === "区域" && <DangerAreaView />}
                </div>
            </div>
        </div>
    );
}
