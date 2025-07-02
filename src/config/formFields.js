import { Input, InputNumber, Select } from "antd";

const { TextArea } = Input;
const { Option } = Select;

/**
 * 区域表单字段配置
 */
export const areaFormFields = [
    {
        name: "areaName",
        label: "区域名称",
        rules: [
            { required: true, message: "请输入区域名称" },
            { min: 2, message: "区域名称至少2个字符" },
            { max: 50, message: "区域名称不能超过50个字符" },
        ],
        component: Input,
        componentProps: {
            placeholder: "请输入区域名称",
            size: "large",
            maxLength: 50,
            showCount: true,
        },
    },
    {
        name: "notes",
        label: "区域描述",
        rules: [
            { required: true, message: "请输入区域描述" },
            { min: 5, message: "区域描述至少5个字符" },
            { max: 500, message: "区域描述不能超过500个字符" },
        ],
        component: TextArea,
        componentProps: {
            placeholder: "请详细描述该区域的特点、用途和相关风险...",
            rows: 4,
            maxLength: 500,
            showCount: true,
            size: "large",
        },
    },
];

/**
 * 危险源表单字段配置
 */
export const dangerSourceFormFields = [
    // 基本信息组
    {
        type: "group",
        title: "基本信息",
        fields: [
            {
                name: "product",
                label: "产品系列",
                rules: [{ required: true, message: "请输入产品系列" }],
                component: Input,
                componentProps: { placeholder: "请输入产品系列", size: "large" },
                span: 6,
            },
            {
                name: "department",
                label: "部门",
                rules: [{ required: true, message: "请选择部门" }],
                component: Input,
                componentProps: { placeholder: "请输入部门", size: "large" },
                span: 6,
            },
            {
                name: "area",
                label: "区域",
                rules: [{ required: true, message: "请输入区域" }],
                component: Input,
                componentProps: { placeholder: "请输入作业区域", size: "large" },
                span: 6,
            },
            {
                name: "occupationalDisease",
                label: "职业病危害因素",
                component: Input,
                componentProps: { placeholder: "职业病危害因素", size: "large" },
                span: 6,
            },
            {
                name: "workPosition",
                label: "工作岗位",
                rules: [{ required: true, message: "请输入工作岗位" }],
                component: Input,
                componentProps: { placeholder: "请输入工作岗位", size: "large" },
                span: 12,
            },
            {
                name: "workActivity",
                label: "作业活动",
                rules: [{ required: true, message: "请输入作业活动" }],
                component: Input,
                componentProps: { placeholder: "请输入作业活动", size: "large" },
                span: 12,
            },
        ],
    },
    // 危险源辨识组
    {
        type: "group",
        title: "危险源辨识",
        fields: [
            {
                name: "dangerSourceDescription",
                label: "危险源描述",
                rules: [{ required: true, message: "请输入危险源描述" }],
                component: TextArea,
                componentProps: {
                    rows: 2,
                    placeholder: "请描述危险源情况",
                    size: "large",
                },
                span: 12,
            },
            {
                name: "possibleAccident",
                label: "可能导致的事故",
                rules: [{ required: true, message: "请输入可能导致的事故" }],
                component: TextArea,
                componentProps: {
                    rows: 2,
                    placeholder: "请描述可能发生的事故",
                    size: "large",
                },
                span: 12,
            },
            {
                name: "accidentCase",
                label: "事故案例",
                component: TextArea,
                componentProps: {
                    rows: 2,
                    placeholder: "相关事故案例（选填）",
                    size: "large",
                },
                span: 24,
            },
        ],
    },
    // 风险评估组
    {
        type: "group",
        title: "风险评估",
        fields: [
            {
                name: "l",
                label: "可能性(L)",
                rules: [{ required: true, message: "请选择可能性等级" }],
                component: Select,
                componentProps: {
                    placeholder: "选择可能性",
                    size: "large",
                    children: [1, 2, 3, 4, 5].map((val) => (
                        <Option key={val} value={val}>
                            {val}
                        </Option>
                    )),
                },
                span: 6,
            },
            {
                name: "s",
                label: "严重性(S)",
                rules: [{ required: true, message: "请选择严重性等级" }],
                component: Select,
                componentProps: {
                    placeholder: "选择严重性",
                    size: "large",
                    children: [1, 2, 3, 4, 5].map((val) => (
                        <Option key={val} value={val}>
                            {val}
                        </Option>
                    )),
                },
                span: 6,
            },
            {
                name: "isMajorRisk",
                label: "是否重大风险",
                rules: [{ required: true, message: "请选择是否重大风险" }],
                component: Select,
                componentProps: {
                    placeholder: "选择是否重大风险",
                    size: "large",
                    children: [
                        <Option key={true} value={true}>
                            是
                        </Option>,
                        <Option key={false} value={false}>
                            否
                        </Option>,
                    ],
                },
                span: 12,
            },
        ],
    },
    // 控制措施组
    {
        type: "group",
        title: "控制措施",
        fields: [
            {
                name: "currentControlMeasures",
                label: "当前控制措施",
                rules: [{ required: false, message: "请输入当前控制措施" }],
                component: TextArea,
                componentProps: {
                    rows: 3,
                    placeholder: "请详细描述当前已采取的控制措施...",
                    size: "large",
                    maxLength: 1000,
                    showCount: true,
                },
                span: 24,
            },
        ],
    },
];
