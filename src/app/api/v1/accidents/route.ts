import { NextRequest, NextResponse } from "next/server";
import { getAccidents, getAccidentByKey } from "@/lib/db/services/accident";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get("keyword");

        if (keyword) {
            // 关键字查询
            const accidents = await getAccidentByKey(keyword);
            return NextResponse.json({
                success: true,
                data: accidents,
                message: `找到 ${accidents.length} 条相关记录`,
            });
        } else {
            // 获取所有记录
            const accidents = await getAccidents();
            return NextResponse.json({
                success: true,
                data: accidents,
                message: `获取到 ${accidents.length} 条记录`,
            });
        }
    } catch (error) {
        console.error("获取事故记录失败:", error);
        return NextResponse.json(
            {
                success: false,
                message: "获取事故记录失败",
                error: error instanceof Error ? error.message : "未知错误",
            },
            { status: 500 }
        );
    }
}
