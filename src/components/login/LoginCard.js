"use client";

import { Card } from "antd";
import LoginForm from "./LoginForm";

/**
 * 登录卡片组件 - 纯UI容器组件
 * @param {Object} props - 组件属性
 * @param {string} props.className - 额外的CSS类名
 * @param {Object} props.style - 内联样式
 * @param {Function} props.onLogin - 登录表单提交回调
 * @param {boolean} props.loginLoading - 登录加载状态
 * @returns {JSX.Element} 登录卡片组件
 */
export default function LoginCard({ className = "", style = {}, onLogin, loginLoading = false }) {
    return (
        <Card
            title="欢迎👏"
            className={`backdrop-blur-md bg-white/95 shadow-2xl border-0 ${className}`}
            style={{
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                ...style,
            }}
        >
            <LoginForm onFinish={onLogin} loading={loginLoading} />
        </Card>
    );
}
