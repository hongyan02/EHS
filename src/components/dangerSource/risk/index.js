"use client";
import { useQueryClient } from "@tanstack/react-query";
import useDangerSourceStore from "@/store/dangerSourceStore";
import { useRiskSourceListQuery, useRiskSourceSearchQuery } from "@/hooks/useRiskSourceQuery";
import DangerSourceTable from "@/components/dangerSource/risk/dangerSoureTable";
import DangerSourceActionBar from "@/components/dangerSource/risk/dangerSourceAction";

/**
 * 危险源表格视图组件
 * @returns {JSX.Element} 危险源表格视图
 */
export default function DangerSourceTableView() {
    const queryClient = useQueryClient();
    const { searchParams, tableFilters, setTableFilters, openModal } = useDangerSourceStore();
    const hasKeyword = searchParams.keyword?.trim();

    // 数据查询
    const searchQuery = useRiskSourceSearchQuery(searchParams.keyword, {
        enabled: !!hasKeyword,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });

    const listQuery = useRiskSourceListQuery(
        {},
        {
            enabled: !hasKeyword,
            staleTime: 0,
            refetchOnWindowFocus: true,
        }
    );

    const currentQuery = hasKeyword ? searchQuery : listQuery;
    const rawData = currentQuery.data || [];
    const isLoading = currentQuery.isLoading;
    const error = currentQuery.error;

    const tableData = rawData.map(({ id, ...rest }) => rest).reverse();

    /**
     * 处理数据变更（用于刷新表格等）
     */
    const _handleDataChange = () => {
        queryClient.invalidateQueries({
            queryKey: ["riskSource"],
            refetchType: "active",
        });
        console.log("数据已更新，已刷新表格");
    };

    /**
     * 处理表格变化（包括筛选、排序等）
     * @param {Object} pagination - 分页信息
     * @param {Object} filters - 筛选信息
     * @param {Object} sorter - 排序信息
     */
    const _handleTableChange = (pagination, filters, sorter) => {
        setTableFilters(filters);
    };

    /**
     * 处理编辑危险源
     * @param {Object} record - 当前行数据
     */
    const _handleEdit = (record) => {
        console.log("编辑危险源，当前行数据:", record);
        openModal({ ...record });
    };

    /**
     * 处理删除成功后的数据刷新
     */
    const _handleDeleteSuccess = () => {
        setTimeout(() => {
            console.log("删除成功，开始刷新查询缓存...");
            queryClient.invalidateQueries({
                queryKey: ["riskSource"],
                refetchType: "all",
            });
            queryClient.refetchQueries({
                queryKey: ["riskSource", "list"],
            });
            queryClient.refetchQueries({
                queryKey: ["riskSource", "search"],
            });
            console.log("删除后查询缓存刷新完成");
        }, 100);
    };

    return (
        <div className="w-full bg-gray-50">
            <div className="w-full">
                {/* 上下布局容器 */}
                <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                    {/* 上部分：搜索和按钮容器 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
                        <DangerSourceActionBar onDataChange={_handleDataChange} />
                    </div>

                    {/* 下部分：表格容器 */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4 lg:p-6">
                        <DangerSourceTable
                            dataSource={tableData}
                            loading={isLoading}
                            error={error?.message}
                            tableFilters={tableFilters}
                            onTableChange={_handleTableChange}
                            onEdit={_handleEdit}
                            onDelete={_handleDeleteSuccess}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
