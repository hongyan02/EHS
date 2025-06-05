"use client";
import LedgerTable from "../../components/ledger/ledger-table";
import SearchBar from "../../components/ledger/search-bar";

/**
 * 账本页面组件
 * @returns {JSX.Element} 账本页面
 */
export default function LedgerPage() {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col p-3 sm:p-4 lg:p-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 px-1">
                    事故事件台账
                </h1>

                {/* 上下布局容器 - 使用flex布局 */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6 flex-1">
                    {/* 上部分：搜索和按钮容器 - 固定高度 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 flex-shrink-0">
                        {/* 搜索、按钮等组件容器 */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                            <SearchBar placeholder="搜索事故事件记录..." />
                        </div>
                    </div>

                    {/* 下部分：表格容器 - 占据剩余高度 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6 flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-auto">
                            <LedgerTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
