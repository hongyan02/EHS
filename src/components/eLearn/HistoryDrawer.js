"use client";

import { Drawer, Button, FloatButton } from "antd";
import { UpOutlined, HistoryOutlined } from "@ant-design/icons";
import { useState } from "react";
import HistoryList from "./HistoryList";

/**
 * 历史记录抽屉组件
 * @returns {JSX.Element} 历史记录抽屉组件
 */
export default function HistoryDrawer() {
    const [open, setOpen] = useState(false);

    /**
     * 打开抽屉
     */
    const _handleOpenDrawer = () => {
        setOpen(true);
    };

    /**
     * 关闭抽屉
     */
    const _handleCloseDrawer = () => {
        setOpen(false);
    };

    return (
        <>
            {/* 浮动按钮 - 向上箭头 */}
            <FloatButton
                icon={<UpOutlined />}
                type="primary"
                style={{
                    bottom: 80,
                    right: 40,
                    width: 60,
                    height: 60,
                }}
                tooltip="查看历史记录"
                onClick={_handleOpenDrawer}
            />

            {/* 历史记录抽屉 */}
            <Drawer
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <HistoryOutlined />
                        <span>历史记录</span>
                    </div>
                }
                placement="bottom"
                onClose={_handleCloseDrawer}
                open={open}
                height="70vh"
                style={{
                    paddingBottom: 0,
                }}
                styles={{
                    body: {
                        padding: "20px",
                        backgroundColor: "#fafafa",
                    },
                }}
            >
                <HistoryList />
            </Drawer>
        </>
    );
}
