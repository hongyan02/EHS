"use client";

import LoginCard from "../../components/login/LoginCard";

/**
 * 登录页面组件
 * @returns {JSX.Element} 登录页面
 */
export default function LoginPage() {
    /**
     * 处理登录提交
     * @param {Object} values - 表单值
     */
    const handleLogin = (values) => {
        console.log("登录信息:", values);
        // TODO: 实现登录逻辑
    };

    return (
        <div
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden"
            style={{
                backgroundImage: "url('/images/wave-haikei.svg')",
            }}
        >
            {/* 可选：背景遮罩层 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-purple-100/10 backdrop-blur-[0.5px]"></div>

            {/* 主要内容区域 - 桌面端 */}
            <div className="relative z-10 min-h-screen hidden lg:flex">
                {/* 左侧品牌信息区域 */}
                <div className="flex-1 flex flex-col justify-center items-start p-8 lg:p-16">
                    <div className="max-w-2xl">
                        {/* 主标题 */}
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                            EHS
                        </h1>

                        {/* 副标题 */}
                        <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
                            安全无小事，责任重于山
                        </p>

                        {/* 列表 */}
                        <div className="space-y-3 text-gray-700">
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-lg">防风险</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-lg">除隐患</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="text-lg">揭事故</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 右侧居中登录模态框 */}
                <div className="absolute top-1/2 right-4 lg:right-8 xl:right-12 2xl:right-16 -translate-y-1/2 w-80 sm:w-96 max-w-[calc(100vw-2rem)]">
                    <LoginCard onLogin={handleLogin} />
                </div>
            </div>

            {/* 响应式：移动端布局 */}
            <div className="lg:hidden absolute inset-0 flex flex-col">
                {/* 移动端品牌信息 */}
                <div className="flex-1 flex flex-col justify-center items-center text-center p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">EHS</h1>
                    <p className="text-lg text-gray-600 mb-8">安全无小事，责任重于山</p>
                </div>

                {/* 移动端登录卡片 */}
                <div className="p-4">
                    <LoginCard onLogin={handleLogin} />
                </div>
            </div>
        </div>
    );
}
