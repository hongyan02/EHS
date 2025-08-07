import { List, Badge } from "antd";
export default function ShowInList() {
    const data = [
        {
            title: "沱雨-止水器-DN65内扣式转DN65内扣式-锻造自锁开关  DN65内扣式转DN65内扣式-锻造自锁开关",
            number: "wz123456789",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
        },
        {
            title: "沱雨-二分水器-DN65内扣式进转DN65×2内扣式出-锻造 DN65内扣式进转DN65×2内扣式出-锻造",
            number: "wz123456782",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
        },
        {
            title: "上海宝亚-正压式消防空气呼吸器-RHZK6.8/X 空呼全面罩，供气阀，抬头显示HUD，空呼背板，减压阀系统 压力表报警哨，他救三通，带压力显示6.8L气瓶，拉杆箱储运包",
            number: "wz123456781",
            applicant: "李泓言",
            applicatioDate: "2025-08-07",
        },
    ];
    return (
        <div>
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Badge status="processing" />}
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
                                    申请人:{item.applicant}&nbsp;&nbsp;&nbsp;&nbsp;申请时间:
                                    {item.applicatioDate}
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}
