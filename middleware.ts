import { NextRequest, NextResponse } from "next/server";
import { isMobileUserAgent } from "@/util/IsMobie";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // 获取用户代理字符串
    const userAgent = request.headers.get("user-agent") || "";

    // 检测是否为移动端
    const isMobile = isMobileUserAgent(userAgent);

    // 在响应头中添加移动端标识
    response.headers.set("x-is-mobile", isMobile.toString());

    // 也可以在cookie中设置，方便客户端使用
    if (isMobile) {
        response.cookies.set("is-mobile", "true", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24小时
        });
    } else {
        response.cookies.set("is-mobile", "false", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24小时
        });
    }

    return response;
}

// 配置中间件匹配的路径
export const config = {
    matcher: [
        /*
         * 匹配所有请求路径，除了以下路径:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
