"use client";
import { Avatar, List, Steps } from "antd";
import type { StepsProps } from "antd";

export default function InList() {
    const data = [
        {
            title: "沱雨-止水器-DN65内扣式转DN65内扣式-锻造自锁开关  DN65内扣式转DN65内扣式-锻造自锁开关",
            number: "wz123456789",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
            current: 0,
            status: "process",
        },
        {
            title: "沱雨-二分水器-DN65内扣式进转DN65×2内扣式出-锻造 DN65内扣式进转DN65×2内扣式出-锻造",
            number: "wz123456782",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
            current: 1,
            status: "error",
        },
        {
            title: "上海宝亚-正压式消防空气呼吸器-RHZK6.8/X 空呼全面罩，供气阀，抬头显示HUD，空呼背板，减压阀系统 压力表报警哨，他救三通，带压力显示6.8L气瓶，拉杆箱储运包",
            number: "wz123456781",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
            current: 2,
            status: "finish",
        },
        {
            title: "XXX申请消防用品",
            number: "wz123456784",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
            current: 2,
            status: "finish",
        },
        {
            title: "井盖标示牌用料",
            number: "wz123456785",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
            current: 2,
            status: "finish",
        },
    ];

    const items = [
        {
            title: "已申请",
        },
        {
            title: "入库中",
        },
        {
            title: "已完成",
        },
    ];
    return (
        <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                            />
                        }
                        title={
                            <a 
                                href={`/materials/in/${item.number}`}
                                className="md:block line-clamp-2 md:line-clamp-none"
                            >
                                {item.title}
                            </a>
                        }
                        description={
                            <>
                                申请人:{item.applicant}
                                <br />
                                申请时间:{item.applicatioDate}
                            </>
                        }
                    />
                    <Steps
                        style={{ marginTop: 8 }}
                        type="inline"
                        current={item.current}
                        status={item.status as StepsProps["status"]}
                        items={items}
                    />
                </List.Item>
            )}
        />
    );
}
