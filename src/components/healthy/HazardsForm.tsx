import React from "react";
import { Form, Input, Button, Card, Row, Col, Select, Space } from "antd";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { HazardData } from "./HazardsTable";

const { TextArea } = Input;
const { Option } = Select;

interface HazardFormProps {
    initialValues?: Partial<HazardData>;
    onSubmit: (values: HazardData) => void;
    onCancel?: () => void;
    loading?: boolean;
}

export default function HazardForm({
    initialValues,
    onSubmit,
    onCancel,
    loading,
}: HazardFormProps) {
    const [form] = Form.useForm();

    const handleSubmit = (values: HazardData) => {
        onSubmit(values);
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={initialValues}
            scrollToFirstError
            size="small"
        >
            {/* 职业危害因素岗位分布情况 */}
            <Card title="职业危害因素岗位分布情况" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item
                            name="danwei"
                            label="单位"
                            rules={[{ required: true, message: "请输入单位" }]}
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入单位" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="bumen"
                            label="部门"
                            rules={[{ required: true, message: "请输入部门" }]}
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入部门" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="xitonggangwei"
                            label="系统岗位"
                            rules={[{ required: true, message: "请输入系统岗位" }]}
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入系统岗位" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="gangweixixiang"
                            label="岗位细项"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入岗位细项" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="gongzuoquyu" label="工作区域" style={{ marginBottom: 12 }}>
                            <Input placeholder="请输入工作区域" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 职业病危害因素来源情况 */}
            <Card title="职业病危害因素来源情况" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item
                            name="shebeimingcheng"
                            label="设备名称"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入设备名称" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="yuancailiao" label="原辅料" style={{ marginBottom: 12 }}>
                            <Input placeholder="请输入原辅料" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="laiyuanmiaoshu"
                            label="来源描述"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入来源描述" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 职业病危害因素接触情况 */}
            <Card title="职业病危害因素接触情况" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item
                            name="jiechurenshu"
                            label="接触人员"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入接触人员数量" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="jiechushijian"
                            label="接触时间"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入接触时间" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="jiechulv" label="接触频率" style={{ marginBottom: 12 }}>
                            <Select placeholder="请选择接触频率">
                                <Option value="每日">每日</Option>
                                <Option value="每周">每周</Option>
                                <Option value="每月">每月</Option>
                                <Option value="偶尔">偶尔</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item
                            name="weihaiyinsu"
                            label="接触的职业病危害因素"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入职业病危害因素" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="zhiyebing"
                            label="可能导致的职业病"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入可能导致的职业病" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="qiangdu"
                            label="职业病危害因素浓度/强度"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入浓度/强度" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={24}>
                        <Form.Item
                            name="zuoyefangshi"
                            label="作业方式"
                            style={{ marginBottom: 12 }}
                        >
                            <TextArea rows={2} placeholder="请输入作业方式" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 职业病防护情况 */}
            <Card title="职业病防护情况" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="gerenfanghuyongping"
                            label="个体防护用品"
                            style={{ marginBottom: 12 }}
                        >
                            <TextArea rows={2} placeholder="请输入个体防护用品" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="fanghusheshi"
                            label="职业病防护设施"
                            style={{ marginBottom: 12 }}
                        >
                            <TextArea rows={2} placeholder="请输入职业病防护设施" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 职业健康检查情况 */}
            <Card title="职业健康检查情况" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item name="tijian" label="是否需要体检" style={{ marginBottom: 12 }}>
                            <Select placeholder="请选择是否需要体检">
                                <Option value="是">是</Option>
                                <Option value="否">否</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="tijianxiang" label="体检项目" style={{ marginBottom: 12 }}>
                            <Input placeholder="请输入体检项目" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 其他信息 */}
            <Card title="其他信息" size="small" style={{ marginBottom: 8 }}>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="fusheceliang"
                            label="库存数量"
                            style={{ marginBottom: 12 }}
                        >
                            <Input placeholder="请输入库存数量" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="beizhu" label="备注" style={{ marginBottom: 12 }}>
                            <TextArea rows={2} placeholder="请输入备注" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            {/* 操作按钮 */}
            <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={loading}
                    >
                        保存
                    </Button>
                    <Button onClick={handleReset}>重置</Button>
                    {onCancel && <Button onClick={onCancel}>取消</Button>}
                </Space>
            </Form.Item>
        </Form>
    );
}
