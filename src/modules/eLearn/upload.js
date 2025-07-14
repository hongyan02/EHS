"use client";

import { Upload, Button, Modal, Form, Input, message } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useUploadExcel } from "@/queries/eLearn";
import { useState } from "react";

const { Dragger } = Upload;

/**
 * 拖拽上传组件
 * @returns {JSX.Element} 拖拽上传组件
 */
export default function UploadComponent() {
    // 模态框显示状态
    const [modalVisible, setModalVisible] = useState(false);
    // 选中的文件列表
    const [fileList, setFileList] = useState([]);
    // 表单实例
    const [form] = Form.useForm();
    // 上传Excel Hook
    const uploadExcel = useUploadExcel();

    /**
     * 打开上传模态框
     */
    const _handleUploadClick = () => {
        if (fileList.length === 0) {
            message.warning("请先选择要上传的文件");
            return;
        }
        setModalVisible(true);
    };

    /**
     * 关闭模态框
     */
    const _handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    /**
     * 处理文件变化
     * @param {Object} info - 文件信息
     */
    const _handleFileChange = (info) => {
        setFileList(info.fileList);
    };

    /**
     * 确认上传
     * @param {Object} values - 表单值
     */
    const _handleConfirmUpload = async (values) => {
        try {
            // 上传Excel文件
            const result = await uploadExcel.mutateAsync(fileList);
            console.log("项目名称:", values.projectName);
            console.log("上传文件:", fileList);
            console.log("上传结果:", result);

            // 存储上传结果到localStorage
            if (result && result.code === 200) {
                const projectKey = `eLearn_${values.projectName}`;
                localStorage.setItem(projectKey, JSON.stringify(result));

                // 触发自定义事件通知其他组件localStorage已更新
                window.dispatchEvent(new CustomEvent("eLearnProjectUpdated"));
            }

            message.success(`项目"${values.projectName}"上传成功！`);

            // 打开新标签页
            const projectName = encodeURIComponent(values.projectName);
            window.open(`/eLearn/${projectName}`, "_blank");

            // 重置状态
            setModalVisible(false);
            setFileList([]);
            form.resetFields();
        } catch (error) {
            console.error("上传失败:", error);
            message.error("上传失败，请重试");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full max-w-4xl px-8">
                <Dragger
                    fileList={fileList}
                    action={"/api/eLearn/upload"}
                    onChange={_handleFileChange}
                    beforeUpload={() => false} // 阻止自动上传
                    multiple
                    style={{
                        height: "500px",
                        minHeight: "40vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "16px",
                        border: "2px dashed #d9d9d9",
                        backgroundColor: "#fafafa",
                        transition: "all 0.3s ease",
                    }}
                    className="hover:border-blue-400 hover:bg-blue-50"
                >
                    <p
                        className="ant-upload-drag-icon"
                        style={{ fontSize: "64px", marginBottom: "24px", color: "#1890ff" }}
                    >
                        <InboxOutlined />
                    </p>
                    <p
                        className="ant-upload-text"
                        style={{ fontSize: "20px", margin: "0", fontWeight: "500" }}
                    >
                        点击或拖拽文件到此区域选择文件
                    </p>
                    <p
                        className="ant-upload-hint"
                        style={{ fontSize: "14px", color: "#999", marginTop: "8px" }}
                    >
                        只支持单个文件，建议使用Excel格式文件
                    </p>
                </Dragger>

                <div style={{ marginTop: "24px", textAlign: "center" }}>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={_handleUploadClick}
                        disabled={fileList.length === 0}
                        size="large"
                        style={{
                            height: "48px",
                            paddingLeft: "32px",
                            paddingRight: "32px",
                            fontSize: "16px",
                            borderRadius: "8px",
                        }}
                    >
                        开始上传
                    </Button>
                </div>

                {/* 上传确认模态框 */}
                <Modal
                    title="确认上传"
                    open={modalVisible}
                    onCancel={_handleCancel}
                    footer={null}
                    width={400}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={_handleConfirmUpload}
                        style={{ marginTop: "20px" }}
                    >
                        <Form.Item
                            label="项目名称"
                            name="projectName"
                            rules={[
                                { required: true, message: "请输入项目名称" },
                                { max: 50, message: "项目名称不能超过50个字符" },
                            ]}
                        >
                            <Input placeholder="请输入项目名称" />
                        </Form.Item>

                        <div style={{ marginBottom: "16px" }}>
                            <label>已选择文件：</label>
                            <div style={{ marginTop: "8px" }}>
                                {fileList.map((file, index) => (
                                    <div key={index} style={{ color: "#666", fontSize: "14px" }}>
                                        • {file.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
                            <Button onClick={_handleCancel} style={{ marginRight: "10px" }}>
                                取消
                            </Button>
                            <Button type="primary" htmlType="submit">
                                确认上传
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
