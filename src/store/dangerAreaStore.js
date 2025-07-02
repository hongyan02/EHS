import { createGenericListStore } from "./common/createGenericStore";

/**
 * 危险区域状态管理store
 */
const useDangerAreaStore = createGenericListStore("danger-area");

export default useDangerAreaStore;
