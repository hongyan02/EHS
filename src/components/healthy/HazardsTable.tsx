import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Key } from "react";

// 定义职业危害数据的完整类型
export interface HazardData {
    ID?: string;
    // 职业危害因素岗位分布情况
    danwei: string;
    bumen: string;
    xitonggangwei: string;
    gangweixixiang: string;
    gongzuoquyu: string;

    // 职业病危害因素来源情况
    shebeimingcheng: string;
    yuancailiao: string;
    laiyuanmiaoshu: string;

    // 职业病危害因素接触情况
    jiechurenshu: string;
    jiechushijian: string; // 注意：API返回的是jiechushijian，不是jiexiangshijian
    jiechulv: string;
    weihaiyinsu: string;
    zhiyebing: string;
    qiangdu: string;
    zuoyefangshi: string;

    // 职业病防护情况
    gerenfanghuyongping: string;
    fanghusheshi: string;

    // 职业健康检查情况
    tijian: string;
    tijianxiang: string;

    // 其他字段
    fusheceliang: string;
    beizhu: string;
}

interface HazardsTableProps {
    dataSource: HazardData[];
    loading?: boolean;
    selectedRowKeys?: Key[];
    onSelectionChange?: (selectedRowKeys: Key[], selectedRows: HazardData[]) => void;
    onEdit?: (record: HazardData) => void;
    onDelete?: (selectedKeys: Key[]) => void;
}

export default function HazardsTable(props: HazardsTableProps) {
    const {
        dataSource,
        loading,
        selectedRowKeys = [],
        onSelectionChange,
        onEdit,
        onDelete,
    } = props;

    // 行选择配置
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys: Key[], selectedRows: HazardData[]) => {
            onSelectionChange?.(selectedRowKeys, selectedRows);
        },
        getCheckboxProps: (record: HazardData) => ({
            disabled: false,
            name: record.ID,
        }),
    };

    // 处理编辑操作
    const handleEdit = () => {
        if (selectedRowKeys.length === 1) {
            const selectedRecord = dataSource.find((item) => item.ID === selectedRowKeys[0]);
            if (selectedRecord && onEdit) {
                onEdit(selectedRecord);
            }
        }
    };

    // 处理删除操作
    const handleDelete = () => {
        if (selectedRowKeys.length > 0 && onDelete) {
            onDelete(selectedRowKeys);
        }
    };

    const columns = [
        {
            title: "职业危害因素岗位分布情况",
            children: [
                {
                    title: "单位",
                    dataIndex: "danwei",
                    key: "danwei",
                },
                {
                    title: "部门",
                    dataIndex: "bumen",
                    key: "bumen",
                },
                {
                    title: "系统岗位",
                    dataIndex: "xitonggangwei",
                    key: "xitonggangwei",
                },
                {
                    title: "岗位细项",
                    dataIndex: "gangweixixiang",
                    key: "gangweixixiang",
                },
                {
                    title: "工作区域",
                    dataIndex: "gongzuoquyu",
                    key: "gongzuoquyu",
                },
            ],
        },
        {
            title: "职业病危害因素来源情况",
            children: [
                {
                    title: "设备名称",
                    dataIndex: "shebeimingcheng",
                    key: "shebeimingcheng",
                },
                {
                    title: "原辅料",
                    dataIndex: "yuancailiao",
                    key: "yuancailiao",
                },
                {
                    title: "来源描述",
                    dataIndex: "laiyuanmiaoshu",
                    key: "laiyuanmiaoshu",
                },
            ],
        },
        {
            title: "职业病危害因素接触情况",
            children: [
                {
                    title: "接触人员",
                    dataIndex: "jiechurenshu",
                    key: "jiechurenshu",
                },
                {
                    title: "接触时间",
                    dataIndex: "jiechushijian",
                    key: "jiechushijian",
                },
                {
                    title: "接触频率",
                    dataIndex: "jiechulv",
                    key: "jiechulv",
                },
                {
                    title: "接触的职业病危害因素",
                    dataIndex: "weihaiyinsu",
                    key: "weihaiyinsu",
                },
                {
                    title: "可能导致的职业病",
                    dataIndex: "zhiyebing",
                    key: "zhiyebing",
                },
                {
                    title: "职业病危害因素浓度/强度",
                    dataIndex: "qiangdu",
                    key: "qiangdu",
                },
                {
                    title: "作业方式",
                    dataIndex: "zuoyefangshi",
                    key: "zuoyefangshi",
                },
            ],
        },
        {
            title: "职业病防护情况",
            children: [
                {
                    title: "个体防护用品",
                    dataIndex: "gerenfanghuyongping",
                    key: "gerenfanghuyongping",
                },
                {
                    title: "职业病防护设施",
                    dataIndex: "fanghusheshi",
                    key: "fanghusheshi",
                },
            ],
        },
        {
            title: "职业健康检查情况",
            children: [
                {
                    title: "是否需要体检",
                    dataIndex: "tijian",
                    key: "tijian",
                },
                {
                    title: "体检项目",
                    dataIndex: "tijianxiang",
                    key: "tijianxiang",
                },
            ],
        },
        {
            title: "库存数量",
            dataIndex: "fusheceliang",
            key: "fusheceliang",
        },
        {
            title: "备注",
            dataIndex: "beizhu",
            key: "beizhu",
        },
    ];

    return (
        <div>
            {/* 操作按钮区域 */}
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        disabled={selectedRowKeys.length !== 1}
                        onClick={handleEdit}
                    >
                        编辑
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={selectedRowKeys.length === 0}
                        onClick={handleDelete}
                    >
                        删除
                    </Button>
                </Space>
            </div>

            {/* 数据表格 */}
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                scroll={{ x: 2500, y: "calc(100vh - 280px)" }}
                rowKey="ID"
                rowSelection={rowSelection}
                pagination={{
                    showQuickJumper: true,
                }}
            />
        </div>
    );
}
