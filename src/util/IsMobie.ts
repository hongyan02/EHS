import { useEffect, useState } from "react";

/**
 * 检测是否为移动端设备的Hook
 * @param breakpoint 断点像素值，默认768px
 * @returns boolean 是否为移动端
 */
export function useIsMobile(breakpoint: number = 768): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // 初始检查
        checkIsMobile();

        // 监听窗口大小变化
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, [breakpoint]);

    return isMobile;
}

/**
 * 服务端安全的移动端检测函数
 * @param userAgent 用户代理字符串
 * @returns boolean 是否为移动端
 */
export function isMobileUserAgent(userAgent: string): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

/**
 * 获取当前视口宽度
 * @returns number 视口宽度
 */
export function getViewportWidth(): number {
    if (typeof window !== "undefined") {
        return window.innerWidth;
    }
    return 0;
}
