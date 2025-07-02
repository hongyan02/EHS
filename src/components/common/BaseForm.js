"use client";
import { Form, Button, Space, App } from "antd";
import { useState, useEffect } from "react";

/**
 * 通用基础表单组件
 * @param {Object} props - 组件属性
 * @param {Array} props.fields - 字段配置数组
 * @param {Object} props.initialValues - 初始值
 * @param {Function} props.onSubmit - 提交回调
 * @param {Function} props.onCancel - 取消回调
 * @param {boolean} props.loading - 加载状态
 * @param {string} props.submitText - 提交按钮文字
 * @param {string} props.layout - 表单布局
 * @returns {JSX.Element} 基础表单组件
 */
export default function BaseForm({
    fields = [],
    initialValues = {},
    onSubmit,
    onCancel,
    loading = false,
    submitText = "确定",
    layout = "vertical",
}) {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    // 监听初始值变化，更新表单
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log("表单初始值更新:", initialValues);
            form.resetFields();
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues]);

    const _handleSubmit = async (values) => {
        try {
            await onSubmit?.(values);
            form.resetFields();
        } catch (error) {
            message.error("操作失败，请重试！");
        }
    };

    const _handleCancel = () => {
        form.resetFields();
        onCancel?.();
    };

    const renderField = (field) => {
        const { component: Component, componentProps = {}, ...fieldProps } = field;
        return (
            <Form.Item key={field.name} {...fieldProps}>
                <Component {...componentProps} />
            </Form.Item>
        );
    };

    return (
        <div className="p-4">
            <Form
                form={form}
                layout={layout}
                onFinish={_handleSubmit}
                initialValues={initialValues}
                requiredMark={false}
            >
                {fields.map(renderField)}

                <Form.Item className="mb-0 mt-6">
                    <Space className="w-full justify-end">
                        <Button size="large" onClick={_handleCancel} disabled={loading}>
                            取消
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                        >
                            {loading ? "提交中..." : submitText}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
}
