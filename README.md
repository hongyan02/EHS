# EHS

## 主要技术栈

-   Next.js
-   antd
-   Zustand
-   React Query

完整依赖查阅`package.json`文件

## 路由

-   事件事故台账 /accident
-   值班日志 /dutyLog
-   危险源管理 /dangerSource
-   亿纬学堂 /eLearn

## 异步数据来源

危险源管理、亿纬学堂、值班日志:`EHS-GO` `10.22.161.62:3260` **swageer**:http://10.22.161.62:3260/swagger/index.html#/

事件事故台账：`asp/IIS服务器` `10.22.161.62:80`
