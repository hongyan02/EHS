"use client";

import { Card, Row, Col, Typography, Avatar, Badge, Divider } from "antd";
import {
    ReadOutlined,
    CalendarOutlined,
    WarningOutlined,
    EditOutlined,
    TeamOutlined,
    FileTextOutlined,
    SettingOutlined,
    BarChartOutlined,
    SafetyOutlined,
    NotificationOutlined,
    DatabaseOutlined,
    CloudOutlined,
    ApiOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;

/**
 * 导航页面组件
 * @returns {JSX.Element} 导航页面
 */
export default function NavigationPage() {
    const router = useRouter();

    /**
     * 跳转到指定路由
     * @param {string} path - 目标路由路径
     */
    const _handleNavigate = (path) => {
        router.push(path);
    };

    // 现有模块配置
    const existingModules = [
        {
            id: "elearn",
            title: "安全教育培训",
            description: "员工安全教育培训管理和统计",
            icon: <ReadOutlined />,
            color: "#52c41a",
            path: "/eLearn",
            status: "active",
        },
        {
            id: "dutylog",
            title: "值班日志",
            description: "值班记录和日志管理",
            icon: <CalendarOutlined />,
            color: "#faad14",
            path: "/dutyLog",
            status: "active",
        },
        {
            id: "dangersource",
            title: "危险源管理",
            description: "安全隐患识别和风险管控",
            icon: <WarningOutlined />,
            color: "#f5222d",
            path: "/dangerSource",
            status: "active",
        },
        {
            id: "accident",
            title: "事故事件台账",
            description: "事故事件台账管理",
            icon: <EditOutlined />,
            color: "#722ed1",
            path: "/accident",
            status: "active",
        },
    ];

    // 未来规划模块配置
    const futureModules = [
        {
            id: "personnel",
            title: "人员管理",
            description: "员工信息管理和组织架构",
            icon: <TeamOutlined />,
            color: "#13c2c2",
            path: "/personnel",
            status: "planned",
        },
        {
            id: "documents",
            title: "文档中心",
            description: "企业文档和知识库管理",
            icon: <FileTextOutlined />,
            color: "#eb2f96",
            path: "/documents",
            status: "planned",
        },
        {
            id: "analytics",
            title: "数据分析",
            description: "安全数据统计和趋势分析",
            icon: <BarChartOutlined />,
            color: "#fa8c16",
            path: "/analytics",
            status: "planned",
        },
        {
            id: "compliance",
            title: "合规管理",
            description: "法规遵循和审计管理",
            icon: <SafetyOutlined />,
            color: "#a0d911",
            path: "/compliance",
            status: "planned",
        },
        {
            id: "notifications",
            title: "通知中心",
            description: "系统通知和消息管理",
            icon: <NotificationOutlined />,
            color: "#40a9ff",
            path: "/notifications",
            status: "planned",
        },
        {
            id: "database",
            title: "数据管理",
            description: "数据备份和恢复管理",
            icon: <DatabaseOutlined />,
            color: "#b37feb",
            path: "/database",
            status: "planned",
        },
        {
            id: "cloud",
            title: "云服务",
            description: "云存储和同步服务",
            icon: <CloudOutlined />,
            color: "#87d068",
            path: "/cloud",
            status: "planned",
        },
        {
            id: "api",
            title: "API管理",
            description: "接口文档和API测试工具",
            icon: <ApiOutlined />,
            color: "#ffc53d",
            path: "/api",
            status: "planned",
        },
        {
            id: "settings",
            title: "系统设置",
            description: "系统配置和参数管理",
            icon: <SettingOutlined />,
            color: "#bfbfbf",
            path: "/settings",
            status: "planned",
        },
    ];

    /**
     * 渲染模块卡片
     * @param {Object} module - 模块配置
     * @returns {JSX.Element} 模块卡片
     */
    const _renderModuleCard = (module) => {
        const isActive = module.status === "active";

        return (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={module.id}>
                <Badge.Ribbon
                    text={isActive ? "已上线" : "规划中"}
                    color={isActive ? "green" : "blue"}
                >
                    <Card
                        hoverable={isActive}
                        style={{
                            height: "200px",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            opacity: isActive ? 1 : 0.7,
                            cursor: isActive ? "pointer" : "not-allowed",
                        }}
                        styles={{
                            body: {
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                            },
                        }}
                        onClick={() => isActive && _handleNavigate(module.path)}
                    >
                        <div style={{ textAlign: "center", marginBottom: "16px" }}>
                            <Avatar
                                size={56}
                                style={{
                                    backgroundColor: module.color,
                                    fontSize: "24px",
                                }}
                                icon={module.icon}
                            />
                        </div>

                        <div style={{ textAlign: "center", flex: 1 }}>
                            <Title
                                level={4}
                                style={{
                                    margin: "0 0 8px 0",
                                    color: isActive ? "#262626" : "#8c8c8c",
                                    fontSize: "16px",
                                }}
                            >
                                {module.title}
                            </Title>

                            <Paragraph
                                style={{
                                    margin: 0,
                                    color: isActive ? "#595959" : "#bfbfbf",
                                    fontSize: "12px",
                                    lineHeight: "1.4",
                                }}
                                ellipsis={{ rows: 2 }}
                            >
                                {module.description}
                            </Paragraph>
                        </div>
                    </Card>
                </Badge.Ribbon>
            </Col>
        );
    };

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                {/* 页面标题 */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <Title level={1} style={{ color: "#262626", marginBottom: "8px" }}>
                        EHS
                    </Title>
                    <Text type="secondary" style={{ fontSize: "16px" }}>
                        Enterprise Health & Safety Management System
                    </Text>
                </div>

                {/* 现有模块 */}
                <div style={{ marginBottom: "48px" }}>
                    <Title level={2} style={{ color: "#262626", marginBottom: "24px" }}>
                        🚀 现有功能模块
                    </Title>
                    <Row gutter={[16, 16]}>{existingModules.map(_renderModuleCard)}</Row>
                </div>

                <Divider style={{ margin: "48px 0" }} />

                {/* 底部信息 */}
                <div style={{ textAlign: "center", marginTop: "48px", padding: "24px" }}>
                    <Text type="secondary">系统持续更新中，更多功能敬请期待...</Text>
                </div>
            </div>
        </div>
    );
}
