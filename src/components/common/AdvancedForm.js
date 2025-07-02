"use client";
import { Form, Button, Space, Card, Row, Col, App } from "antd";
import { useState, useEffect } from "react";
import { calculateRisk } from "@/lib/utils/riskCalculator";
import { handleApiError } from "@/lib/utils/errorHandler";

/**
 * 高级表单组件 - 支持分组、自动计算等功能
 * @param {Object} props - 组件属性
 * @param {Array} props.fieldGroups - 字段分组配置
 * @param {Object} props.initialValues - 初始值
 * @param {Function} props.onSubmit - 提交回调
 * @param {Function} props.onCancel - 取消回调
 * @param {boolean} props.loading - 加载状态
 * @param {string} props.submitText - 提交按钮文字
 * @param {boolean} props.autoCalculateRisk - 是否自动计算风险
 * @returns {JSX.Element} 高级表单组件
 */
export default function AdvancedForm({
    fieldGroups = [],
    initialValues = {},
    onSubmit,
    onCancel,
    loading = false,
    submitText = "确定",
    autoCalculateRisk = false,
}) {
    const [form] = Form.useForm();
    const { message } = App.useApp();

    // 监听initialValues变化，重新设置表单值
    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            console.log("表单初始值更新:", initialValues);
            form.resetFields();
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues]);

    // 监听l和s值变化，自动计算风险
    useEffect(() => {
        if (!autoCalculateRisk) return;

        const l = form.getFieldValue("l");
        const s = form.getFieldValue("s");

        if (l && s) {
            const { r, level, isMajorRisk } = calculateRisk(l, s);
            form.setFieldsValue({ r, level, isMajorRisk });
        }
    }, [form, autoCalculateRisk]);

    const _handleSubmit = async (values) => {
        try {
            // 如果开启自动计算，确保计算最新的风险值
            if (autoCalculateRisk && values.l && values.s) {
                const { r, level, isMajorRisk } = calculateRisk(values.l, values.s);
                values = { ...values, r, level, isMajorRisk };
            }

            await onSubmit?.(values);
            form.resetFields();
        } catch (error) {
            handleApiError(error, "表单提交", false, message);
        }
    };

    const _handleCancel = () => {
        form.resetFields();
        onCancel?.();
    };

    const _handleFieldChange = (changedFields, allFields) => {
        if (!autoCalculateRisk) return;

        // 检查是否l或s发生变化
        const hasLSChange = changedFields.some(
            (field) => field.name[0] === "l" || field.name[0] === "s"
        );

        if (hasLSChange) {
            const l = form.getFieldValue("l");
            const s = form.getFieldValue("s");

            if (l && s) {
                const { r, level } = calculateRisk(l, s);
                form.setFieldsValue({ r, level });
            }
        }
    };

    const renderField = (field) => {
        const { component: Component, span = 24, componentProps = {}, ...fieldProps } = field;

        return (
            <Col span={span} key={field.name}>
                <Form.Item {...fieldProps}>
                    <Component {...componentProps} />
                </Form.Item>
            </Col>
        );
    };

    const renderGroup = (group) => {
        if (group.type === "group") {
            return (
                <Card
                    key={group.title}
                    type="inner"
                    title={group.title}
                    className="mb-4"
                    styles={{ body: { padding: "12px 16px" } }}
                >
                    <Row gutter={12}>{group.fields.map(renderField)}</Row>
                </Card>
            );
        }

        // 普通字段
        return renderField(group);
    };

    return (
        <div className="w-full max-h-[75vh] overflow-y-auto">
            <Form
                form={form}
                layout="vertical"
                onFinish={_handleSubmit}
                onFieldsChange={_handleFieldChange}
                initialValues={initialValues}
                autoComplete="off"
                size="middle"
            >
                {fieldGroups.map(renderGroup)}

                {/* 操作按钮 */}
                <div className="flex justify-end pt-4 border-t border-gray-200 bg-white sticky bottom-0">
                    <Space size="middle">
                        <Button size="large" onClick={_handleCancel} disabled={loading}>
                            取消
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
                        >
                            {loading ? "提交中..." : submitText}
                        </Button>
                    </Space>
                </div>
            </Form>
        </div>
    );
}
