"use client"
import { Table, Tooltip } from "antd";
import Link from "next/link";

export default function StockTable() {
    
    const columns = [
        {
            title: "物料名称",
            dataIndex: "title",
            key: "title",
            width: 200,
            render: (text, record) => (
                <Tooltip title={text} placement="topLeft">
                    <Link 
                        href={`/materials/stock/${(record.number)}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline block truncate"
                    >
                        {text}
                    </Link>
                </Tooltip>
            ),
        },
        {
            title: "物料编号",
            dataIndex: "number",
            key: "number",
        },
        {
            title: "物料数量",
            dataIndex: "count",
            key: "count",
        },
        {
            title: "用途",
            dataIndex: "use",
            key: "use",
            width: 150,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate">
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="truncate">
                        {text}
                    </div>
                </Tooltip>
            ),
        }
    ];

    // 模拟库存数据
    const dataSource = [
        {
            key: '1',
            title: '泥雨-止水器-DN65内扣式转DN65内扣式-锻造DN65内扣式转DN65内扣式-锻造',
            number: 'MT-2024-001',
            count: '150件',
            use: '生产设备维护',
            remark: '定期检查库存'
        },
        {
            key: '2',
            title: '泥雨-三分器-DN65内扣式出转DN65×2内扣式出-锻造DN65内扣式出转DN65×2内扣式出-锻造',
            number: 'MT-2024-002',
            count: '85件',
            use: '设备连接',
            remark: '库存充足'
        },
        {
            key: '3',
            title: '上海宝亚-正压式消防空气呼吸器-RHZK6.8/X 空呼全面罩，供气阀，背具显示HUD，空呼背板，液压缸系统 压力表装置',
            number: 'MT-2024-003',
            count: '25套',
            use: '安全防护',
            remark: '重要安全设备'
        },
        {
            key: '4',
            title: '防爆电机',
            number: 'MT-2024-004',
            count: '12台',
            use: '动力设备',
            remark: '防爆等级ExdIIBT4'
        },
        {
            key: '5',
            title: '不锈钢管道',
            number: 'MT-2024-005',
            count: '500米',
            use: '管道连接',
            remark: '304不锈钢材质'
        }
    ];

    return (
        <Table 
            columns={columns}
            dataSource={dataSource}
            pagination={{
                pageSize: 10,
                showQuickJumper: true,
            }}
        />
    )
}