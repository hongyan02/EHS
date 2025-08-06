import type { Accident } from "@/lib/db/schema";

// 基础事故数据类型，基于数据库schema
export type AccidentData = Accident;

// 表格行数据类型，包含可选的key字段用于表格渲染
export type AccidentTableRow = AccidentData & {
    key?: string;
};

// 行选择相关的类型
export interface AccidentSelectionState {
    selectedRowKeys: React.Key[];
    selectedRows: AccidentData[];
}

// 表格组件的Props类型
export interface AccidentTableProps {
    selectedRowKeys?: React.Key[];
    onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: AccidentData[]) => void;
}

// 操作按钮组件的Props类型
export interface AccidentActionButtonsProps {
    selectedRowKeys?: React.Key[];
    selectedIds?: string[];
    onAdd?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (ids: string[]) => void;
}

// 表单组件的Props类型
export interface AccidentFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<AccidentData>;
    onSubmit: (values: Partial<AccidentData>) => void;
    onCancel: () => void;
    loading?: boolean;
}