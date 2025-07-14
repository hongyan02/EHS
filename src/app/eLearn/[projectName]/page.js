"use client";

import Chart from "@/modules/eLearn/chart";
import { Button, Dropdown, App } from "antd";
import { DownOutlined, FileExcelOutlined, BarChartOutlined } from "@ant-design/icons";
import UnfinishTable from "@/components/eLearn/unfinishTable";
import { useState, useEffect, use } from "react";
import { exportUncompletedUsers, exportDepartmentStats } from "@/util/export";

/**
 * 安全教育培训项目详情页面
 * @param {Object} params - 路由参数Promise
 * @param {string} params.projectName - 项目名称
 * @returns {JSX.Element} 项目详情页面组件
 */
export default function ELearnMore({ params }) {
    // 使用React.use()解包params Promise
    const { projectName } = use(params);
    // 解码URL编码的项目名称
    const decodedProjectName = decodeURIComponent(projectName);

    // 使用App hook获取message实例
    const { message } = App.useApp();

    // 存储API返回的数据
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * 从localStorage获取项目数据
     */
    const _getProjectData = () => {
        try {
            const storedData = localStorage.getItem(`eLearn_${decodedProjectName}`);
            if (storedData) {
                const data = JSON.parse(storedData);
                setProjectData(data);
            }
        } catch (error) {
            console.error("获取项目数据失败:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        _getProjectData();
    }, [decodedProjectName]);

    // 提取数据
    const departmentStats = projectData?.data?.department_stats || [];
    const uncompletedUsers = projectData?.data?.uncompleted_users || [];
    const uploadTime = projectData?.data?.upload_time || "未知";

    /**
     * 导出未完成人员名单
     */
    const _handleExportUncompletedUsers = () => {
        if (uncompletedUsers.length === 0) {
            message.warning("暂无未完成人员数据可导出");
            return;
        }
        exportUncompletedUsers(uncompletedUsers, decodedProjectName);
        message.success("导出成功！");
    };

    /**
     * 导出部门统计数据
     */
    const _handleExportDepartmentStats = () => {
        if (departmentStats.length === 0) {
            message.warning("暂无部门统计数据可导出");
            return;
        }
        exportDepartmentStats(departmentStats, decodedProjectName);
        message.success("导出成功！");
    };

    // 导出下拉菜单配置
    const exportMenuItems = [
        {
            key: "uncompleted",
            label: "导出未完成人员名单",
            icon: <FileExcelOutlined />,
            onClick: _handleExportUncompletedUsers,
        },
        {
            key: "department",
            label: "导出部门统计数据",
            icon: <BarChartOutlined />,
            onClick: _handleExportDepartmentStats,
        },
    ];

    return (
        <div className="flex flex-col gap-4 bg-[#FFF]">
            <div className="flex gap-4 justify-between items-center p-4">
                <h1 className="text-3xl font-bold">{decodedProjectName}</h1>
                <p>
                    <strong>上传时间:{uploadTime}</strong>
                </p>
            </div>
            <div className="h-full w-full flex flex-col p-4">
                <div className="">
                    <Chart projectName={decodedProjectName} dataSource={departmentStats} />
                </div>
            </div>
            <div className="h-full w-full">
                <div className="flex gap-4 justify-between items-center p-4">
                    <h1 className="text-xl font-bold">未完成人员名单</h1>
                    <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight" arrow>
                        <Button type="primary">
                            导出 <DownOutlined />
                        </Button>
                    </Dropdown>
                </div>
                <div className="h-full w-full">
                    <UnfinishTable dataSource={uncompletedUsers} />
                </div>
            </div>
        </div>
    );
}
