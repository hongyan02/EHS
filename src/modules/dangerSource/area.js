import { Row, Col, Card, Button, Modal, Form, Input, InputNumber, Spin, Alert, App } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import {
    useGetAreaList,
    useAddArea,
    useUpdateArea,
    useDeleteArea,
} from "@/queries/dangerSource/area";
import AreaDetailDrawer from "@/components/area/AreaDetailDrawer";
import useAreaStore from "@/store/useAreaStore";
import { useState } from "react";

export default function Area() {
    const { message, modal } = App.useApp();

    // 获取区域列表数据
    const { data: areaList = [], isLoading, error } = useGetAreaList();

    // 新增区域的mutation
    const addAreaMutation = useAddArea();
    // 更新区域的mutation
    const updateAreaMutation = useUpdateArea();
    // 删除区域的mutation
    const deleteAreaMutation = useDeleteArea();
    // 抽屉状态管理
    const { openDetailDrawer } = useAreaStore();
    // 模态框显示状态
    const [modalVisible, setModalVisible] = useState(false);
    // 编辑模式状态
    const [editMode, setEditMode] = useState(false);
    // 当前编辑的区域数据
    const [editAreaData, setEditAreaData] = useState(null);
    // 表单实例
    const [form] = Form.useForm();

    /**
     * 渲染单个区域卡片
     * @param {Object} item - 区域数据
     * @param {number} index - 卡片索引
     * @returns {JSX.Element} 区域卡片组件
     */
    const _renderCard = (item, index) => (
        <Col span={6} key={item.area_id} style={{ marginBottom: "16px" }}>
            <Card
                title={item.area_name || `区域 ${index + 1}`}
                hoverable={false}
                style={{
                    height: "200px",
                    border: "2px solid #91B5FA",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}
                styles={{ body: { paddingBottom: "8px" } }}
                actions={[
                    <Button key="edit" type="text" size="small" onClick={() => _editCard(item)}>
                        <EditOutlined />
                        编辑
                    </Button>,
                    <Button
                        key="view"
                        type="text"
                        size="small"
                        onClick={() => _handleViewDetails(item)}
                    >
                        <EyeOutlined />
                        详情
                    </Button>,
                    <Button key="delete" type="text" size="small" onClick={() => _deleteCard(item)}>
                        <DeleteOutlined />
                        删除
                    </Button>,
                ]}
            >
                <p>{item.notes || "暂无描述"}</p>
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                    区域级别: {item.area_level}
                </div>
            </Card>
        </Col>
    );

    /**
     * 打开添加区域的模态框
     */
    const _addCard = () => {
        setEditMode(false);
        setEditAreaData(null);
        setModalVisible(true);
        // 重置表单并设置默认值
        form.resetFields();
        form.setFieldsValue({
            areaLevel: 0,
        });
    };

    /**
     * 打开编辑区域的模态框
     * @param {Object} areaData - 区域数据
     */
    const _editCard = (areaData) => {
        setEditMode(true);
        setEditAreaData(areaData);
        setModalVisible(true);
        // 预填充表单数据
        form.setFieldsValue({
            area_name: areaData.area_name,
            description: areaData.notes,
            area_level: areaData.area_level,
        });
    };

    /**
     * 查看区域详情
     * @param {Object} areaData - 区域数据
     */
    const _handleViewDetails = (areaData) => {
        openDetailDrawer(areaData);
    };

    /**
     * 删除区域
     * @param {Object} areaData - 区域数据
     */
    const _deleteCard = (areaData) => {
        modal.confirm({
            title: "确认删除",
            content: `您确定要删除区域"${areaData.area_name}"吗？`,
            onOk: async () => {
                try {
                    await deleteAreaMutation.mutateAsync(areaData.area_id);
                    message.success("区域删除成功！");
                } catch (error) {
                    console.error("删除区域失败:", error);
                    message.error("删除区域失败，请重试");
                }
            },
        });
    };

    /**
     * 处理表单提交
     * @param {Object} values - 表单值
     */
    const _handleSubmit = async (values) => {
        const areaInfo = {
            area_name: values.area_name,
            notes: values.description,
            area_level: values.area_level || 0,
        };

        if (editMode) {
            // 编辑模式：更新现有区域
            const updateData = {
                ...areaInfo,
                areaId: editAreaData.area_id,
            };

            try {
                await updateAreaMutation.mutateAsync(updateData);
                message.success("区域更新成功！");

                // 关闭模态框并重置表单
                setModalVisible(false);
                form.resetFields();
                setEditMode(false);
                setEditAreaData(null);
            } catch (error) {
                console.error("更新区域失败:", error);
                message.error("更新区域失败，请重试");
            }
            return;
        } else {
            // 添加模式：新增区域
            try {
                await addAreaMutation.mutateAsync(areaInfo);
                message.success("区域添加成功！");

                // 关闭模态框并重置表单
                setModalVisible(false);
                form.resetFields();
                setEditMode(false);
                setEditAreaData(null);
            } catch (error) {
                console.error("添加区域失败:", error);
                message.error("添加区域失败，请重试");
            }
            return;
        }
    };

    /**
     * 取消操作
     */
    const _handleCancel = () => {
        // 如果正在提交请求（新增或更新），阻止取消操作
        if (addAreaMutation.isPending || updateAreaMutation.isPending) {
            return;
        }

        setModalVisible(false);
        form.resetFields();
        setEditMode(false);
        setEditAreaData(null);
    };

    // 处理加载状态
    if (isLoading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Spin size="large" />
                <div style={{ marginTop: "16px" }}>正在加载区域数据...</div>
            </div>
        );
    }

    // 处理错误状态
    if (error) {
        return (
            <div style={{ padding: "20px" }}>
                <Alert
                    message="加载失败"
                    description={`无法加载区域数据：${error.message}`}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-white p-4">
            <Row gutter={[16, 16]}>
                {areaList.map((item, index) => _renderCard(item, index))}
                {/* 添加新区域的按钮卡片 */}
                <Col span={6} style={{ marginBottom: "16px" }}>
                    <Card
                        style={{
                            height: "200px",
                            display: "flex",
                            border: "1px dashed #000",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            backgroundColor: "#f5f5f5",
                        }}
                        hoverable={false}
                        onClick={_addCard}
                    >
                        <div style={{ textAlign: "center", color: "#666" }}>
                            <div style={{ fontSize: "24px", marginBottom: "8px" }}>+</div>
                            <div>添加区域</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 添加/编辑卡片的模态框 */}
            <Modal
                title={editMode ? "编辑区域" : "添加新区域"}
                open={modalVisible}
                onCancel={_handleCancel}
                footer={null}
                width={500}
                maskClosable={!(addAreaMutation.isPending || updateAreaMutation.isPending)}
                closable={!(addAreaMutation.isPending || updateAreaMutation.isPending)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={_handleSubmit}
                    style={{ marginTop: "20px" }}
                    disabled={addAreaMutation.isPending || updateAreaMutation.isPending}
                >
                    <Form.Item
                        label="区域名称"
                        name="area_name"
                        rules={[
                            { required: true, message: "请输入区域名称" },
                            { max: 50, message: "区域名称不能超过50个字符" },
                        ]}
                    >
                        <Input placeholder="请输入区域名称" />
                    </Form.Item>

                    <Form.Item
                        label="区域级别"
                        name="area_level"
                        rules={[{ required: true, message: "请选择区域级别" }]}
                    >
                        <InputNumber
                            placeholder="请输入区域级别"
                            min={0}
                            max={10}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="区域描述"
                        name="description"
                        rules={[
                            { required: true, message: "请输入区域描述" },
                            { max: 200, message: "描述不能超过200个字符" },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="请输入区域描述"
                            rows={4}
                            showCount
                            maxLength={200}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                        <Button
                            onClick={_handleCancel}
                            style={{ marginRight: "10px" }}
                            disabled={addAreaMutation.isPending || updateAreaMutation.isPending}
                        >
                            取消
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={
                                editMode ? updateAreaMutation.isPending : addAreaMutation.isPending
                            }
                        >
                            {editMode ? "更新" : "确定"}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 区域详情抽屉 */}
            <AreaDetailDrawer />
        </div>
    );
}
