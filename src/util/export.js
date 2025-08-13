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
 * 导出值班表数据为Excel文件（带真实单元格合并）
 * @param {Array} tableData - 值班表数据
 * @param {string} title - 表格标题
 * @param {string} filename - 文件名（不含扩展名）
 */
export const exportWeekTableToExcel = async (
    tableData,
    title = "值班表",
    filename = "duty_schedule"
) => {
    if (!tableData || tableData.length === 0) {
        console.warn("没有数据可导出");
        return;
    }

    try {
        // 动态导入xlsx库
        const XLSX = await import("xlsx");

        // 按日期分组处理数据
        const groupedData = {};
        tableData.forEach((item) => {
            if (!groupedData[item.duty_date]) {
                groupedData[item.duty_date] = [];
            }
            groupedData[item.duty_date].push(item);
        });

        // 创建工作表数据
        const wsData = [];

        // 添加标题行
        wsData.push([title]);

        // 添加表头
        wsData.push([
            "日期",
            "人员",
            "白班-姓名",
            "白班-联系方式",
            "夜班-人员",
            "夜班-姓名",
            "夜班-联系方式",
        ]);

        let currentRow = 2; // 从第3行开始（0索引）
        const merges = []; // 存储合并单元格信息

        // 标题合并
        merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });

        // 生成数据行
        Object.keys(groupedData)
            .sort()
            .forEach((date) => {
                const dateGroup = groupedData[date];
                const groupStartRow = currentRow;

                dateGroup.forEach((item, index) => {
                    const row = [
                        item.duty_date,
                        item.position || "",
                        item.day_person || "",
                        item.day_phone || "",
                        item.night_position || "",
                        item.night_person || "",
                        item.night_phone || "",
                    ];

                    wsData.push(row);
                    currentRow++;
                });

                // 添加日期列合并（整个日期组）
                if (dateGroup.length > 1) {
                    merges.push({
                        s: { r: groupStartRow, c: 0 },
                        e: { r: groupStartRow + dateGroup.length - 1, c: 0 },
                    });
                }

                // 添加夜班列合并（每2行合并一次）
                for (let i = 0; i < dateGroup.length; i += 2) {
                    if (i + 1 < dateGroup.length) {
                        // 夜班-人员列合并
                        merges.push({
                            s: { r: groupStartRow + i, c: 4 },
                            e: { r: groupStartRow + i + 1, c: 4 },
                        });
                        // 夜班-姓名列合并
                        merges.push({
                            s: { r: groupStartRow + i, c: 5 },
                            e: { r: groupStartRow + i + 1, c: 5 },
                        });
                        // 夜班-联系方式列合并
                        merges.push({
                            s: { r: groupStartRow + i, c: 6 },
                            e: { r: groupStartRow + i + 1, c: 6 },
                        });
                    }
                }
            });

        // 添加值班要求（标题和内容合并为一行）
        const requirementsWithTitle =
            "值班要求：\n" +
            [
                "1、必须随身携带对讲机（频道为：10组），关注对讲机通报内容，手机保持开机。",
                "2、值班领导巡查60A工厂施工现场安全情况至少一次，及时发现、处置事故征兆和安全隐感。",
                "3、合理配置本班次的应急力量，落实应急人员检验等工作",
                "4、检查60A工厂安全网格员在岗情况。",
                "5、发生事故时，立即启动相关应急预案井调集应急力量开展事故救援。",
                "6、填写值班记录表，交接值班未解决的问题。",
                "7、当日值班领导、安全管理人员不能为同一人。",
                "8、值班人员班时间为当天8：30-20：30。",
                "9、如当班人员因事要调班的，应自行沟通好替班人员《注：必须为同级别人员》，确保不能出现缺岗空岗情况。并将替班情况报告安全管理群。",
            ].join("\n");

        wsData.push([requirementsWithTitle, "", "", "", "", "", ""]);
        merges.push({
            s: { r: currentRow, c: 0 },
            e: { r: currentRow, c: 6 }
        });
        currentRow++;
        
        // 添加制作、审批、签批行
        wsData.push(["制作：", "", "审批：", "", "签批：", "", ""]);
        // 制作占两列（0-1列）
        merges.push({
            s: { r: currentRow, c: 0 },
            e: { r: currentRow, c: 1 }
        });
        // 审批占两列（2-3列）
        merges.push({
            s: { r: currentRow, c: 2 },
            e: { r: currentRow, c: 3 }
        });
        // 签批占三列（4-6列）
        merges.push({
            s: { r: currentRow, c: 4 },
            e: { r: currentRow, c: 6 }
        });
        currentRow++;

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 应用合并单元格
        ws["!merges"] = merges;

        // 设置列宽
        ws["!cols"] = [
            { wch: 12 }, // 日期
            { wch: 15 }, // 人员
            { wch: 12 }, // 白班-姓名
            { wch: 15 }, // 白班-联系方式
            { wch: 15 }, // 夜班-人员
            { wch: 12 }, // 夜班-姓名
            { wch: 15 }, // 夜班-联系方式
        ];

        // 设置行高
        const rowHeights = [];
        for (let i = 0; i < wsData.length; i++) {
            // 标题行设置较大行高
            if (i === 0) {
                rowHeights[i] = { hpt: 30 }; // 30磅行高，适应标题
            }
            // 值班要求内容行设置较大行高
            else if (wsData[i][0] && wsData[i][0].toString().includes("值班要求：")) {
                rowHeights[i] = { hpt: 220 }; // 220磅行高，适应标题和多行文本
            } else {
                rowHeights[i] = { hpt: 20 }; // 默认20磅行高
            }
        }
        ws["!rows"] = rowHeights;

        // 设置所有单元格的样式为水平和垂直居中
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellAddress]) continue;

                // 设置单元格样式
                ws[cellAddress].s = {
                    alignment: {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true,
                    },
                    font: {
                        name: "宋体",
                        sz: 11,
                    },
                    border: {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    },
                };

                // 标题行特殊样式
                if (R === 0) {
                    ws[cellAddress].s.font = {
                        name: "宋体",
                        sz: 16,
                        bold: true,
                    };
                    ws[cellAddress].s.alignment = {
                        horizontal: "center",
                        vertical: "center",
                        wrapText: true,
                    };
                }

                // 表头行特殊样式
                if (R === 1) {
                    ws[cellAddress].s.font = {
                        name: "宋体",
                        sz: 11,
                        bold: true,
                    };
                    ws[cellAddress].s.fill = {
                        fgColor: { rgb: "F2F2F2" },
                    };
                }

                // 值班要求内容特殊样式（左对齐，包含标题）
                if (ws[cellAddress].v && ws[cellAddress].v.toString().includes("值班要求：")) {
                    ws[cellAddress].s.alignment = {
                        horizontal: "left",
                        vertical: "top",
                        wrapText: true,
                    };
                    ws[cellAddress].s.font = {
                        name: "宋体",
                        sz: 11,
                    };
                }
            }
        }

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "值班表");

        // 导出文件
        const fileName = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    } catch (error) {
        console.error("导出Excel失败:", error);
        // 如果xlsx库加载失败，回退到CSV导出
        exportWeekTableToCSV(tableData, title, filename);
    }
};

