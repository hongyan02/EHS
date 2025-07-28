"use client";

import ECard from "./eCard";
import { Row, Col, Empty } from "antd";
import { useState, useEffect } from "react";

/**
 * 历史记录列表组件
 * @returns {JSX.Element} 历史记录列表组件
 */
export default function HistoryList() {
    // 历史项目数据
    const [historyProjects, setHistoryProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * 从localStorage获取所有历史项目数据
     */
    const _getHistoryProjects = () => {
        try {
            const projects = [];
            // 遍历localStorage获取所有eLearn项目
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("eLearn_")) {
                    const projectName = key.replace("eLearn_", "");
                    const projectData = localStorage.getItem(key);
                    if (projectData) {
                        const data = JSON.parse(projectData);
                        projects.push({
                            projectName: projectName,
                            data: data.data,
                            uploadTime: data.data?.upload_time || "未知时间",
                            totalUsers: data.data?.total_users || 0,
                            totalCompleted: data.data?.total_completed || 0,
                            overallRate: data.data?.overall_rate || 0,
                        });
                    }
                }
            }

            // 按上传时间排序，最新的在前面
            projects.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
            setHistoryProjects(projects);
        } catch (error) {
            console.error("获取历史项目失败:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        _getHistoryProjects();

        // 监听localStorage变化，当有新项目上传时自动刷新
        const handleStorageChange = () => {
            _getHistoryProjects();
        };

        // 监听自定义事件（用于同一页面内的localStorage更新）
        const handleCustomStorageChange = () => {
            _getHistoryProjects();
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("eLearnProjectUpdated", handleCustomStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("eLearnProjectUpdated", handleCustomStorageChange);
        };
    }, []);

    if (loading) {
        return <div className="text-center py-8">加载中...</div>;
    }

    if (historyProjects.length === 0) {
        return <Empty description="暂无历史记录" style={{ padding: "40px 0" }} />;
    }

    return (
        <Row gutter={[16, 16]}>
            {historyProjects.map((project, index) => (
                <Col
                    xs={24} // 超小屏：1列
                    sm={12} // 小屏：2列
                    md={8} // 中屏：3列
                    lg={6} // 大屏：4列
                    xl={6} // 超大屏：4列
                    key={index}
                >
                    <ECard
                        projectName={project.projectName}
                        uploadTime={project.uploadTime}
                        totalUsers={project.totalUsers}
                        totalCompleted={project.totalCompleted}
                        overallRate={project.overallRate}
                    />
                </Col>
            ))}
        </Row>
    );
}
