import { create } from "zustand";

/**
 * 危险源状态管理
 */
const useDangerSourceStore = create((set) => ({
    // 搜索状态
    searchParams: { keyword: "" },

    // 表格筛选状态
    tableFilters: {},

    // 模态框状态
    modalVisible: false,
    editingItem: null,

    /**
     * 设置搜索关键字
     * @param {string} keyword - 搜索关键字
     */
    setSearchKeyword: (keyword) => {
        set({ searchParams: { keyword: keyword.trim() } });
    },

    /**
     * 重置搜索
     */
    resetSearch: () => {
        set({ searchParams: { keyword: "" } });
    },

    /**
     * 设置表格筛选
     * @param {Object} filters - 筛选条件
     */
    setTableFilters: (filters) => {
        set({ tableFilters: filters });
    },

    /**
     * 重置表格筛选
     */
    resetTableFilters: () => {
        set({ tableFilters: {} });
    },

    /**
     * 重置所有（搜索+筛选）
     */
    resetAll: () => {
        set({
            searchParams: { keyword: "" },
            tableFilters: {},
        });
    },

    /**
     * 打开编辑模态框
     * @param {Object|null} item - 编辑项目，null表示新增
     */
    openModal: (item = null) => {
        console.log("打开模态框，传入的数据:", item);
        set({ modalVisible: true, editingItem: item ? { ...item } : null });
    },

    /**
     * 关闭模态框
     */
    closeModal: () => {
        set({ modalVisible: false, editingItem: null });
    },
}));

export default useDangerSourceStore;
