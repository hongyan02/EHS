import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useDangerSourceStore from "@/store/danger-source-store";
import { getDangerSourceList, createDangerSource } from "@/api/danger-source";

/**
 * 危险源列表查询hook
 */
export const useDangerSourceQuery = () => {
    const { searchParams, getQueryKey, setTableData, setLoading } = useDangerSourceStore();

    return useQuery({
        queryKey: getQueryKey(),
        queryFn: () => getDangerSourceList(searchParams),
        onSuccess: (result) => {
            setTableData(result.data, result.total);
        },
        onSettled: () => {
            setLoading(false);
        },
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
    });
};

/**
 * 新增危险源mutation hook
 */
export const useAddDangerSourceMutation = () => {
    const queryClient = useQueryClient();
    const { getQueryKey } = useDangerSourceStore();

    return useMutation({
        mutationFn: createDangerSource,
        onSuccess: () => {
            // 新增成功后刷新列表数据
            queryClient.invalidateQueries({
                queryKey: ["danger-source-list"],
            });
        },
        onError: (error) => {
            console.error("新增危险源失败:", error);
        },
    });
};
