import { Button } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import MedicineTable from '@/components/materials/MedicineTable';

export default function Page() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <Link href="/materials">
                            <Button 
                                icon={<ArrowLeftOutlined />}
                                type="text"
                                className="text-gray-600 hover:text-gray-800"
                            >
                                返回
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800">急救药品库存管理</h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        size="large"
                        className="shadow-sm"
                    >
                        新增药品
                    </Button>
                </div>
                <p className="text-gray-600 text-sm mb-4">查看和管理急救药品库存信息</p>
                <div className="border-t pt-4"></div>
            </div>
            <MedicineTable />
        </div>
    );
}