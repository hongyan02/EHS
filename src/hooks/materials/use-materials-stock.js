import { useMaterialQuery } from "@/queries/materials";
import { useMemo } from "react";

/**
 * 获取物料库存数据的自定义hook
 * @returns {Object} { data: 物料库存数据, isLoading, error }
 */
export const useMaterialsStock = () => {
    // 创建请求体，lei:1 表示查询物料库存
    const requestData = useMemo(() => {
        const formData = new FormData();
        formData.append("lei", "1");
        return formData;
    }, []);

    const { data: stockData, isLoading, error } = useMaterialQuery(requestData);

    // 转换API数据格式以匹配组件需求
    const formattedData = useMemo(() => {
        if (!stockData?.data) {
            return [];
        }

        return stockData.data.map((item, index) => ({
            key: index.toString(),
            wuzimingcheng: item.wuzimingcheng || "未知物料",
            wuzibianma: item.wuzibianma || "无编码",
            danwei: item.danwei || "个",
            kucun: item.kucun || 0,
            fazhi: item.fazhi || 0,
            ruku: item.ruku || 0,
            chuku: item.chuku || 0,
            lei: item.lei,
            use: "",
            remark: "",
        }));
    }, [stockData]);

    return {
        data: formattedData,
        isLoading,
        error,
    };
};
