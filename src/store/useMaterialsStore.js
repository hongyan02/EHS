import { create } from "zustand";

/**
 * 物料申请状态管理
 * @typedef {Object} MaterialsStore
 * @property {Array} materialsData - 物料申请数据列表
 * @property {boolean} isLoading - 数据加载状态
 * @property {Object|null} error - 错误信息
 * @property {Object|null} selectedApplication - 当前选中的申请详情
 * @property {function} setMaterialsData - 设置物料申请数据
 * @property {function} setLoading - 设置加载状态
 * @property {function} setError - 设置错误信息
 * @property {function} setSelectedApplication - 设置选中的申请详情
 * @property {function} getApplicationByDanhao - 根据单号获取申请详情
 * @property {function} updateApplication - 更新申请数据
 * @property {function} deleteApplication - 删除申请数据
 * @property {function} resetStore - 重置状态
 */
const useMaterialsStore = create((set, get) => ({
    // 数据状态
    materialsData: [],
    isLoading: false,
    error: null,
    selectedApplication: null,

    // 设置物料申请数据
    setMaterialsData: (data) => {
        set({
            materialsData: data,
            error: null,
        });
    },

    // 设置加载状态
    setLoading: (loading) => {
        set({ isLoading: loading });
    },

    // 设置错误信息
    setError: (error) => {
        set({ error });
    },

    // 设置选中的申请详情
    setSelectedApplication: (application) => {
        set({ selectedApplication: application });
    },

    // 根据单号获取申请详情
    getApplicationByDanhao: (danhao) => {
        const { materialsData } = get();
        const application = materialsData.find((item) => item.danhao === danhao);
        if (application) {
            set({ selectedApplication: application });
        }
        return application;
    },

    // 更新申请数据
    updateApplication: (danhao, updatedData) => {
        const { materialsData } = get();
        const updatedList = materialsData.map((item) =>
            item.danhao === danhao ? { ...item, ...updatedData } : item
        );
        set({
            materialsData: updatedList,
            selectedApplication: updatedList.find((item) => item.danhao === danhao),
        });
    },

    // 删除申请数据
    deleteApplication: (danhao) => {
        const { materialsData } = get();
        const filteredList = materialsData.filter((item) => item.danhao !== danhao);
        set({
            materialsData: filteredList,
            selectedApplication: null,
        });
    },

    // 重置状态
    resetStore: () => {
        set({
            materialsData: [],
            isLoading: false,
            error: null,
            selectedApplication: null,
        });
    },
}));

export default useMaterialsStore;
