"use client";
import { Avatar, List, Steps } from "antd";
import type { StepsProps } from "antd";

interface InListProps {
    data?: any[];
}

export default function InList({ data = [] }: InListProps) {
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
            renderItem={(item: any, index) => (
                <List.Item>
                    <List.Item.Meta
                        avatar={
                            <Avatar
                                src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                            />
                        }
                        title={
                            <a
                                href={`/materials/in/${item.danhao}`}
                                className="md:block line-clamp-2 md:line-clamp-none"
                            >
                                {item.title}
                            </a>
                        }
                        description={
                            <>
                                申请人:{item.chuangjianren}
                                <br />
                                申请时间:{item.chuangjianshijian}
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
