"use client"
import { Table } from 'antd';
import { MedicineItem, MedicineTableProps } from '@/types/medicine';

export default function MedicineTable({ dataSource: propDataSource, loading, pagination }: MedicineTableProps = {}) {
    const columns = [
        {
            title: '药品名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '规格',
            dataIndex: 'spec',
            key: 'spec',
        },
        {
            title: '单位',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: '库存数量',
            dataIndex: 'count',
            key: 'count',
            render: (text: number, record: MedicineItem) => (
                <span className={Number(text) < Number(record.threshold) ? "text-red-500" : ""}>
                    {text}
                </span>
            ),
        },
        {
            title: '库存阀值',
            dataIndex: 'threshold',
            key: 'threshold',
        },
        {
            title: '过期日期',
            dataIndex: 'expireDate',
            key: 'expireDate',
        },
    ];

    const data: MedicineItem[] = propDataSource || [
        {
            key: '1',
            name: '药品1',
            spec: '规格1',
            unit: '单位1',
            count: 20,
            threshold: 50,
            expireDate: '2023-01-01',
        },
        {
            key: '2',
            name: '药品2',
            spec: '规格2',
            unit: '单位2',
            count: 200,
            threshold: 100,
            expireDate: '2023-02-02',
        },
        {
            key: '3',
            name: '药品3',
            spec: '规格3',
            unit: '单位3',
            count: 300,
            threshold: 150,
            expireDate: '2023-03-03',
        },
    ];
    return (
        <div>
            {/* <div className="text-2xl font-bold mb-6">急救药品库存</div> */}
            <Table 
                columns={columns} 
                dataSource={data} 
                loading={loading}
                pagination={pagination || {
                    pageSize: 10,
                }} 
            />
        </div>
    );
}