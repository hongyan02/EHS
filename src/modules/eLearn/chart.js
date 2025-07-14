"use client";
import BarChart from "@/components/eLearn/barChart";
import ETable from "@/components/eLearn/eTable";

/**
 * 图表组件
 * @param {Object} props - 组件属性
 * @param {string} props.projectName - 项目名称
 * @param {Array} props.dataSource - 部门统计数据数组
 * @returns {JSX.Element} 图表组件
 */
export default function Chart({ projectName, dataSource }) {
    return (
        <div className="flex gap-4 justify-between items-center">
            <div className="w-1/2 h-full">
                <BarChart dataSource={dataSource} />
            </div>
            <div className="w-1/2 h-full">
                <ETable project={projectName} dataSource={dataSource} />
            </div>
        </div>
    );
}
