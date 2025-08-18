// 药品库存相关的类型定义

/**
 * 药品库存项接口
 */
export interface MedicineItem {
  /** 唯一标识 */
  wuzibianma: string;
  /** 药品名称 */
  wuzimingcheng: string;
  /** 规格 */
  guigexinghao: string;
  /** 单位 */
  danwei: string;
  /** 库存数量 */
  chuku: number;
  /** 库存阈值 */
  fazhi: number;
  /** 过期日期 */
  expireDate: string;
}

/**
 * 药品表格组件Props接口
 */
export interface MedicineTableProps {
  /** 数据源 */
  dataSource?: MedicineItem[];
  /** 加载状态 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: {
    pageSize?: number;
    current?: number;
    total?: number;
    showQuickJumper?: boolean;
    showSizeChanger?: boolean;
  } | false;
}

/**
 * 药品库存状态枚举
 */
export enum MedicineStatus {
  /** 库存充足 */
  SUFFICIENT = 'sufficient',
  /** 库存不足 */
  INSUFFICIENT = 'insufficient',
  /** 库存告急 */
  CRITICAL = 'critical',
  /** 即将过期 */
  EXPIRING = 'expiring',
  /** 已过期 */
  EXPIRED = 'expired'
}

/**
 * 药品库存统计信息接口
 */
export interface MedicineSummary {
  /** 总药品数量 */
  totalItems: number;
  /** 库存不足的药品数量 */
  insufficientItems: number;
  /** 即将过期的药品数量 */
  expiringItems: number;
  /** 已过期的药品数量 */
  expiredItems: number;
  /** 库存告急的药品数量 */
  criticalItems: number;
}