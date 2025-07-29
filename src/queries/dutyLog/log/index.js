import { createDutyLog, updateDutyLog, submitDutyLog, deleteDutyLog } from "./api";
import { useQuery, useMutation, useQueryClient } from "react-query";

//创建日志
export const useCreateDutyLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDutyLog,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries("dutyLogs");
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

//更新日志
export const useUpdateDutyLog = () => {
    const queryClient = useQueryClient();
    return useMutation({    
        mutationFn: updateDutyLog,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries("dutyLogs");
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

//提交日志
export const useSubmitDutyLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitDutyLog,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries("dutyLogs");
        },
        onError: (error) => {
            console.error(error);
        },
    });
};

//删除日志
export const useDeleteDutyLog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDutyLog,
        onSuccess: (data) => {
            console.log(data);
            queryClient.invalidateQueries("dutyLogs");
        },
        onError: (error) => {
            console.error(error);
        },
    });
};