"use client";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

/**
 * 登录表单组件 - 纯UI组件
 * @param {Object} props - 组件属性
 * @param {Function} props.onFinish - 表单提交回调
 * @param {boolean} props.loading - 登录加载状态
 * @returns {JSX.Element} 登录表单组件
 */
export default function LoginForm({ onFinish, loading = false }) {
    return (
        <Form onFinish={onFinish} layout="vertical" size="large" className="space-y-4">
            {/* 用户名输入框 */}
            <Form.Item
                name="username"
                label="用户名"
                className="mb-4"
                rules={[{ required: true, message: "请输入用户名" }]}
            >
                <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="用户名"
                    className="h-12"
                />
            </Form.Item>

            {/* 密码输入框 */}
            <Form.Item
                name="password"
                label="密码"
                className="mb-6"
                rules={[{ required: true, message: "请输入密码" }]}
            >
                <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="密码"
                    className="h-12"
                />
            </Form.Item>

            {/* 忘记密码链接 */}
            <div className="text-right mb-6">
                <a href="#" className="text-purple-600 hover:text-purple-700 text-sm">
                    忘记密码？
                </a>
            </div>

            {/* 登录按钮 */}
            <Form.Item className="mb-0">
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    className="h-12 text-base font-medium bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700"
                >
                    登录
                </Button>
            </Form.Item>
        </Form>
    );
}
