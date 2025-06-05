import { create } from "zustand";

/**
 * 危险源状态管理store
 */
const useDangerSourceStore = create((set, get) => ({
    // 搜索状态
    searchParams: {
        keyword: "",
    },

    // 表格数据状态
    tableData: [],
    loading: false,
    total: 0,

    /**
     * 设置搜索参数
     * @param {Object} params - 搜索参数
     */
    setSearchParams: (params) =>
        set((state) => ({
            searchParams: {
                ...state.searchParams,
                ...params,
            },
        })),

    /**
     * 重置搜索参数
     */
    resetSearchParams: () =>
        set({
            searchParams: {
                keyword: "",
            },
        }),

    /**
     * 设置表格数据
     * @param {Array} data - 表格数据
     * @param {number} total - 总数
     */
    setTableData: (data, total = 0) =>
        set({
            tableData: data,
            total,
        }),

    /**
     * 设置加载状态
     * @param {boolean} loading - 加载状态
     */
    setLoading: (loading) => set({ loading }),

    /**
     * 获取查询键（用于React Query）
     */
    getQueryKey: () => {
        const { searchParams } = get();
        return ["danger-source-list", searchParams];
    },
}));

export default useDangerSourceStore;
