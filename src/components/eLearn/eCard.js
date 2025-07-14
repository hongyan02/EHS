import { Card, Progress, Statistic, Row, Col, Button } from "antd";
import { EyeOutlined, UserOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

/**
 * 项目历史记录卡片组件
 * @param {Object} props - 组件属性
 * @param {string} props.projectName - 项目名称
 * @param {string} props.uploadTime - 上传时间
 * @param {number} props.totalUsers - 总人数
 * @param {number} props.totalCompleted - 已完成人数
 * @param {number} props.overallRate - 总完成率
 * @returns {JSX.Element} 项目卡片组件
 */
export default function ECard({
    projectName = "",
    uploadTime = "",
    totalUsers = 0,
    totalCompleted = 0,
    overallRate = 0,
}) {
    const router = useRouter();

    /**
     * 跳转到项目详情页面
     */
    const _handleViewDetails = () => {
        const encodedProjectName = encodeURIComponent(projectName);
        router.push(`/eLearn/${encodedProjectName}`);
    };

    /**
     * 格式化完成率显示
     */
    const _formatRate = (rate) => {
        return Math.round(rate * 100) / 100; // 保留两位小数
    };

    return (
        <Card
            hoverable
            style={{
                height: "280px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                position: "relative",
            }}
            styles={{
                body: {
                    padding: "16px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* 查看详情按钮 - 右上角 */}
            <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={_handleViewDetails}
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    zIndex: 1,
                    color: "#1890ff",
                    fontSize: "16px",
                    padding: "4px",
                    height: "auto",
                    width: "auto",
                    minWidth: "auto",
                }}
                title="查看详情"
            />

            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {/* 项目名称 */}
                <div style={{ marginBottom: "12px", paddingRight: "40px" }}>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#1890ff",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {projectName || "未命名项目"}
                    </h3>
                </div>

                {/* 完成率进度条 */}
                <div style={{ marginBottom: "16px", textAlign: "center" }}>
                    <Progress
                        type="circle"
                        size={80}
                        percent={_formatRate(overallRate)}
                        format={(percent) => `${percent}%`}
                        strokeColor={{
                            "0%": "#87d068",
                            "100%": "#108ee9",
                        }}
                    />
                </div>

                {/* 统计信息 */}
                <Row gutter={16} style={{ marginBottom: "12px" }}>
                    <Col span={12}>
                        <Statistic
                            title="总人数"
                            value={totalUsers}
                            prefix={<UserOutlined />}
                            valueStyle={{ fontSize: "14px" }}
                        />
                    </Col>
                    <Col span={12}>
                        <Statistic
                            title="已完成"
                            value={totalCompleted}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ fontSize: "14px", color: "#52c41a" }}
                        />
                    </Col>
                </Row>

                {/* 上传时间 */}
                <div
                    style={{
                        marginTop: "auto",
                        fontSize: "12px",
                        color: "#999",
                        textAlign: "center",
                    }}
                >
                    上传时间：{uploadTime}
                </div>
            </div>
        </Card>
    );
}
