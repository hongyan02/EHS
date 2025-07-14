"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";

/**
 * 404页面组件
 * @returns {JSX.Element} 404错误页面
 */
export default function NotFound() {
    const router = useRouter();

    /**
     * 返回首页
     */
    const _handleBackHome = () => {
        router.push("/");
    };

    /**
     * 返回上一页
     */
    const _handleGoBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Result
                status="404"
                title="404"
                subTitle="抱歉，您访问的页面不存在"
                extra={
                    <div className="flex gap-2 justify-center">
                        <Button type="primary" onClick={_handleBackHome}>
                            返回首页
                        </Button>
                        <Button onClick={_handleGoBack}>返回上一页</Button>
                    </div>
                }
            />
        </div>
    );
}
