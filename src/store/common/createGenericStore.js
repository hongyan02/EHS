import { create } from "zustand";

/**
 * 创建通用的数据列表状态管理store
 * @param {string} name - store名称
 * @param {Object} defaultSearchParams - 默认搜索参数
 * @returns {Function} zustand store
 */
export const createGenericListStore = (name, defaultSearchParams = { keyword: "" }) => {
    return create((set, get) => ({
        // 搜索状态
        searchParams: defaultSearchParams,

        // 表格数据状态
        tableData: [],
        loading: false,
        total: 0,

        // 模态框状态
        modalVisible: false,
        editingItem: null,

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
                searchParams: defaultSearchParams,
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
         * 打开模态框
         * @param {Object} item - 编辑项目
         */
        openModal: (item = null) =>
            set({
                modalVisible: true,
                editingItem: item,
            }),

        /**
         * 关闭模态框
         */
        closeModal: () =>
            set({
                modalVisible: false,
                editingItem: null,
            }),

        /**
         * 获取查询键（用于React Query）
         */
        getQueryKey: () => {
            const { searchParams } = get();
            return [`${name}-list`, searchParams];
        },
    }));
};

/**
 * 创建危险源store
 */
export const createDangerSourceStore = () => createGenericListStore("danger-source");

/**
 * 创建区域store
 */
export const createDangerAreaStore = () => createGenericListStore("danger-area");
