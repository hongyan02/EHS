"use client";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Card,
    Descriptions,
    Button,
    Space,
    Spin,
    Alert,
    App,
    Table,
    Divider,
    Modal,
    Form,
    Select,
    Input,
    InputNumber,
    Row,
    Col,
    Skeleton,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    useApplicationQuery,
    useDeleteApplication,
    useGetMaterialByApplication,
    useCreateMaterialByApplication,
    useGetMaterialName,
} from "@/queries/materials";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";

// 定义数据类型
interface ApplicationItem {
    id: number;
    title: string;
    danhao: string;
    leibie: string;
    lei: string;
    chuangjianshijian: string;
    chuangjianren: string;
    chuangjianrengonghao: string;
    laiyuan: string;
    beizhu: string;
    querenshijian: string;
    querenren: string;
    querenrengonghao: string;
}

interface MaterialItem {
    id: number;
    name: string;
    bianma: string;
    guigexinghao: string;
    shuliang: number;
    danwei: string;
    yongtu: string;
    guoqishijian: string;
    chuangjianshijian: string;
    beizhu: string;
}

export default function ApplicationDetailPage() {
    const { modal, message } = App.useApp();
    const searchParams = useSearchParams();
    const router = useRouter();
    const danhao = searchParams.get("danhao");

    const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();

    // 获取所有申请单数据
    const { data: applicationData, isLoading: appLoading, error: appError } = useApplicationQuery();

    // 删除申请的mutation
    const deleteApplicationMutation = useDeleteApplication();

    // 新增物料的mutation
    const createMaterialMutation = useCreateMaterialByApplication();

    // 获取物料名称列表
    const { data: materialNameData } = useGetMaterialName();

    // 根据单号获取申请详情
    useEffect(() => {
        if (applicationData?.data && danhao) {
            const application = applicationData.data.find(
                (item: ApplicationItem) => item.danhao === danhao
            );
            if (application) {
                setSelectedApplication(application);
            }
        }
    }, [danhao, applicationData]);

    // 获取申请单下的物料列表
    const {
        data: materialsListData,
        isLoading: materialsLoading,
        error: materialsError,
    } = useGetMaterialByApplication(selectedApplication?.id);

    // 处理删除申请
    const handleDelete = () => {
        if (!selectedApplication) {
            message.error("未找到申请单信息");
            return;
        }

        modal.confirm({
            title: "确认删除",
            icon: <ExclamationCircleOutlined />,
            content: "确定要删除这个申请单吗？删除后无法恢复。",
            okText: "确认删除",
            okType: "danger",
            cancelText: "取消",
            async onOk() {
                try {
                    const formData = new URLSearchParams();
                    formData.append("id", selectedApplication.id.toString());
                    await deleteApplicationMutation.mutateAsync(formData.toString());
                    message.success("删除申请单成功");
                    router.push("/materials/applicants");
                } catch (error) {
                    console.error("删除申请单失败:", error);
                    message.error("删除申请单失败，请重试");
                }
            },
        });
    };

    // 处理修改申请
    const handleEdit = () => {
        message.info("编辑功能正在开发中...");
    };

    // 处理新增物料
    const handleAddMaterial = async (values: any) => {
        try {
            const { materials } = values;

            if (!materials || materials.length === 0) {
                message.error("请至少添加一个物料");
                return;
            }

            for (const material of materials) {
                const formData = new URLSearchParams();
                formData.append("danbianhao", selectedApplication?.id?.toString() || "");
                formData.append("wuzimingcheng", material.wuzimingcheng || "");
                formData.append("wuzibianma", material.bianma || "");
                formData.append("shuliang", material.shuliang?.toString() || "");
                formData.append("danwei", material.danwei || "");
                formData.append("yongtu", material.yongtu || "");
                formData.append("guigexinghao", material.guigexinghao || "");
                formData.append("beizhu", material.beizhu || "");
                await createMaterialMutation.mutateAsync(formData.toString());
            }

            message.success(`成功添加 ${materials.length} 个物料！`);
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("新增物料失败:", error);
            message.error("新增物料失败，请重试");
        }
    };

    // 获取类别显示文本
    const getCategoryText = (lei: string) => {
        return lei === "1" ? "物料" : lei === "2" ? "药品" : "未知";
    };

    // 获取申请类型文本
    const getApplicationTypeText = (leibie: string) => {
        return leibie === "in" ? "入库申请" : leibie === "out" ? "出库申请" : "未知";
    };

    // 骨架屏组件
    const DetailSkeleton = () => (
        <div className="p-6">
            <div className="mb-6">
                <Skeleton.Button style={{ width: 100, height: 32 }} active />
            </div>
            <Card>
                <Skeleton active paragraph={{ rows: 8 }} />
                <Divider />
                <div className="flex justify-between items-center mb-4">
                    <Skeleton.Button style={{ width: 120, height: 32 }} active />
                    <Skeleton.Button style={{ width: 100, height: 32 }} active />
                </div>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        </div>
    );

    if (appLoading) {
        return <DetailSkeleton />;
    }

    if (appError) {
        return (
            <div className="p-6">
                <Alert
                    message="加载失败"
                    description={appError.message || "获取申请详情时发生错误"}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            </div>
        );
    }

    if (!selectedApplication) {
        return (
            <div className="p-6">
                <Alert
                    message="申请单不存在"
                    description="未找到对应的申请单信息"
                    type="warning"
                    showIcon
                    className="mb-4"
                />
            </div>
        );
    }

    // 物料列表表格列定义
    const materialsColumns: ColumnsType<MaterialItem> = [
        {
            title: "编码",
            dataIndex: "bianma",
            key: "col_bianma",
            width: 120,
        },
        {
            title: "物料名称",
            dataIndex: "name",
            key: "col_name",
        },
        {
            title: "规格型号",
            dataIndex: "guigexinghao",
            key: "col_guigexinghao",
        },
        {
            title: "数量",
            dataIndex: "shuliang",
            key: "col_shuliang",
            width: 80,
            align: "center",
        },
        {
            title: "单位",
            dataIndex: "danwei",
            key: "col_danwei",
            width: 80,
            align: "center",
        },
        {
            title: "用途",
            dataIndex: "yongtu",
            key: "col_yongtu",
            width: 120,
        },
        {
            title: "备注",
            dataIndex: "beizhu",
            key: "col_beizhu",
            ellipsis: true,
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Space>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        type="text"
                        onClick={() => router.push("/materials/applicants")}
                    >
                        返回申请列表
                    </Button>
                </Space>
            </div>

            <Card
                title={selectedApplication.title || "未填写标题"}
                extra={
                    <Space>
                        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                            修改申请
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                            删除申请
                        </Button>
                    </Space>
                }
            >
                <Descriptions bordered column={2}>
                    <Descriptions.Item label="申请单号">
                        <span className="font-mono text-blue-600">
                            {selectedApplication.danhao}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="申请标题">
                        {selectedApplication.title || "未填写标题"}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人">
                        {selectedApplication.chuangjianren || "未知"}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人工号">
                        {selectedApplication.chuangjianrengonghao}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                        {selectedApplication.chuangjianshijian}
                    </Descriptions.Item>
                    <Descriptions.Item label="来源">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                            {selectedApplication.laiyuan}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="类别">
                        <span
                            className={`px-2 py-1 rounded-md text-sm ${
                                selectedApplication.lei === "1"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                            }`}
                        >
                            {getCategoryText(selectedApplication.lei)}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="申请类型">
                        <span
                            className={`px-2 py-1 rounded-md text-sm ${
                                selectedApplication.leibie === "in"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-orange-100 text-orange-800"
                            }`}
                        >
                            {getApplicationTypeText(selectedApplication.leibie)}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="确认人">
                        {selectedApplication.querenren || "待确认"}
                    </Descriptions.Item>
                    <Descriptions.Item label="确认时间">
                        {selectedApplication.querenshijian || "待确认"}
                    </Descriptions.Item>
                    <Descriptions.Item label="备注" span={2}>
                        {selectedApplication.beizhu || "无备注"}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left">物料清单</Divider>

                <div className="flex justify-end mb-4">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsAddModalVisible(true)}
                    >
                        新增物料
                    </Button>
                </div>

                {materialsLoading ? (
                    <div className="flex justify-center py-8">
                        <Spin>加载物料清单中...</Spin>
                    </div>
                ) : materialsError ? (
                    <Alert
                        message="加载物料清单失败"
                        description={materialsError.message || "获取物料清单时发生错误"}
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                ) : (
                    <Table
                        columns={materialsColumns}
                        dataSource={materialsListData?.data || []}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                            showQuickJumper: false,
                        }}
                        scroll={{ x: 800 }}
                        size="middle"
                        locale={{
                            emptyText: "暂无物料数据",
                        }}
                    />
                )}
            </Card>

            {/* 新增物料模态框 */}
            <Modal
                title="新增物料"
                open={isAddModalVisible}
                onCancel={() => {
                    setIsAddModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="确认新增"
                cancelText="取消"
                width={1000}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={handleAddMaterial}>
                    <Form.List name="materials" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        className="border border-gray-200 rounded-lg p-4 mb-4 relative"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-sm font-medium text-gray-700">
                                                物料 {name + 1}
                                            </h4>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="text"
                                                    danger
                                                    size="small"
                                                    onClick={() => remove(name)}
                                                >
                                                    删除
                                                </Button>
                                            )}
                                        </div>

                                        <Row gutter={16}>
                                            <Col span={6}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "wuzimingcheng"]}
                                                    label="物料名称"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "请选择物料名称",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        placeholder="请选择物料名称"
                                                        showSearch
                                                        filterOption={(input, option) =>
                                                            (option?.label?.toString() ?? "")
                                                                .toLowerCase()
                                                                .includes(input.toLowerCase())
                                                        }
                                                        options={
                                                            materialNameData?.data?.map((item) => ({
                                                                value: item.title,
                                                                label: item.title,
                                                                bianma: item.bianma,
                                                            })) || []
                                                        }
                                                        onChange={(value, option) => {
                                                            const currentValues =
                                                                form.getFieldsValue();
                                                            const materials =
                                                                currentValues.materials || [];
                                                            if (
                                                                materials[name] &&
                                                                option &&
                                                                !Array.isArray(option)
                                                            ) {
                                                                materials[name].bianma =
                                                                    (option as any)?.bianma || "";
                                                                form.setFieldsValue({ materials });
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "bianma"]}
                                                    label="物料编码"
                                                >
                                                    <Input
                                                        placeholder="选择物料后自动填入"
                                                        disabled
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "shuliang"]}
                                                    label="数量"
                                                    rules={[
                                                        { required: true, message: "请输入数量" },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="请输入数量"
                                                        min={1}
                                                        style={{ width: "100%" }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "danwei"]}
                                                    label="单位"
                                                    rules={[
                                                        { required: true, message: "请输入单位" },
                                                    ]}
                                                >
                                                    <Input placeholder="请输入单位" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "yongtu"]}
                                                    label="用途"
                                                    rules={[
                                                        { required: true, message: "请输入用途" },
                                                    ]}
                                                >
                                                    <Input placeholder="请输入用途" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "beizhu"]}
                                                    label="备注"
                                                >
                                                    <Input placeholder="请输入备注信息" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}

                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        添加物料
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
}
