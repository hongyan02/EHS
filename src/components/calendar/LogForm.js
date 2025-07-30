"use client";
import React, { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TipTapEditor from "./TipTapEditor";

/**
 * 日志表单组件
 * @param {Object} props - 组件属性
 * @param {Object} props.initialValues - 初始值
 * @param {Function} props.onSave - 保存回调函数
 * @param {Function} props.onSubmit - 提交回调函数
 * @param {boolean} props.showSubmitButton - 是否显示提交按钮
 * @returns {JSX.Element} 日志表单组件
 */
export default function LogForm({ initialValues, onSave, onSubmit, showSubmitButton = false }) {
    const [form] = Form.useForm();
    const [todoItems, setTodoItems] = useState([{ id: 1, text: "", completed: false }]);
    const [editorContent, setEditorContent] = useState(initialValues?.content || "");

    // 当初始值变化时，设置表单值和todo项
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                author: initialValues.author || "",
            });

            if (initialValues.todoItems && initialValues.todoItems.length > 0) {
                setTodoItems(initialValues.todoItems);
            }

            if (initialValues.content) {
                setEditorContent(initialValues.content);
            }
        }
    }, [form, initialValues]);

    // 添加新的todo项
    const addTodoItem = () => {
        const newId = Math.max(...todoItems.map((item) => item.id), 0) + 1;
        setTodoItems([...todoItems, { id: newId, text: "", completed: false }]);
    };

    // 删除todo项
    const removeTodoItem = (id) => {
        if (todoItems.length > 1) {
            setTodoItems(todoItems.filter((item) => item.id !== id));
        }
    };

    // 更新todo项文本
    const updateTodoItem = (id, text) => {
        setTodoItems(todoItems.map((item) => (item.id === id ? { ...item, text } : item)));
    };

    // 切换todo项完成状态
    const toggleTodoItem = (id) => {
        setTodoItems(
            todoItems.map((item) =>
                item.id === id ? { ...item, completed: !item.completed } : item
            )
        );
    };

    // 处理表单提交
    const handleSubmit = (values) => {
        const formData = {
            author: values.author,
            content: editorContent,
            todoItems: todoItems.filter((item) => item.text.trim() !== ""),
        };

        if (onSave) {
            onSave(formData);
        }
    };

    // 处理编辑器内容变化
    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    return (
        <div className="w-full bg-gray-50 overflow-hidden">
            <div className="flex p-4">
                {/* 主要内容区域 */}
                <div className="flex-1 flex flex-col">
                    <div className="flex flex-col bg-white rounded-lg shadow-sm">
                        {/* <div className="flex-shrink-0 p-6 pb-0">
                            <h2 className="text-lg font-semibold text-gray-800">日志记录</h2>
                        </div> */}
                        <div className="overflow-y-auto p-6 pt-4">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleSubmit}
                                className="flex flex-col space-y-6"
                            >
                                {/* 填写人输入框 */}
                                <Form.Item
                                    name="author"
                                    label="填写人"
                                    rules={[
                                        { required: true, message: "请输入填写人姓名" },
                                        { max: 50, message: "姓名不能超过50个字符" },
                                    ]}
                                    className="flex-shrink-0"
                                >
                                    <Input
                                        placeholder="请输入填写人姓名"
                                        size="large"
                                        prefix={<EditOutlined />}
                                        className="max-w-md"
                                    />
                                </Form.Item>

                                {/* 富文本编辑器 */}
                                <Form.Item
                                    label="日志内容"
                                    className="flex flex-col"
                                >
                                    <TipTapEditor
                                        content={editorContent}
                                        onChange={handleEditorChange}
                                        className="min-h-[300px]"
                                    />
                                </Form.Item>

                                {/* 待办事项 */}
                                <Form.Item
                                    label="待办事项"
                                    className="flex-shrink-0"
                                >
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {todoItems.map((item, index) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start space-x-2 p-3 border border-gray-200 rounded-md bg-white"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        onChange={() => toggleTodoItem(item.id)}
                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 flex-shrink-0 mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <Input.TextArea
                                                            placeholder={`待办事项 ${index + 1}`}
                                                            value={item.text}
                                                            onChange={(e) =>
                                                                updateTodoItem(
                                                                    item.id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={
                                                                item.completed
                                                                    ? "line-through text-gray-500"
                                                                    : ""
                                                            }
                                                            style={{
                                                                textDecoration: item.completed
                                                                    ? "line-through"
                                                                    : "none",
                                                                color: item.completed
                                                                    ? "#9ca3af"
                                                                    : "inherit",
                                                            }}
                                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                                            variant={false}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeTodoItem(item.id)}
                                                        disabled={todoItems.length === 1}
                                                        title="删除此项"
                                                        className="flex-shrink-0"
                                                        size="small"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-3 border-t border-gray-200 mt-3">
                                            <Button
                                                type="dashed"
                                                onClick={addTodoItem}
                                                icon={<PlusOutlined />}
                                                className="w-full"
                                            >
                                                添加待办事项
                                            </Button>
                                        </div>
                                    </div>
                                </Form.Item>

                                {/* 提交按钮 */}
                                <Form.Item className="flex-shrink-0">
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                        >
                                            保存日志
                                        </Button>
                                        {showSubmitButton && (
                                            <Button
                                                type="primary"
                                                danger
                                                size="large"
                                                onClick={() => onSubmit && onSubmit()}
                                            >
                                                提交日志
                                            </Button>
                                        )}
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
