import { Modal, Form, Input, Select, InputNumber, Button, App } from "antd";
import { useEffect, useState, useCallback } from "react";

const { TextArea } = Input;

// 事故类型选项
const ACCIDENT_TYPES = [
    "火灾",
    "切割伤",
    "撞伤",
    "灼烫",
    "高处跌落",
    "物体打击",
    "车辆伤害",
    "窒息",
    "中毒",
    "机械伤害",
    "触电",
    "爆炸",
    "吊顶坍塌",
    "坠物伤人",
    "坍塌",
    "眼部伤害",
    "化学品灼伤",
    "其他伤害",
];

// 部门-区域映射关系
const DEPARTMENT_AREA_MAP = {
    基建部: ["建设区域"],
    各车间: ["设备安装调试区"],
    各部门: [
        "设备安装调试区",
        "吊顶夹层",
        "7m/13m平台",
        "危化品存放区",
        "原材料仓立库",
        "小卷库",
        "化成高货架区",
        "楼梯间",
        "茶水间",
        "物流线",
        "共有风险",
    ],
    仓储管理: ["原材料仓与厂区道路", "自动叉轨"],
    极片制造: ["极片段"],
    切叠制造: ["切叠段"],
    化成制造: ["化成段"],
    组装制造: ["组装段"],
    包装制造: ["包装段"],
    能源管理部: ["配电房"],
    基础工程: [
        "空压机房",
        "制氮机设备间",
        "除湿机房",
        "除尘房",
        "动力站",
        "固有风险",
        "甲类仓",
        "电解液中转房",
        "NMP中转房",
        "NMP回收中转房",
        "NMP废液中转房",
        "电解液罐区",
        "电解液储罐区",
        "电芯栋屋顶",
        "化成栋屋顶",
    ],
    品质部: ["循环测试栋", "品质化学分析室", "品质QC房", "IQC实验室"],
    工程部: ["物料堆场"],
    工艺技术部: ["电池拆解房"],
    安环部: ["环保设施"],
    质量中心: ["安全测试栋"],
    环境中心: ["环保设施"],
};

/**
 * 风险源添加/编辑模态框组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.visible - 模态框是否可见
 * @param {Function} props.onCancel - 取消回调
 * @param {Function} props.onSubmit - 提交回调
 * @param {boolean} props.loading - 是否正在加载
 * @param {boolean} props.editMode - 是否为编辑模式
 * @param {Object} props.initialData - 初始数据（编辑模式下使用）
 * @returns {JSX.Element} 风险源添加/编辑模态框
 */