/**
 * 导出值班表数据为CSV文件
 * @param {Array} tableData - 值班表数据
 * @param {string} title - 表格标题
 * @param {string} filename - 文件名（不含扩展名）
 */
export const exportWeekTableToCSV = (tableData, title = "值班表", filename = "duty_schedule") => {
    if (!tableData || tableData.length === 0) {
        console.warn("没有数据可导出");
        return;
    }

    // 创建CSV内容
    const csvContent = [];

    // 添加标题
    csvContent.push(`"${title}"`);
    csvContent.push(""); // 空行

    // 添加表头
    const headers = [
        "日期",
        "人员",
        "白班-姓名",
        "白班-联系方式",
        "夜班-人员",
        "夜班-姓名",
        "夜班-联系方式",
    ];
    csvContent.push(headers.map((h) => `"${h}"`).join(","));

    // 按日期分组处理数据
    const groupedData = {};
    tableData.forEach((item) => {
        if (!groupedData[item.duty_date]) {
            groupedData[item.duty_date] = [];
        }
        groupedData[item.duty_date].push(item);
    });

    // 生成数据行
    Object.keys(groupedData)
        .sort()
        .forEach((date) => {
            const dateGroup = groupedData[date];

            dateGroup.forEach((item, index) => {
                const row = [
                    index === 0 ? item.duty_date : "", // 日期只在第一行显示
                    item.position || "",
                    item.day_person || "",
                    item.day_phone || "",
                    // 夜班数据处理：只在偶数行显示（0,2,4...）
                    index % 2 === 0 ? item.night_position || "" : "",
                    index % 2 === 0 ? item.night_person || "" : "",
                    index % 2 === 0 ? item.night_phone || "" : "",
                ];

                const csvRow = row
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(",");
                csvContent.push(csvRow);
            });
        });

    // 添加BOM以支持中文
    const csvString = "\uFEFF" + csvContent.join("\n");

    // 创建并下载文件
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
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
