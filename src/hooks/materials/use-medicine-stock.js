import { useMaterialQuery } from "@/queries/materials";
import { useMemo } from "react";

/**
 * 获取医疗库存数据的自定义hook
 * @returns {Object} { data: 医疗库存数据, isLoading, error }
 */
export const useMedicineStock = () => {
    // 创建请求体，lei:2 表示查询医疗库存
    const requestData = useMemo(() => {
        const formData = new FormData();
        formData.append("lei", "2");
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
            wuzimingcheng: item.wuzimingcheng || "未知药品",
            guigexinghao: item.guigexinghao || "未知规格",
            danwei: item.danwei || "个",
            kucun: item.kucun || 0,
            fazhi: item.fazhi || 0,
            ruku: item.ruku || 0,
            chuku: item.chuku || 0,
            lei: item.lei,
            // 添加过期日期字段（API中可能没有，使用默认值）
            expireDate: item.expireDate || "2024-12-31",
        }));
    }, [stockData]);

    return {
        data: formattedData,
        isLoading,
        error,
    };
};