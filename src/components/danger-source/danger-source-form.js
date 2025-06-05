"use client";
import { Form, Input, Select, InputNumber, Button, Row, Col, Card, message } from "antd";
import { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

/**
 * 危险源表单组件
 * @param {Object} props - 组件属性
 * @param {Object} props.initialValues - 初始值（编辑时使用）
 * @param {Function} props.onSubmit - 提交回调函数
 * @param {Function} props.onCancel - 取消回调函数
 * @param {boolean} props.loading - 提交加载状态
 * @returns {JSX.Element} 危险源表单
 */
export default function DangerSourceForm({ initialValues, onSubmit, onCancel, loading = false }) {
    const [form] = Form.useForm();
    const [riskValue, setRiskValue] = useState(0);
    const [riskLevel, setRiskLevel] = useState("");

    /**
     * 计算风险值和风险等级
     * @param {number} L - 可能性
     * @param {number} S - 严重性
     */
    const _calculateRisk = (L, S) => {
        if (L && S) {
            const R = L * S;
            setRiskValue(R);

            // 根据风险值计算风险等级
            let level = "";
            if (R >= 15) {
                level = "极高风险";
            } else if (R >= 9) {
                level = "高风险";
            } else if (R >= 4) {
                level = "中等风险";
            } else {
                level = "低风险";
            }
            setRiskLevel(level);

            // 更新表单字段
            form.setFieldsValue({ R, level });
        }
    };

    /**
     * 处理L值变化
     * @param {number} value - L值
     */
    const _handleLChange = (value) => {
        const S = form.getFieldValue("S");
        _calculateRisk(value, S);
    };

    /**
     * 处理S值变化
     * @param {number} value - S值
     */
    const _handleSChange = (value) => {
        const L = form.getFieldValue("L");
        _calculateRisk(L, value);
    };

    /**
     * 表单提交处理
     * @param {Object} values - 表单值
     */
    const _handleSubmit = async (values) => {
        try {
            // 判断是否为重大风险
            const isMajorRisk = values.R >= 9;
            const submitData = {
                ...values,
                isMajorRisk,
            };

            if (onSubmit) {
                await onSubmit(submitData);
                message.success("危险源信息保存成功！");
                form.resetFields();
                setRiskValue(0);
                setRiskLevel("");
            }
        } catch (error) {
            message.error("保存失败，请重试！");
        }
    };

    /**
     * 重置表单
     */
    const _handleReset = () => {
        form.resetFields();
        setRiskValue(0);
        setRiskLevel("");
    };

    return (
        <div className="w-full max-h-[75vh] overflow-y-auto">
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={_handleSubmit}
                autoComplete="off"
                size="middle"
            >
                {/* 基本信息 */}
                <Card
                    type="inner"
                    title="基本信息"
                    className="mb-3"
                    bodyStyle={{ padding: "12px 16px" }}
                >
                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item
                                label="产品系列"
                                name="product"
                                rules={[{ required: true, message: "请输入产品系列" }]}
                                className="mb-3"
                            >
                                <Input placeholder="请输入产品系列" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="部门"
                                name="department"
                                rules={[{ required: true, message: "请选择部门" }]}
                                className="mb-3"
                            >
                                <Input placeholder="请输入部门" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="区域"
                                name="area"
                                rules={[{ required: true, message: "请输入区域" }]}
                                className="mb-3"
                            >
                                <Input placeholder="请输入作业区域" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="职业病危害因素"
                                name="occupationalDisease"
                                className="mb-3"
                            >
                                <Input placeholder="职业病危害因素" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="工作岗位"
                                name="workPosition"
                                rules={[{ required: true, message: "请输入工作岗位" }]}
                                className="mb-0"
                            >
                                <Input placeholder="请输入工作岗位" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="作业活动"
                                name="workActivity"
                                rules={[{ required: true, message: "请输入作业活动" }]}
                                className="mb-0"
                            >
                                <Input placeholder="请输入作业活动" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 危险源辨识 */}
                <Card
                    type="inner"
                    title="危险源辨识"
                    className="mb-3"
                    bodyStyle={{ padding: "12px 16px" }}
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                label="危险源描述"
                                name="dangerSourceDescription"
                                rules={[{ required: true, message: "请输入危险源描述" }]}
                                className="mb-3"
                            >
                                <TextArea rows={2} placeholder="请描述危险源情况" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="可能导致的事故"
                                name="possibleAccident"
                                rules={[{ required: true, message: "请输入可能导致的事故" }]}
                                className="mb-3"
                            >
                                <TextArea rows={2} placeholder="可能导致的事故类型" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={24}>
                            <Form.Item label="事故案例" name="accidentCase" className="mb-0">
                                <TextArea rows={2} placeholder="请输入相关事故案例（可选）" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 风险评估 */}
                <Card
                    type="inner"
                    title="风险评估"
                    className="mb-4"
                    bodyStyle={{ padding: "12px 16px" }}
                >
                    <Row gutter={12}>
                        <Col span={6}>
                            <Form.Item
                                label="可能性 (L)"
                                name="L"
                                rules={[{ required: true, message: "请输入可能性值" }]}
                                // extra="1-5分"
                                className="mb-0"
                            >
                                <InputNumber
                                    min={1}
                                    max={5}
                                    placeholder="1-5"
                                    className="w-full"
                                    onChange={_handleLChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                label="严重性 (S)"
                                name="S"
                                rules={[{ required: true, message: "请输入严重性值" }]}
                                // extra="1-5分"
                                className="mb-0"
                            >
                                <InputNumber
                                    min={1}
                                    max={5}
                                    placeholder="1-5"
                                    className="w-full"
                                    onChange={_handleSChange}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="风险值 (R)" name="R" className="mb-0">
                                <InputNumber
                                    value={riskValue}
                                    disabled
                                    className="w-full"
                                    placeholder="自动计算"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="风险等级" name="level" className="mb-0">
                                <Input value={riskLevel} disabled placeholder="自动判定" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* 按钮组 */}
                <Form.Item className="mb-0 mt-4">
                    <div className="flex justify-end gap-3">
                        <Button onClick={_handleReset}>重置</Button>
                        {onCancel && <Button onClick={onCancel}>取消</Button>}
                        <Button type="primary" htmlType="submit" loading={loading}>
                            保存
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}
