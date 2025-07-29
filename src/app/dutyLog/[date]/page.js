"use client";
import { useParams } from "next/navigation";
import { useDutyLog } from "../../../hooks/use-duty-log";
import { useGetDutyLogs } from "../../../queries/dutyLog/log/index";
import dayjs from "dayjs";
import { Card, Descriptions, Typography, Divider, Empty, Tag } from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    ClockCircleOutlined,
    EditOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import ReadOnlyTiptapEditor from "../../../components/ReadOnlyTiptapEditor";

const { Title, Text } = Typography;

export default function DutyLogDetailPage() {
    const params = useParams();
    const date = params.date;

    // 使用当前月份来获取值班数据
    const currentMonth = dayjs(date);
    const { getDutyDataByDateAndShift } = useDutyLog(currentMonth);

    // 获取白班和夜班值班人员数据
    const dayShiftData = getDutyDataByDateAndShift(date, "0");
    const nightShiftData = getDutyDataByDateAndShift(date, "1");

    // 获取白班和夜班日志数据
    const dayShiftLogParams = {
        employee_id: "",
        employee_name: "",
        start_date: date,
        end_date: date,
        shift_type: "0",
    };
    const nightShiftLogParams = {
        employee_id: "",
        employee_name: "",
        start_date: date,
        end_date: date,
        shift_type: "1",
    };

    const { data: dayShiftLogs = [] } = useGetDutyLogs(dayShiftLogParams);
    const { data: nightShiftLogs = [] } = useGetDutyLogs(nightShiftLogParams);

    // 获取当天的日志记录
    const dayShiftLog = dayShiftLogs.find((log) => log.duty_date === date);
    const nightShiftLog = nightShiftLogs.find((log) => log.duty_date === date);

    // 格式化日期显示
    const formatDate = dayjs(date).format("YYYY年MM月DD日");
    const weekDay = dayjs(date).format("dddd");

    // 解析待办事项
    const parseTodos = (todoLog) => {
        if (!todoLog) return [];
        try {
            const parsed = JSON.parse(todoLog);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    // 渲染员工信息
    const renderEmployeeInfo = (employees) => {
        if (!employees || employees.length === 0) {
            return <Text type="secondary">暂无值班人员</Text>;
        }

        const positionMap = {
            dayDutyLeader: "白班值班领导",
            dayDutyManager: "白班值班经理",
            daySafetyManager: "白班安全经理",
            daySafetyOfficer: "白班安全员",
            nightDutyLeader: "夜班值班领导",
            nightSafetyOfficer: "夜班安全员",
        };

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee, index) => (
                    <div
                        key={index}
                        className="flex flex-col space-y-1 p-3 bg-gray-50 rounded-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <UserOutlined className="text-gray-500" />
                            <Text
                                strong
                                className="text-sm"
                            >
                                {employee.employee_name}
                            </Text>
                        </div>
                        <Tag
                            color="blue"
                            size="small"
                            className="self-start"
                        >
                            {positionMap[employee.position] || employee.position}
                        </Tag>
                        {employee.phone && (
                            <div className="flex items-center space-x-1 text-gray-500">
                                <PhoneOutlined className="text-xs" />
                                <Text className="text-xs">{employee.phone}</Text>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // 渲染待办事项
    const renderTodos = (todos) => {
        if (!todos || todos.length === 0) {
            return <Text type="secondary">暂无待办事项</Text>;
        }

        return (
            <ul className="list-none space-y-1">
                {todos.map((todo, index) => (
                    <li
                        key={index}
                        className="flex items-center space-x-2"
                    >
                        <CheckCircleOutlined className="text-green-500 text-xs" />
                        <Text>{todo}</Text>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="h-full w-full bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 页面标题 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="text-center">
                        <Title
                            level={2}
                            className="mb-2"
                        >
                            <ClockCircleOutlined className="mr-2" />
                            值班详情
                        </Title>
                        <Text className="text-lg text-gray-600">
                            {formatDate} ({weekDay})
                        </Text>
                    </div>
                </div>

                {/* 白班信息 */}
                <Card
                    title={
                        <div className="flex items-center">
                            <div className="w-1 h-6 bg-blue-500 mr-3 rounded"></div>
                            <span className="text-lg font-semibold text-blue-600">
                                白班 (08:30 - 20:30)
                            </span>
                        </div>
                    }
                    className="mb-6"
                    headStyle={{
                        backgroundColor: "#e6f7ff",
                        borderBottom: "1px solid #91d5ff",
                    }}
                >
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ width: "120px", backgroundColor: "#f0f9ff" }}
                    >
                        <Descriptions.Item
                            label={
                                <span>
                                    <UserOutlined className="mr-2" />
                                    值班人员
                                </span>
                            }
                        >
                            {renderEmployeeInfo(dayShiftData?.employees)}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span>
                                    <EditOutlined className="mr-2" />
                                    值班日志
                                </span>
                            }
                        >
                            {dayShiftLog?.duty_log ? (
                                <div className="border border-gray-200 rounded-md p-3 bg-white">
                                    <ReadOnlyTiptapEditor content={dayShiftLog.duty_log} />
                                </div>
                            ) : (
                                <Text type="secondary">暂无日志记录</Text>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span>
                                    <CheckCircleOutlined className="mr-2" />
                                    待办事项
                                </span>
                            }
                        >
                            <div className="border border-gray-200 rounded-md p-3 bg-white">
                                {renderTodos(parseTodos(dayShiftLog?.todo_log))}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 夜班信息 */}
                <Card
                    title={
                        <div className="flex items-center">
                            <div className="w-1 h-6 bg-red-500 mr-3 rounded"></div>
                            <span className="text-lg font-semibold text-red-600">
                                夜班 (20:00 - 08:00)
                            </span>
                        </div>
                    }
                    headStyle={{
                        backgroundColor: "#fef2f2",
                        borderBottom: "1px solid #fecaca",
                    }}
                >
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        labelStyle={{ width: "120px", backgroundColor: "#fef7f7" }}
                    >
                        <Descriptions.Item
                            label={
                                <span>
                                    <UserOutlined className="mr-2" />
                                    值班人员
                                </span>
                            }
                        >
                            {renderEmployeeInfo(nightShiftData?.employees)}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span>
                                    <EditOutlined className="mr-2" />
                                    值班日志
                                </span>
                            }
                        >
                            {nightShiftLog?.duty_log ? (
                                <div className="border border-gray-200 rounded-md p-3 bg-white">
                                    <ReadOnlyTiptapEditor content={nightShiftLog.duty_log} />
                                </div>
                            ) : (
                                <Text type="secondary">暂无日志记录</Text>
                            )}
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={
                                <span>
                                    <CheckCircleOutlined className="mr-2" />
                                    待办事项
                                </span>
                            }
                        >
                            <div className="border border-gray-200 rounded-md p-3 bg-white">
                                {renderTodos(parseTodos(nightShiftLog?.todo_log))}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* 如果没有任何值班安排和日志 */}
                {!dayShiftData && !nightShiftData && !dayShiftLog && !nightShiftLog && (
                    <Card>
                        <Empty
                            description="当日暂无值班安排和日志记录"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Card>
                )}
            </div>
        </div>
    );
}
