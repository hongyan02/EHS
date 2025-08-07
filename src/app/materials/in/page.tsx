import InList from "@/components/materials/InList";
import { Button } from "antd";
import { PlusOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
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
                        <h1 className="text-2xl font-bold text-gray-800">物料入库管理</h1>
                    </div>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        size="large"
                        className="shadow-sm"
                    >
                        新增入库申请
                    </Button>
                </div>
                <p className="text-gray-600 text-sm mb-4">管理物料入库申请和审批流程</p>
                <div className="border-t pt-4"></div>
            </div>
            <InList />
        </div>
    )
}
