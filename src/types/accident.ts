export interface Accident {
    id?: string;
    happen_date?: string;
    month?: string;
    oa_number?: string;
    oa_submit_date?: string;
    product_line?: string;
    detail_place?: string;
    self_ignite_cell_type?: string;
    self_ignite_cell_number?: string;
    battery_self_ignite_reason?: string;
    detail_content?: string;
    accident_or_event?: string;
    accident_cause?: string;
    accident_type?: string;
    economic_loss?: string;
    work_hours_loss?: string;
    accident_level?: string;
    internal_or_related?: string;
    is_traffic_accident?: boolean;
    is_fire_event?: boolean;
    is_smoke_fire_attempt?: boolean;
    event_cause?: string;
    event_type?: string;
    event_economic_loss?: string;
    attempt_classification?: string;
    direct_cause_type?: string;
    detail_content1?: string;
    indirect_cause_type?: string;
    detail_content2?: string;
    system_cause_type?: string;
    detail_content3?: string;
    corrective_measures?: string;
    completion_status?: string;
    is_responsible_accident?: boolean;
    punishment_completed?: boolean;
    punishment_info?: string;
    is_reported?: boolean;
    need_update_hazard_list?: boolean;
    need_update_safety_procedures?: boolean;
}
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
    mode: "create" | "edit";
    initialData?: Partial<AccidentData>;
    onSubmit: (values: Partial<AccidentData>) => void;
    onCancel: () => void;
    loading?: boolean;
}
