"use client";
import { Table } from "antd";
import { MedicineItem, MedicineTableProps } from "@/types/medicine";
import { useMedicineStock } from "@/hooks/materials/use-medicine-stock";

export default function MedicineTable({
    dataSource: propDataSource,
    loading: propLoading = false,
    pagination,
}: MedicineTableProps = {}) {
    const { data: medicineData, isLoading, error } = useMedicineStock();

    // 使用传入的数据源或API数据
    const dataSource = propDataSource || medicineData;
    const loading = propLoading || isLoading;
    const columns = [
        {
            title: "药品名称",
            dataIndex: "wuzimingcheng",
            key: "wuzimingcheng",
        },
        {
            title: "规格",
            dataIndex: "guigexinghao",
            key: "guigexinghao",
        },
        {
            title: "单位",
            dataIndex: "danwei",
            key: "danwei",
        },
        {
            title: "库存数量",
            dataIndex: "kucun",
            key: "kucun",
            render: (text: number, record: MedicineItem) => (
                <span className={Number(text) < Number(record.fazhi) ? "text-red-500" : ""}>
                    {text}
                </span>
            ),
        },
        {
            title: "库存阀值",
            dataIndex: "fazhi",
            key: "fazhi",
        },
        {
            title: "过期日期",
            dataIndex: "expireDate",
            key: "expireDate",
        },
    ];

    // 如果有错误，显示错误信息
    if (error && !propDataSource) {
        console.error("获取医疗库存数据失败:", error);
    }
    return (
        <div>
            {/* <div className="text-2xl font-bold mb-6">急救药品库存</div> */}
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={
                    pagination || {
                        pageSize: 10,
                    }
                }
            />
        </div>
    );
}
