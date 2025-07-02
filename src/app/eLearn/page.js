"use client";
import { InboxOutlined } from "@ant-design/icons";
import { App, Upload, Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

/**
 * 在线学习页面组件
 * @returns {JSX.Element} 在线学习页面
 */
export default function ELearnPage() {
    // App hook for message API
    const { message } = App.useApp();

    const { Dragger } = Upload;

    /**
     * 上传组件配置
     */
    const uploadProps = {
        name: "file",
        multiple: true,
        action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        /**
         * 处理文件上传状态变化
         * @param {Object} info - 上传信息
         */
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (status === "done") {
                message.success(`${info.file.name} 文件上传成功`);
            } else if (status === "error") {
                message.error(`${info.file.name} 文件上传失败`);
            }
        },
        /**
         * 处理文件拖拽放置
         * @param {Event} e - 拖拽事件
         */
        onDrop(e) {
            console.log("拖拽的文件", e.dataTransfer.files);
        },
    };

    return (
        <div className="w-full h-screen bg-white">
            <div className="w-full h-1/2 flex items-center justify-center p-4">
                {/* Dragger保持美观比例并居中 */}
                <div className="w-full max-w-2xl h-full">
                    <Dragger
                        {...uploadProps}
                        className="w-full h-full"
                        style={{
                            minHeight: "400px",
                            border: "2px dashed #d9d9d9",
                            borderRadius: "12px",
                            backgroundColor: "#fafafa",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <div className="py-16">
                            <p className="ant-upload-drag-icon text-6xl text-blue-500 mb-6">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text text-xl font-semibold text-gray-700 mb-2">
                                点击或拖拽文件到此区域上传
                            </p>
                        </div>
                    </Dragger>
                </div>
            </div>
            <div className="w-full h-1/2 flex items-center justify-center p-4"></div>
        </div>
    );
}
