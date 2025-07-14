"use client";

import UploadComponent from "@/modules/eLearn/upload";
import HistoryDrawer from "@/components/eLearn/HistoryDrawer";

/**
 * 安全教育培训主页面
 * @returns {JSX.Element} 安全教育培训页面
 */
export default function ELearn() {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full p-4">
                <h1 className="text-2xl font-bold">安全教育培训</h1>
            </div>
            <div className="w-full h-full p-4">
                <UploadComponent />
            </div>

            {/* 历史记录抽屉 */}
            <HistoryDrawer />
        </div>
    );
}
