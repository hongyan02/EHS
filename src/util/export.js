/**
 * 导出工具函数
 */

/**
 * 将数据导出为CSV文件
 * @param {Array} data - 要导出的数据数组
 * @param {Array} headers - 表头配置 [{key: 'field', title: '显示名称'}]
 * @param {string} filename - 文件名（不含扩展名）
 */
export const exportToCSV = (data, headers, filename = "export") => {
    if (!data || data.length === 0) {
        console.warn("没有数据可导出");
        return;
    }

    // 创建CSV内容
    const csvContent = [];

    // 添加表头
    const headerRow = headers.map((header) => `"${header.title}"`).join(",");
    csvContent.push(headerRow);

    // 添加数据行
    data.forEach((item) => {
        const row = headers
            .map((header) => {
                const value = item[header.key] || "";
                // 处理包含逗号或引号的值
                return `"${String(value).replace(/"/g, '""')}"`;
            })
            .join(",");
        csvContent.push(row);
    });

    // 添加BOM以支持中文
    const csvString = "\uFEFF" + csvContent.join("\n");

    // 创建并下载文件
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * 将数据导出为JSON文件
 * @param {Array|Object} data - 要导出的数据
 * @param {string} filename - 文件名（不含扩展名）
 */
export const exportToJSON = (data, filename = "export") => {
    if (!data) {
        console.warn("没有数据可导出");
        return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.json`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/**
 * 导出未完成人员名单
 * @param {Array} uncompletedUsers - 未完成用户数据
 * @param {string} projectName - 项目名称
 */
export const exportUncompletedUsers = (uncompletedUsers, projectName) => {
    const headers = [
        { key: "employee_id", title: "工号" },
        { key: "name", title: "姓名" },
        { key: "primary_dept", title: "部门" },
        { key: "department", title: "详细部门" },
        { key: "completion_status", title: "完成情况" },
    ];

    // 处理数据，添加完成情况字段
    const processedData = uncompletedUsers.map((user) => ({
        ...user,
        completion_status: user.is_completed ? "已完成" : user.progress > 0 ? "进行中" : "未开始",
    }));

    const filename = `${projectName}_未完成人员名单_${new Date().toISOString().split("T")[0]}`;
    exportToCSV(processedData, headers, filename);
};

/**
 * 导出部门统计数据
 * @param {Array} departmentStats - 部门统计数据
 * @param {string} projectName - 项目名称
 */
export const exportDepartmentStats = (departmentStats, projectName) => {
    const headers = [
        { key: "department", title: "部门" },
        { key: "total_count", title: "应完成人数" },
        { key: "completed_count", title: "已完成人数" },
        { key: "uncompleted_count", title: "未完成人数" },
        { key: "completion_rate", title: "完成率(%)" },
    ];

    // 处理数据，格式化完成率
    const processedData = departmentStats.map((dept) => ({
        ...dept,
        completion_rate: dept.completion_rate.toFixed(2),
    }));

    const filename = `${projectName}_部门统计_${new Date().toISOString().split("T")[0]}`;
    exportToCSV(processedData, headers, filename);
};
