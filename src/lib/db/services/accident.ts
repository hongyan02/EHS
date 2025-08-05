import { db } from "../db";
import { accident } from "../schema";
import { eq, or, like } from "drizzle-orm";

export const getAccidents = async () => {
    const accidents = await db.select().from(accident);
    return accidents;
};

//关键词查找 - 全字段模糊查询
export const getAccidentByKey = async (keyword: string) => {
    const accidents = await db
        .select()
        .from(accident)
        .where(
            or(
                like(accident.happen_date, `%${keyword}%`),
                like(accident.month, `%${keyword}%`),
                like(accident.oa_number, `%${keyword}%`),
                like(accident.oa_submit_date, `%${keyword}%`),
                like(accident.product_line, `%${keyword}%`),
                like(accident.detail_place, `%${keyword}%`),
                like(accident.self_ignite_cell_type, `%${keyword}%`),
                like(accident.battery_self_ignite_reason, `%${keyword}%`),
                like(accident.detail_content, `%${keyword}%`),
                like(accident.accident_or_event, `%${keyword}%`),
                like(accident.accident_cause, `%${keyword}%`),
                like(accident.accident_type, `%${keyword}%`),
                like(accident.economic_loss, `%${keyword}%`),
                like(accident.work_hours_loss, `%${keyword}%`),
                like(accident.accident_level, `%${keyword}%`),
                like(accident.internal_or_related, `%${keyword}%`),
                like(accident.event_cause, `%${keyword}%`),
                like(accident.event_type, `%${keyword}%`),
                like(accident.event_economic_loss, `%${keyword}%`),
                like(accident.attempt_classification, `%${keyword}%`),
                like(accident.direct_cause_type, `%${keyword}%`),
                like(accident.detail_content1, `%${keyword}%`),
                like(accident.indirect_cause_type, `%${keyword}%`),
                like(accident.detail_content2, `%${keyword}%`),
                like(accident.system_cause_type, `%${keyword}%`),
                like(accident.detail_content3, `%${keyword}%`),
                like(accident.corrective_measures, `%${keyword}%`),
                like(accident.completion_status, `%${keyword}%`),
                like(accident.punishment_info, `%${keyword}%`)
            )
        );
    return accidents;
};
