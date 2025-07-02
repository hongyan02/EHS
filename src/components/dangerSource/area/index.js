"use client";
import { useQueryClient } from "@tanstack/react-query";
import DangerAreaList from "./dangerAreaList";
import DangerAreaActionBar from "./dangerAreaAction";

/**
 * 危险区域视图组件
 * @returns {JSX.Element} 危险区域视图
 */
export default function DangerAreaView() {
    const queryClient = useQueryClient();

    /**
     * 处理数据变更（用于刷新列表等）
     */
    const _handleDataChange = () => {
        // 使用React Query的invalidateQueries来刷新危险区域数据
        queryClient.invalidateQueries({
            queryKey: ["dangerArea"],
            refetchType: "active",
        });
        console.log("区域数据已更新，已刷新列表");
    };

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="w-full p-3 sm:p-4 lg:p-6">
                {/* 上下布局容器 - 使用flex布局 */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                    {/* 上部分：搜索和按钮容器 - 固定高度 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 flex-shrink-0">
                        {/* 搜索、按钮等组件容器 */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <DangerAreaActionBar onDataChange={_handleDataChange} />
                        </div>
                    </div>

                    {/* 下部分：列表容器 - 自适应高度 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6">
                        <DangerAreaList />
                    </div>
                </div>
            </div>
        </div>
    );
}
