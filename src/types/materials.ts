// 物料库存相关类型定义

/**
 * 库存物料项接口
 */
export interface StockItem {
  /** 唯一标识 */
  key: string;
  /** 物料名称 */
  title: string;
  /** 物料编号 */
  number: string;
  /** 单位 */
  unit: string;
  /** 当前库存数量 */
  count: string;
  /** 库存阈值 */
  threshold: string;
  /** 用途 */
  use: string;
  /** 备注 */
  remark: string;
}

/**
 * StockTable组件的Props接口
 */
export interface StockTableProps {
  /** 库存数据源 */
  dataSource?: StockItem[];
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: {
    pageSize?: number;
    showQuickJumper?: boolean;
    current?: number;
    total?: number;
  };
}

/**
 * 库存状态枚举
 */
export enum StockStatus {
  /** 库存充足 */
  SUFFICIENT = 'sufficient',
  /** 库存不足 */
  INSUFFICIENT = 'insufficient',
  /** 库存告急 */
  CRITICAL = 'critical'
}

/**
 * 库存统计信息接口
 */
export interface StockSummary {
  /** 总物料数量 */
  totalItems: number;
  /** 库存不足的物料数量 */
  insufficientItems: number;
  /** 库存告急的物料数量 */
  criticalItems: number;
}