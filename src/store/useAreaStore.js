import { create } from "zustand";

/**
 * 区域状态管理
 * @typedef {Object} AreaStore
 * @property {boolean} isDetailDrawerOpen - 详情抽屉是否打开
 * @property {boolean} isSubDrawerOpen - 子抽屉是否打开
 * @property {Object|null} selectedArea - 当前选中的区域数据
 * @property {string} subDrawerType - 子抽屉类型（edit, settings, etc.）
 * @property {Object} subDrawerData - 子抽屉数据
 * @property {function} openDetailDrawer - 打开详情抽屉
 * @property {function} closeDetailDrawer - 关闭详情抽屉
 * @property {function} openSubDrawer - 打开子抽屉
 * @property {function} closeSubDrawer - 关闭子抽屉
 * @property {function} setSelectedArea - 设置选中的区域
 * @property {function} resetStore - 重置状态
 */
const useAreaStore = create((set, get) => ({
    // 抽屉状态
    isDetailDrawerOpen: false,
    isSubDrawerOpen: false,

    // 数据状态
    selectedArea: null,
    subDrawerType: null,
    subDrawerData: null,

    // 打开详情抽屉
    openDetailDrawer: (areaData) => {
        set({
            isDetailDrawerOpen: true,
            selectedArea: areaData,
        });
    },

    // 关闭详情抽屉
    closeDetailDrawer: () => {
        set({
            isDetailDrawerOpen: false,
            selectedArea: null,
            // 同时关闭子抽屉
            isSubDrawerOpen: false,
            subDrawerType: null,
            subDrawerData: null,
        });
    },

    // 打开子抽屉
    openSubDrawer: (type, data = null) => {
        set({
            isSubDrawerOpen: true,
            subDrawerType: type,
            subDrawerData: data,
        });
    },

    // 关闭子抽屉
    closeSubDrawer: () => {
        set({
            isSubDrawerOpen: false,
            subDrawerType: null,
            subDrawerData: null,
        });
    },

    // 设置选中的区域
    setSelectedArea: (areaData) => {
        set({
            selectedArea: areaData,
        });
    },

    // 重置状态
    resetStore: () => {
        set({
            isDetailDrawerOpen: false,
            isSubDrawerOpen: false,
            selectedArea: null,
            subDrawerType: null,
            subDrawerData: null,
        });
    },
}));

export default useAreaStore;
