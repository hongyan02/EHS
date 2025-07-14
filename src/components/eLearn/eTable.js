import { Table } from "antd";

/**
 * E-Learning表格组件
 * @param {Object} props - 组件属性
 * @param {string} props.project - 项目名称
 * @param {Array} props.dataSource - 表格数据源
 * @returns {JSX.Element} 表格组件
 */
export default function ETable({ project, dataSource }) {
    const columns = [
        {
            title: "序号",
            dataIndex: "ID",
            key: "ID",
            width: 50,
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "部门",
            dataIndex: "department",
            key: "department",
            width: 100,
            align: "center",
            sorter: (a, b) => a.department.localeCompare(b.department),
        },

        {
            title: project,
            children: [
                {
                    title: "应完成人数",
                    dataIndex: "total_count",
                    key: "total_count",
                    align: "center",
                    width: 80,
                    sorter: (a, b) => a.total_count - b.total_count,
                },
                {
                    title: "已完成人数",
                    dataIndex: "completed_count",
                    key: "completed_count",
                    align: "center",
                    width: 80,
                    sorter: (a, b) => a.completed_count - b.completed_count,
                },
                {
                    title: "未完成人数",
                    dataIndex: "uncompleted_count",
                    key: "uncompleted_count",
                    align: "center",
                    width: 80,
                    sorter: (a, b) => a.uncompleted_count - b.uncompleted_count,
                },
                {
                    title: "完成率",
                    dataIndex: "completion_rate",
                    key: "completion_rate",
                    align: "center",
                    width: 80,
                    sorter: (a, b) => a.completion_rate - b.completion_rate,
                    render: (value) => `${value.toFixed(2)}%`,
                },
            ],
        },
    ];
    return (
        <div>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                    .custom-elearn-table .ant-table-thead > tr > th {
                        background-color: #5F9FF6 !important;
                        color: #fff !important;
                        border: 1px solid #000 !important;
                        font-weight: bold !important;
                    }
                    .custom-elearn-table .ant-table-tbody > tr > td {
                        border: 1px solid #000 !important;
                    }
                    .custom-elearn-table .ant-table-tbody > tr:nth-child(odd) {
                        background-color: #E6F2FF !important;
                    }
                    .custom-elearn-table .ant-table-tbody > tr:nth-child(even) {
                        background-color: #B3D9FF !important;
                    }
                    .custom-elearn-table .ant-table-tbody > tr:hover > td {
                        background-color: #e6f4ff !important;
                    }
                    .custom-elearn-table .ant-table {
                        border: 1px solid #000 !important;
                    }
                    .custom-elearn-table .ant-table-container {
                        border: 1px solid #000 !important;
                    }
                `,
                }}
            />
            <Table
                rowKey="department"
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                bordered={true}
                className="custom-elearn-table"
            />
        </div>
    );
}
