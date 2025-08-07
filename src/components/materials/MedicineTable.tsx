import { Table } from 'antd';

export default function MedicineTable() {
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

    const data = [
        {
            key: '1',
            name: '药品1',
            spec: '规格1',
            unit: '单位1',
            count: 100,
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
            <Table columns={columns} dataSource={data} pagination={{
                pageSize: 10,
            }} />
        </div>
    );
}