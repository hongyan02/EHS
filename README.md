# EHS

## 使用的主要框架与库

-   **Next.js** React 全栈框架
-   **Zustand** 全局状态管理
-   **ReactQuery** 异步数据管理
-   **antd** UI 组件库
-   **tailwind css** css 框架

## 项目结构

| 层级              | 内容                                      | 位置          |
| ----------------- | ----------------------------------------- | ------------- |
| **Page 层**       | 页面结构、调用 hook、控制组件             | `app/`        |
| **components 层** | 搜索栏、表格、弹窗等 UI 组件              | `components/` |
| **Hooks 层**      | useQuery/useMutation 封装、跨组件逻辑抽象 | `hooks/`      |
| **API 层**        | 请求方法封装                              | `api/`        |
| **Store 层**      | 全局状态管理（搜索参数、表格数据）        | `store/`      |
| **Lib 层**        | 请求库、ReactQuery Provider、工具函数等   | `lib/`        |

## 数据流动

```txt
[UI 组件触发用户行为]
          ↓
[更新局部或全局状态 (Zustand / useState / Form)]
          ↓
[触发数据请求 (React Query / Fetch)]
          ↓
[数据返回后更新状态 / 缓存]
          ↓
[页面自动渲染（响应式）]
```

## TODO

-   [ ] 危险源区域——编辑按钮、模态框（区域信息）

-   [ ] 危险源区域——详细按钮、模态框（展示绑定的危险源项、添加、删除操作）

-   [ ] 危险源区域——搜索功能

-   [ ] API 对接

    | 危险源         |
    | -------------- |
    |                |
    | **危险源区域** |
    |                |

### Planning~

-   [ ] 接入富文本编辑器——[Lexical](https://github.com/facebook/lexical)