export default function AddRiskModal({
    visible,
    onCancel,
    onSubmit,
    loading,
    editMode = false,
    initialData = null,
}) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    // 编辑模式下预填充表单数据
    useEffect(() => {
        if (editMode && initialData && visible) {
            // 处理事故类型字符串转数组
            const processedData = {
                ...initialData,
                possible_accident: initialData.possible_accident
                    ? initialData.possible_accident.split(/[、,，]/).filter((item) => item.trim())
                    : [],
            };
            form.setFieldsValue(processedData);
            setSelectedDepartment(initialData.department);
        } else if (!editMode && visible) {
            // 新增模式下重置表单
            form.resetFields();
            setSelectedDepartment(null);
        }
    }, [editMode, initialData, visible, form]);

    /**
     * 处理部门变化
     * @param {string} department - 选中的部门
     */
    const _handleDepartmentChange = useCallback(
        (department) => {
            setSelectedDepartment(department);
            // 清空区域选择
            form.setFieldValue("area", null);
        },
        [form]
    );

    /**
     * 获取可选的区域列表
     * @returns {Array} 区域选项列表
     */
    const _getAvailableAreas = useCallback(() => {
        if (!selectedDepartment) return [];
        return DEPARTMENT_AREA_MAP[selectedDepartment] || [];
    }, [selectedDepartment]);

    /**
     * 处理表单提交
     * @param {Object} values - 表单值
     */
    const _handleSubmit = async (values) => {
        try {
            // 计算风险等级 R = L × S
            const riskValue = values.l * values.s;

            // 根据R值确定风险等级
            let level = "";
            if (riskValue >= 1 && riskValue <= 6) {
                level = "极低风险";
            } else if (riskValue >= 7 && riskValue <= 9) {
                level = "低风险";
            } else if (riskValue >= 10 && riskValue <= 15) {
                level = "中等风险";
            } else if (riskValue >= 16 && riskValue <= 25) {
                level = "高风险";
            } else if (riskValue >= 26 && riskValue <= 36) {
                level = "极高风险";
            } else {
                level = "未知风险";
            }

            // 先输出原始表单数据进行调试
            console.log("原始表单数据:", values);

            // 构造提交数据，确保数据格式符合API要求
            const riskData = {
                product: values.product?.trim() || "",
                department: values.department?.trim() || "",
                area: values.area?.trim() || "",
                work_position: values.work_position?.trim() || "",
                work_activity: values.work_activity?.trim() || "",
                danger_source_description: values.danger_source_description?.trim() || "",
                possible_accident: Array.isArray(values.possible_accident)
                    ? values.possible_accident.join("、")
                    : values.possible_accident?.trim() || "",
                accident_case: values.accident_case?.trim() || "",
                occupational_disease: values.occupational_disease?.trim() || "",
                l: Number(values.l),
                s: Number(values.s),
                r: riskValue,
                level: level,
                isMajorRisk: Boolean(values.isMajorRisk),
                current_control_measures: values.current_control_measures?.trim() || "",
                ...(editMode && initialData && { risk_source_id: initialData.risk_source_id }),
            };

            console.log("处理后的数据:", riskData);

            // 由于表单已经有required验证，这里只做最基本的检查
            // 移除严格的验证，避免误判
            console.log("提交风险源数据:", riskData);

            if (editMode && initialData) {
                // 编辑模式：传递包含 risk_source_id 的数据
                await onSubmit({ riskSourceId: initialData.risk_source_id, data: riskData });
            } else {
                // 新增模式：只传递数据
                await onSubmit(riskData);
            }

            form.resetFields();
            setSelectedDepartment(null);
        } catch (error) {
            console.error("添加风险源失败:", error);

            // 根据错误类型提供更详细的错误信息
            if (error.response) {
                // API返回的错误
                const status = error.response.status;
                if (status === 400) {
                    message.error("数据格式不正确，请检查输入信息");
                } else if (status === 500) {
                    message.error("服务器内部错误，请稍后重试");
                } else {
                    message.error(`请求失败 (${status})，请重试`);
                }
            } else if (error.message) {
                message.error(`添加失败: ${error.message}`);
            } else {
                message.error("添加风险源失败，请检查网络连接后重试");
            }
        }
    };

    /**
     * 处理取消操作
     */
    const _handleCancel = () => {
        if (loading) {
            return;
        }
        form.resetFields();
        setSelectedDepartment(null);
        onCancel();
    };

    /**
     * 渲染完整的表单内容
     * @returns {JSX.Element} 完整的表单内容
     */
    const _renderFormContent = () => {
        return (
            <div className="space-y-6">
                {/* 基础信息 */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">基础信息</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Form.Item
                                name="product"
                                label="产品系列"
                                rules={[{ required: true, message: "请输入产品系列" }]}
                            >
                                <Input
                                    placeholder="请输入产品系列"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="department"
                                label="部门"
                                rules={[{ required: true, message: "请选择部门" }]}
                            >
                                <Select
                                    placeholder="请选择部门"
                                    size="large"
                                    onChange={_handleDepartmentChange}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {Object.keys(DEPARTMENT_AREA_MAP).map((department) => (
                                        <Select.Option
                                            key={department}
                                            value={department}
                                        >
                                            {department}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="area"
                                label="区域"
                                rules={[{ required: true, message: "请选择区域" }]}
                            >
                                <Select
                                    placeholder={selectedDepartment ? "请选择区域" : "请先选择部门"}
                                    size="large"
                                    disabled={!selectedDepartment}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {_getAvailableAreas().map((area) => (
                                        <Select.Option
                                            key={area}
                                            value={area}
                                        >
                                            {area}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="work_position"
                                label="工作岗位"
                                rules={[{ required: true, message: "请输入工作岗位" }]}
                            >
                                <Input
                                    placeholder="请输入工作岗位"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                name="work_activity"
                                label="作业活动"
                                rules={[{ required: true, message: "请输入作业活动" }]}
                            >
                                <Input
                                    placeholder="请输入作业活动"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </div>

                {/* 风险识别 */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-medium mb-4">风险识别</h3>
                    <div className="space-y-4">
                        <Form.Item
                            name="danger_source_description"
                            label="危险源描述"
                            rules={[{ required: true, message: "请输入危险源描述" }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="请详细描述危险源"
                                size="large"
                                showCount
                                maxLength={200}
                            />
                        </Form.Item>
                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="possible_accident"
                                label="可能导致的事故"
                                rules={[{ required: true, message: "请选择可能导致的事故" }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="请选择可能导致的事故"
                                    size="large"
                                    showSearch
                                    maxTagCount="responsive"
                                    filterOption={(input, option) =>
                                        (option?.children ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                >
                                    {ACCIDENT_TYPES.map((type) => (
                                        <Select.Option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="accident_case"
                                label="事故案例"
                            >
                                <TextArea
                                    rows={1}
                                    placeholder="请输入事故案例（可选）"
                                    size="large"
                                    showCount
                                    maxLength={100}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="occupational_disease"
                            label="职业病危害因素"
                        >
                            <Input
                                placeholder="请输入职业病危害因素（可选）"
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* 风险评估 */}
                <div>
                    <h3 className="text-lg font-medium mb-4">风险评估</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <Form.Item
                                name="l"
                                label="L (可能性)"
                                rules={[
                                    { required: true, message: "请输入L值" },
                                    { type: "number", min: 1, max: 6, message: "L值范围为1-6" },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={6}
                                    placeholder="1-6"
                                    size="large"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="s"
                                label="S (严重性)"
                                rules={[
                                    { required: true, message: "请输入S值" },
                                    { type: "number", min: 1, max: 6, message: "S值范围为1-6" },
                                ]}
                            >
                                <InputNumber
                                    min={1}
                                    max={6}
                                    placeholder="1-6"
                                    size="large"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="isMajorRisk"
                                label="是否重大风险"
                                rules={[{ required: true, message: "请选择是否为重大风险" }]}
                            >
                                <Select
                                    placeholder="请选择"
                                    size="large"
                                >
                                    <Select.Option value={true}>是</Select.Option>
                                    <Select.Option value={false}>否</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="current_control_measures"
                            label="当前控制措施"
                            rules={[{ required: true, message: "请输入当前控制措施" }]}
                        >
                            <TextArea
                                rows={3}
                                placeholder="请详细描述当前的控制措施"
                                size="large"
                                showCount
                                maxLength={300}
                            />
                        </Form.Item>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Modal
            title={editMode ? "编辑风险源" : "添加风险源"}
            open={visible}
            onCancel={_handleCancel}
            footer={null}
            width={1000}
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={_handleSubmit}
                scrollToFirstError
                size="small"
                initialValues={{
                    product: "储能",
                    l: 1,
                    s: 1,
                    isMajorRisk: false,
                }}
            >
                {/* 表单内容 */}
                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>{_renderFormContent()}</div>

                {/* 底部按钮 */}
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    <Button
                        onClick={_handleCancel}
                        disabled={loading}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {loading
                            ? editMode
                                ? "更新中..."
                                : "添加中..."
                            : editMode
                            ? "确认更新"
                            : "确认添加"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
