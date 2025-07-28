"use client";
import { useParams } from "next/navigation";
import { useDutyLog } from "../../../hooks/use-duty-log";
import dayjs from "dayjs";
import { Card, Descriptions, Typography, Divider, Empty, Tag } from "antd";
import { UserOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DutyLogDetailPage() {
    const params = useParams();
    const date = params.date;
    
    // 使用当前月份来获取值班数据
    const currentMonth = dayjs(date);
    const { getDutyDataByDateAndShift } = useDutyLog(currentMonth);
    
    // 获取白班和夜班数据
    const dayShiftData = getDutyDataByDateAndShift(date, "0");
    const nightShiftData = getDutyDataByDateAndShift(date, "1");
    
    // 格式化日期显示
    const formatDate = dayjs(date).format("YYYY年MM月DD日");
    const weekDay = dayjs(date).format("dddd");
    
    // 渲染员工信息
    const renderEmployeeInfo = (employees, shiftType) => {
        if (!employees || employees.length === 0) {
            return (
                <Empty 
                    description={`暂无${shiftType}值班安排`}
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            );
        }
        
        const positionMap = {
            dayDutyLeader: "白班值班领导",
            dayDutyManager: "白班值班经理", 
            daySafetyManager: "白班安全经理",
            daySafetyOfficer: "白班安全员",
            nightDutyLeader: "夜班值班领导",
            nightSafetyOfficer: "夜班安全员"
        };
        
        return employees.map((employee, index) => (
            <Card 
                key={index}
                size="small"
                className="mb-3"
                style={{ borderLeft: '4px solid #1890ff' }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <UserOutlined className="text-blue-500" />
                        <div>
                            <Text strong className="text-lg">
                                {employee.employee_name}
                            </Text>
                            <br />
                            <Tag color="blue">
                                {positionMap[employee.position] || employee.position}
                            </Tag>
                        </div>
                    </div>
                    {employee.phone && (
                        <div className="flex items-center space-x-1 text-gray-600">
                            <PhoneOutlined />
                            <Text>{employee.phone}</Text>
                        </div>
                    )}
                </div>
            </Card>
        ));
    };
    
    return (
        <div className="h-full w-full bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* 页面标题 */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="text-center">
                        <Title level={2} className="mb-2">
                            <ClockCircleOutlined className="mr-2" />
                            值班人员详情
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
                            <div className="w-1 h-6 bg-orange-400 mr-3 rounded"></div>
                            <span className="text-lg font-semibold">白班 (08:00 - 20:00)</span>
                        </div>
                    }
                    className="mb-6"
                    headStyle={{ backgroundColor: '#fff7e6', borderBottom: '1px solid #ffd591' }}
                >
                    {renderEmployeeInfo(dayShiftData?.employees, "白班")}
                </Card>
                
                {/* 夜班信息 */}
                <Card 
                    title={
                        <div className="flex items-center">
                            <div className="w-1 h-6 bg-blue-500 mr-3 rounded"></div>
                            <span className="text-lg font-semibold">夜班 (20:00 - 08:00)</span>
                        </div>
                    }
                    headStyle={{ backgroundColor: '#e6f7ff', borderBottom: '1px solid #91d5ff' }}
                >
                    {renderEmployeeInfo(nightShiftData?.employees, "夜班")}
                </Card>
                
                {/* 如果没有任何值班安排 */}
                {!dayShiftData && !nightShiftData && (
                    <Card>
                        <Empty 
                            description="当日暂无值班安排"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </Card>
                )}
            </div>
        </div>
    );
}