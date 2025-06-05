"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * React Query 提供者组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} Query提供者
 */
export default function ReactQueryProvider({ children }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // 数据保持新鲜的时间（5分钟）
                        staleTime: 5 * 60 * 1000,
                        // 数据在缓存中保留的时间（10分钟）
                        gcTime: 10 * 60 * 1000,
                        // 重试配置
                        retry: (failureCount, error) => {
                            // 4xx错误不重试
                            if (error?.status >= 400 && error?.status < 500) {
                                return false;
                            }
                            // 最多重试3次
                            return failureCount < 3;
                        },
                        // 重试延迟（指数退避）
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                        // 网络重连时自动重新获取
                        refetchOnReconnect: true,
                        // 窗口获得焦点时重新获取
                        refetchOnWindowFocus: false,
                    },
                    mutations: {
                        // 变更操作重试一次
                        retry: 1,
                        // 变更重试延迟
                        retryDelay: 1000,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* 开发环境下显示React Query DevTools */}
            {process.env.NODE_ENV === "development" && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom-right"
                    buttonPosition="bottom-right"
                />
            )}
        </QueryClientProvider>
    );
}
