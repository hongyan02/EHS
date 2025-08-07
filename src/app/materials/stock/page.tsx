"use client"
import { useEffect, useState } from "react";
import StockTable from "@/components/materials/StockTable";
import MobileStockList from "@/components/materials/MobileStockList";
import { useIsMobile } from "@/util/IsMobie";

export default function Page() {
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 避免服务端渲染和客户端渲染不一致的问题
    if (!mounted) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-2">物料库存管理</h1>
                    <p className="text-gray-600">查看和管理当前物料库存信息</p>
                </div>
                <div className="flex justify-center items-center h-32">
                    <div className="text-gray-500">加载中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">物料库存管理</h1>
            </div>
            {isMobile ? <MobileStockList /> : <StockTable />}
        </div>
    )
}