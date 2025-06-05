"use client";

import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider } from "antd";
import ReactQueryProvider from "@/lib/react-query-provider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Geist, Geist_Mono } from "next/font/google";
import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import "./globals.css";

dayjs.locale("zh-cn");

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

/**
 * 根布局组件
 * @param {Object} props - 组件属性
 * @param {React.ReactNode} props.children - 子组件
 * @returns {JSX.Element} 根布局
 */
export default function RootLayout({ children }) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <title>EHS</title>
                <meta name="description" content="8BU—EHS" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/src/app/favicon.ico" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ConfigProvider
                    locale={zhCN}
                    theme={{
                        cssVar: true,
                        hashed: false,
                    }}
                >
                    <AntdRegistry>
                        <ReactQueryProvider>{children}</ReactQueryProvider>
                    </AntdRegistry>
                </ConfigProvider>
            </body>
        </html>
    );
}
