"use client";
import { Form, Row, Col, Input } from "antd";
import { useEffect } from "react";

/**
 * 夜班表单组件
 * @param {Object} props - 组件属性
 * @param {string} props.date - 日期字符串，用于生成唯一的表单字段名
 * @param {Object} props.initialValues - 初始值
 * @param {Function} props.onSave - 保存回调函数
 * @returns {JSX.Element} 夜班表单组件
 */
export default function NightShiftForm({ date, initialValues, onSave }) {
    const [form] = Form.useForm();

    // 当初始值变化时，设置表单值
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        }
    }, [form, initialValues]);

    /**
     * 处理表单提交
     */
    const handleSubmit = (values) => {
        if (onSave) {
            onSave(date, values);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold text-red-600 border-b border-red-200 pb-1">
                夜班
            </h4>
            <Form
                id={`night-shift-form-${date}`}
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]} align="top">
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item name="nightDutyLeader" label="值班领导">
                            <Input placeholder="请输入值班领导姓名" />
                        </Form.Item>
                        <Form.Item name="nightDutyLeaderPhone" label="联系电话">
                            <Input placeholder="请输入电话号码" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Form.Item name="nightSafetyOfficer" label="安全员">
                            <Input placeholder="请输入安全员姓名" />
                        </Form.Item>
                        <Form.Item name="nightSafetyOfficerPhone" label="联系电话">
                            <Input placeholder="请输入电话号码" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}
