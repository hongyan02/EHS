"use client";
import { Form, Input, Select, Button, Card, App } from "antd";
import { useCreateApplication } from "@/queries/materials";

const { TextArea } = Input;
const { Option } = Select;

interface ApplicationFormData {
    chuangjianrengonghao: string;
    laiyuan: string;
    title: string;
    beizhu: string;
    lei: string;
    leibie: string;
}

interface ApplicationFormProps {
    onSubmit?: (values: ApplicationFormData) => void;
    loading?: boolean;
    initialValues?: Partial<ApplicationFormData>;
}

export default function ApplicationForm({
    onSubmit,
    loading = false,
    initialValues,
}: ApplicationFormProps) {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const createApplicationMutation = useCreateApplication();

    const handleSubmit = async (values: ApplicationFormData) => {
        try {
            // 构建完整的请求体，确保所有字段都有默认值
            const submitData = {
                chuangjianrengonghao: values.chuangjianrengonghao || "",
                laiyuan: values.laiyuan || "",
                title: values.title || "",
                beizhu: values.beizhu || "",
                lei: values.lei || "",
                leibie: values.leibie || "",
            };

            // 将数据转换为URLSearchParams格式
            const formData = new URLSearchParams();
            Object.entries(submitData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            await createApplicationMutation.mutateAsync(formData.toString());
            message.success("申请提交成功！");
            form.resetFields();

            if (onSubmit) {
                onSubmit(submitData);
            }
        } catch (error) {
            message.error("申请提交失败，请重试");
            console.error("申请提交错误:", error);
        }
    };

    const handleReset = () => {
        form.resetFields();
        message.info("表单已重置");
    };

    return (
        <div className="w-full">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <div className="grid grid-cols-5 gap-4 mb-2">
                    <Form.Item
                        label="申请类型"
                        name="leibie"
                        rules={[{ required: true, message: "请选择申请类型" }]}
                        className="mb-0"
                    >
                        <Select placeholder="请选择申请类型" size="middle">
                            <Option value="in">入库申请</Option>
                            <Option value="out">出库申请</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[
                            { required: true, message: "请输入标题" },
                            { min: 2, message: "标题至少2个字符" },
                            { max: 100, message: "标题不能超过100个字符" },
                        ]}
                        className="mb-0"
                    >
                        <Input placeholder="请输入申请标题" maxLength={100} size="middle" />
                    </Form.Item>

                    <Form.Item
                        label="工号"
                        name="chuangjianrengonghao"
                        rules={[
                            { required: true, message: "请输入工号" },
                            { min: 3, message: "工号至少3位" },
                            { max: 20, message: "工号不能超过20位" },
                        ]}
                        className="mb-0"
                    >
                        <Input placeholder="请输入工号" maxLength={20} size="middle" />
                    </Form.Item>

                    <Form.Item
                        label="类别"
                        name="lei"
                        rules={[{ required: true, message: "请选择类别" }]}
                        className="mb-0"
                    >
                        <Select placeholder="请选择类别" size="middle">
                            <Option value="1">物料</Option>
                            <Option value="2">药品</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="来源"
                        name="laiyuan"
                        rules={[{ required: true, message: "请选择来源" }]}
                        className="mb-0"
                    >
                        <Select placeholder="请选择来源" size="middle">
                            <Option value="生产部门">生产部门</Option>
                            <Option value="维修部门">维修部门</Option>
                            <Option value="质检部门">质检部门</Option>
                            <Option value="安全部门">安全部门</Option>
                            <Option value="行政部门">行政部门</Option>
                            <Option value="其他">其他</Option>
                        </Select>
                    </Form.Item>
                </div>

                <Form.Item
                    label="备注"
                    name="beizhu"
                    rules={[{ max: 500, message: "备注不能超过500个字符" }]}
                    className="mb-4"
                >
                    <TextArea
                        placeholder="请输入备注信息（可选）"
                        rows={3}
                        maxLength={500}
                        size="middle"
                    />
                </Form.Item>

                <Form.Item className="mb-0">
                    <div className="flex gap-3 justify-end">
                        <Button
                            onClick={handleReset}
                            disabled={createApplicationMutation.isPending || loading}
                            size="middle"
                        >
                            重置
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createApplicationMutation.isPending || loading}
                            size="middle"
                        >
                            提交申请
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
}
