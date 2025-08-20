"use client";
import { useParams, useRouter } from "next/navigation";
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
    DatePicker,
    Row,
    Col,
} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import useMaterialsStore from "@/store/useMaterialsStore";
import {
    useApplicationQuery,
    useDeleteApplication,
    useGetMaterialByApplication,
    useCreateMaterialByApplication,
    useGetMaterialName,
} from "@/queries/materials";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function MaterialDetailPage() {
    const { modal, message } = App.useApp();
    const params = useParams();
    const router = useRouter();
    const danhao = decodeURIComponent(params.title as string);

    const {
        materialsData,
        isLoading: storeLoading,
        error: storeError,
        selectedApplication,
        getApplicationByDanhao,
        deleteApplication: deleteFromStore,
        setMaterialsData,
        setLoading,
        setError,
    } = useMaterialsStore();

    // 删除申请的mutation
    const deleteApplicationMutation = useDeleteApplication();

    // 新增物料的mutation
    const createMaterialMutation = useCreateMaterialByApplication();

    // 删除单个物料的mutation (暂时注释，等API对接后启用)
    // const deleteMaterialMutation = useDeleteMaterialFromApplication();

    // 获取物料名称列表
    const { data: materialNameData } = useGetMaterialName();

    // 新增物料模态框状态
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [form] = Form.useForm();

    // 如果store中没有数据，直接调用API获取
    const { data: apiData, isLoading: apiLoading, error: apiError } = useApplicationQuery();

    // 同步API数据到store
    useEffect(() => {
        if (apiData?.data && materialsData.length === 0) {
            setMaterialsData(apiData.data);
            setLoading(false);
        }
        if (apiError) {
            setError(apiError);
        }
    }, [apiData, apiError, materialsData.length, setMaterialsData, setLoading, setError]);

    // 根据单号获取申请详情
    useEffect(() => {
        const allData = materialsData.length > 0 ? materialsData : apiData?.data || [];
        if (allData.length > 0) {
            const application = allData.find((item) => item.danhao === danhao);
            if (application) {
                getApplicationByDanhao(danhao);
            }
        }
    }, [danhao, materialsData, apiData, getApplicationByDanhao]);

    const applicationDetail = selectedApplication;
    const isLoading = storeLoading || apiLoading;
    const error = storeError || apiError;

    // 获取申请单下的物料列表
    const {
        data: materialsListData,
        isLoading: materialsLoading,
        error: materialsError,
    } = useGetMaterialByApplication(applicationDetail?.id);

    // 处理删除申请
    const handleDelete = () => {
        if (!applicationDetail) {
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
                    // 构建请求体，传递id
                    const formData = new URLSearchParams();
                    formData.append("id", applicationDetail.id.toString());

                    // 调用删除API
                    await deleteApplicationMutation.mutateAsync(formData);

                    // 从store中删除数据
                    deleteFromStore(danhao);

                    message.success("删除申请单成功");

                    // 删除成功后返回列表页
                    router.push("/materials/in");
                } catch (error) {
                    console.error("删除申请单失败:", error);
                    message.error("删除申请单失败，请重试");
                }
            },
        });
    };

    // 处理修改申请
    const handleEdit = () => {
        // TODO: 跳转到编辑页面或打开编辑模态框
        console.log("修改申请单:", danhao);
    };

    // 处理新增物料
    const handleAddMaterial = async (values: any) => {
        try {
            const { materials } = values;

            // 验证是否有物料数据
            if (!materials || materials.length === 0) {
                message.error("请至少添加一个物料");
                return;
            }

            // 循环调用API为每个物料创建申请
            for (const material of materials) {
                const formData = new URLSearchParams();
                formData.append("danbianhao", applicationDetail?.id?.toString() || "");
                formData.append("wuzimingcheng", material.wuzimingcheng || "");
                formData.append("wuzibianma", material.bianma || "");
                formData.append("shuliang", material.shuliang?.toString() || "");
                formData.append("danwei", material.danwei || "");
                formData.append("yongtu", material.yongtu || "");
                formData.append("guigexinghao", material.guigexinghao || "");
                formData.append("beizhu", material.beizhu || "");
                await createMaterialMutation.mutateAsync(formData);
            }

            message.success(`成功添加 ${materials.length} 个物料！`);
            setIsAddModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error("新增物料失败:", error);
            message.error("新增物料失败，请重试");
        }
    };

    // 处理删除单个物料
    const handleDeleteMaterial = (materialId, materialName) => {
        modal.confirm({
            title: "确认删除物料",
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除物料"${materialName}"吗？删除后无法恢复。`,
            okText: "确认删除",
            okType: "danger",
            cancelText: "取消",
            async onOk() {
                try {
                    // TODO: 对接API后实现
                    console.log("删除物料ID:", materialId);
                    message.success("删除物料成功（演示）");
                } catch (error) {
                    console.error("删除物料失败:", error);
                    message.error("删除物料失败，请重试");
                }
            },
        });
    };

    // 获取类别显示文本
    const getCategoryText = (lei: string) => {
        return lei === "1" ? "物料" : lei === "2" ? "药品" : "未知";
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-12">
                    <Spin size="large">
                        <div className="p-8">加载中...</div>
                    </Spin>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <Alert
                    message="加载失败"
                    description={error.message || "获取申请详情时发生错误"}
                    type="error"
                    showIcon
                    className="mb-4"
                />
            </div>
        );
    }

    if (!applicationDetail) {
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
    const materialsColumns = [
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
            align: "center" as const,
        },
        {
            title: "单位",
            dataIndex: "danwei",
            key: "col_danwei",
            width: 80,
            align: "center" as const,
        },
        {
            title: "用途",
            dataIndex: "yongtu",
            key: "col_yongtu",
            width: 120,
        },
        {
            title: "过期时间",
            dataIndex: "guoqishijian",
            key: "col_guoqishijian",
            width: 120,
        },
        {
            title: "创建时间",
            dataIndex: "chuangjianshijian",
            key: "col_chuangjianshijian",
            width: 120,
        },
        {
            title: "备注",
            dataIndex: "beizhu",
            key: "col_beizhu",
            ellipsis: true,
        },
        {
            title: "操作",
            key: "action",
            width: 100,
            align: "center" as const,
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteMaterial(record.id, record.name)}
                    title="删除物料"
                >
                    删除
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Space>
                    <Link href="/materials/in">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                        >
                            返回申请列表
                        </Button>
                    </Link>
                </Space>
            </div>

            <Card
                title={`${applicationDetail.title}`}
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                        >
                            修改申请
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                        >
                            删除申请
                        </Button>
                    </Space>
                }
            >
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="申请单号">
                        <span className="font-mono text-blue-600">{applicationDetail.danhao}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="申请标题">
                        {applicationDetail.title}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人">
                        {applicationDetail.chuangjianren}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建人工号">
                        {applicationDetail.chuangjianrengonghao}
                    </Descriptions.Item>
                    <Descriptions.Item label="创建时间">
                        {applicationDetail.chuangjianshijian}
                    </Descriptions.Item>
                    <Descriptions.Item label="来源">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                            {applicationDetail.laiyuan}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="类别">
                        <span
                            className={`px-2 py-1 rounded-md text-sm ${
                                applicationDetail.lei === "1"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-purple-100 text-purple-800"
                            }`}
                        >
                            {getCategoryText(applicationDetail.lei)}
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="申请类型">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
                            入库申请
                        </span>
                    </Descriptions.Item>
                    <Descriptions.Item label="确认人">
                        {applicationDetail.querenren || "待确认"}
                    </Descriptions.Item>
                    <Descriptions.Item label="确认时间">
                        {applicationDetail.querenshijian || "待确认"}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label="备注"
                        span={2}
                    >
                        {applicationDetail.beizhu || "无备注"}
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
                        scroll={{ x: 1000 }}
                        size="middle"
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
                width={1200}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddMaterial}
                >
                    <Form.List
                        name="materials"
                        initialValue={[{}]}
                    >
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
                                            <Col span={4}>
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
                                                            // 自动填入物料编码
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
                                            <Col span={3}>
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
                                            <Col span={2}>
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
                                            <Col span={2}>
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
                                            <Col span={3}>
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
                                            {applicationDetail?.lei === "2" && (
                                                <>
                                                    <Col span={3}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "guigexinghao"]}
                                                            label="规格型号"
                                                        >
                                                            <Input placeholder="请输入规格型号" />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={3}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "guoqishijian"]}
                                                            label="过期时间"
                                                        >
                                                            <DatePicker
                                                                placeholder="请选择过期时间"
                                                                style={{ width: "100%" }}
                                                            />
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
                                                </>
                                            )}
                                            {applicationDetail?.lei !== "2" && (
                                                <Col span={10}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "beizhu"]}
                                                        label="备注"
                                                    >
                                                        <Input placeholder="请输入备注信息" />
                                                    </Form.Item>
                                                </Col>
                                            )}
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
