"use client";
import { Select, Form, Row, Col, Input } from "antd";

/**
 * 值班表单组件
 * 包含白班和夜班的值班人员和联系电话填写表单
 * @param {Object} props - 组件属性
 * @param {string} props.date - 日期字符串，用于生成唯一的表单字段名
 * @returns {JSX.Element} 值班表单组件
 */
export default function DutyForm({ date }) {
    /**
     * 生成唯一的字段名
     * @param {string} fieldName - 基础字段名
     * @returns {string} 带日期前缀的字段名
     */
    const _getFieldName = (fieldName) => {
        return `${date}_${fieldName}`;
    };

    return (
        <div className="flex flex-col gap-4">
            {/* 白班区域 */}
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-1">
                    白班
                </h4>
                <Form layout="vertical">
                    <Row gutter={[16, 16]} align="top">
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name={_getFieldName("dayDutyLeader")} label="值班领导">
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item name={_getFieldName("dayDutyLeaderPhone")} label="联系电话">
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name={_getFieldName("dayDutyManager")} label="带班干部">
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item name={_getFieldName("dayDutyManagerPhone")} label="联系电话">
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item
                                name={_getFieldName("daySafetyManager")}
                                label="安全管理人员"
                            >
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item
                                name={_getFieldName("daySafetyManagerPhone")}
                                label="联系电话"
                            >
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name={_getFieldName("daySafetyOfficer")} label="安全员">
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item
                                name={_getFieldName("daySafetyOfficerPhone")}
                                label="联系电话"
                            >
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>

            {/* 夜班区域 */}
            <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold text-red-600 border-b border-red-200 pb-1">
                    夜班
                </h4>
                <Form layout="vertical">
                    <Row gutter={[16, 16]} align="top">
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name={_getFieldName("nightDutyLeader")} label="值班领导">
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item
                                name={_getFieldName("nightDutyLeaderPhone")}
                                label="联系电话"
                            >
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={6}>
                            <Form.Item name={_getFieldName("nightSafetyOfficer")} label="安全员">
                                <Select mode="multiple" options={[]} placeholder="选择值班人员" />
                            </Form.Item>
                            <Form.Item
                                name={_getFieldName("nightSafetyOfficerPhone")}
                                label="联系电话"
                            >
                                <Input placeholder="请输入电话号码" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
}
