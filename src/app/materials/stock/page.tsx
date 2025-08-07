"use client"
import { useEffect, useState } from "react";
import { Button } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
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
                    <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <Link href="/materials">
                        <Button 
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            className="text-gray-600 hover:text-gray-800"
                        >
                            返回
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">物料库存管理</h1>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    size="large"
                    className="shadow-sm"
                >
                    新增物料
                </Button>
            </div>
                    <p className="text-gray-600 text-sm mb-4">查看和管理当前物料库存信息</p>
                    <div className="border-t pt-4"></div>
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
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/materials">
                            <Button 
                                icon={<ArrowLeftOutlined />}
                                type="text"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                返回
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">物料库存管理</h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        size="large"
                        className="shadow-sm"
                    >
                        新增物料
                    </Button>
                </div>
                <p className="text-gray-600 text-sm mb-4">查看和管理当前物料库存信息</p>
                <div className="border-t pt-4"></div>
            </div>
            {isMobile ? <MobileStockList /> : <StockTable />}
        </div>
    )
}