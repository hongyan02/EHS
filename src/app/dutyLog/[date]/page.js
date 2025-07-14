"use client";
import React from "react";
import { Card, Descriptions, Button, Badge } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

/**
 * 值班日志详情页面
 * @param {Object} params - 路由参数
 * @returns {JSX.Element} 值班日志详情页面组件
 */
export default function DutyLogDetail({ params }) {
    const router = useRouter();
    const { date } = params;

    // 模拟数据 - 实际应用中应该从API获取
    const dutyData = [
        {
            dutyDate: "2025-07-14",
            dutyType: "白班",
            dutyPerson: "张三",
            dutyPhone: "13800138000",
        },
        {
            dutyDate: "2025-07-14",
            dutyType: "夜班",
            dutyPerson: "李四",
            dutyPhone: "13800138000",
        },
        {
            dutyDate: "2025-07-15",
            dutyType: "夜班",
            dutyPerson: "李四",
            dutyPhone: "13800138001",
        },
        {
            dutyDate: "2025-07-16",
            dutyType: "白班",
            dutyPerson: "王五",
            dutyPhone: "13800138002",
        },
    ];

    // 获取当前日期的值班信息
    const currentDutyData = dutyData.filter((item) => item.dutyDate === date);

    // 格式化日期显示
    const formattedDate = dayjs(date).format("YYYY年MM月DD日 dddd");

    /**
     * 返回上一页
     */
    const _handleGoBack = () => {
        router.back();
    };

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* 页面头部 */}
                <div className="flex items-center mb-6">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={_handleGoBack}
                        className="mr-4"
                    >
                        返回
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800">值班日志 - {formattedDate}</h1>
                </div>

                {/* 值班信息列表 */}
                {currentDutyData.length > 0 ? (
                    <div className="space-y-4">
                        {currentDutyData.map((item, index) => (
                            <Card
                                key={`${item.dutyType}-${item.dutyPerson}-${index}`}
                                title={
                                    <div className="flex items-center">
                                        <Badge
                                            status={
                                                item.dutyType === "白班" ? "processing" : "error"
                                            }
                                            text={item.dutyType}
                                        />
                                    </div>
                                }
                                className="shadow-sm"
                            >
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="值班人员">
                                        {item.dutyPerson}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="联系电话">
                                        {item.dutyPhone}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="值班日期">
                                        {dayjs(item.dutyDate).format("YYYY-MM-DD")}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="值班类型">
                                        <Badge
                                            status={
                                                item.dutyType === "白班" ? "processing" : "error"
                                            }
                                            text={item.dutyType}
                                        />
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-8">
                        <div className="text-gray-500">
                            <p className="text-lg mb-2">暂无值班安排</p>
                            <p>选定日期：{formattedDate}</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
