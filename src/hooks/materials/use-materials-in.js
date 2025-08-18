import { useApplicationQuery } from "@/queries/materials";
import { useMemo } from "react";

/**
 * 获取入库申请数据的自定义hook
 * @returns {Object} { data: 过滤后的入库数据, isLoading, error }
 */
export const useMaterialsIn = () => {
    const { data: materialsData, isLoading, error } = useApplicationQuery();

    // 过滤出入库类型的数据并转换格式
    const inData = useMemo(() => {
        if (!materialsData?.data) {
            return [];
        }

        return materialsData.data
            .filter((item) => item.leibie === "in")
            .map((item) => ({
                id: item.id,
                title: item.title || "未填写标题",
                danhao: item.danhao,
                chuangjianren: item.chuangjianren || "未知",
                chuangjianshijian: item.chuangjianshijian || "未知",
                querenshijian: item.querenshijian,
                querenren: item.querenren,
                // 根据确认时间判断状态
                current: item.querenshijian ? 2 : 0,
                status: item.querenshijian ? "finish" : "process",
            }));
    }, [materialsData]);

    return {
        data: inData,
        isLoading,
        error,
    };
};
