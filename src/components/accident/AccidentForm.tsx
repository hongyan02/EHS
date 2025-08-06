import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Switch, Button, Row, Col, Card } from 'antd';
import { AccidentFormProps } from '@/types/accident';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const AccidentForm: React.FC<AccidentFormProps> = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [accidentOrEvent, setAccidentOrEvent] = React.useState<string>('事故');

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      // 处理日期字段和布尔值转换
      const formData = {
        ...initialData,
        happen_date: initialData.happen_date ? dayjs(initialData.happen_date) : undefined,
        oa_submit_date: initialData.oa_submit_date ? dayjs(initialData.oa_submit_date) : undefined,
        // 将布尔值转换为字符串
        is_traffic_accident: initialData.is_traffic_accident ? '1' : '0',
        is_fire_event: initialData.is_fire_event ? '1' : '0',
        is_smoke_fire_attempt: initialData.is_smoke_fire_attempt ? '1' : '0',
        is_responsible_accident: initialData.is_responsible_accident ? '1' : '0',
        punishment_completed: initialData.punishment_completed ? '1' : '0',
        is_reported: initialData.is_reported ? '1' : '0',
        need_update_hazard_list: initialData.need_update_hazard_list ? '1' : '0',
        need_update_safety_procedures: initialData.need_update_safety_procedures ? '1' : '0',
      };
      form.setFieldsValue(formData);
      // 设置事故或事件的初始值
      if (initialData.accident_or_event) {
        setAccidentOrEvent(initialData.accident_or_event);
      }
    } else {
      form.resetFields();
      setAccidentOrEvent('事故'); // 重置为默认值
    }
  }, [mode, initialData, form]);

  const handleSubmit = (values: any) => {
    // 处理日期格式，保持字符串值传递给API，确保所有39个字段都传递
    const submitData = {
      // 基本字段 (1-12)
      happen_date: values.happen_date ? values.happen_date.format('YYYY/MM/DD') : '',
      month: values.happen_date ? values.happen_date.format('MM') : '',
      oa_number: values.oa_number || '',
      oa_submit_date: values.oa_submit_date ? values.oa_submit_date.format('YYYY-MM-DD') : '',
      product_line: values.product_line || '',
      detail_place: values.detail_place || '',
      self_ignite_cell_type: values.self_ignite_cell_type || '',
      self_ignite_cell_number: values.self_ignite_cell_number ? String(values.self_ignite_cell_number) : '',
      battery_self_ignite_reason: values.battery_self_ignite_reason || '',
      detail_content: values.detail_content || '',
      accident_or_event: "123",
      // 事故相关字段 (1""3-18)
      accident_cause: "sdshdsd",
      accident_type: values.accident_type || '',
      economic_loss: values.economic_loss || '',
      work_hours_loss: values.work_hours_loss || '',
      accident_level: values.accident_level || '',
      internal_or_related: values.internal_or_related || '',
      // Switch字段 (19-21)
      is_traffic_accident: values.is_traffic_accident || '0',
      is_fire_event: values.is_fire_event || '0',
      is_smoke_fire_attempt: values.is_smoke_fire_attempt || '0',
      // 事件相关字段 (22-24)
      event_cause: values.event_cause || '',
      event_type: values.event_type || '',
      event_economic_loss: values.event_economic_loss || '',
      // 分类和原因分析字段 (25-31)
      attempt_classification: values.attempt_classification || '',
      direct_cause_type: values.direct_cause_type || '',
      detail_content1: values.detail_content1 || '',
      indirect_cause_type: values.indirect_cause_type || '',
      detail_content2: values.detail_content2 || '',
      system_cause_type: values.system_cause_type || '',
      detail_content3: values.detail_content3 || '',
      // 纠正措施和状态字段 (32-33)
      corrective_measures: values.corrective_measures || '',
      completion_status: values.completion_status || '',
      // 责任和处罚相关字段 (34-37)
      is_responsible_accident: values.is_responsible_accident || '0',
      punishment_completed: values.punishment_completed || '0',
      punishment_info: values.punishment_info || '',
      is_reported: values.is_reported || '0',
      // 更新需求字段 (38-39)
      need_update_hazard_list: values.need_update_hazard_list || '0',
      need_update_safety_procedures: values.need_update_safety_procedures || '0',
    };
    onSubmit(submitData);
  };

  return (
    <Card title={mode === 'create' ? '新增事故记录' : '编辑事故记录'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          // 基本字段默认值 (1-12)
          id: '',
          oa_number: '',
          product_line: '',
          detail_place: '',
          self_ignite_cell_type: '',
          self_ignite_cell_number: '',
          accident_or_event: '事故',
          internal_or_related: '',
          battery_self_ignite_reason: '',
          detail_content: '',
          // 事故相关字段默认值 (13-18)
          accident_cause: '',
          accident_type: '',
          accident_level: '',
          economic_loss: '',
          work_hours_loss: '',
          // Switch字段默认值 (19-21)
          is_traffic_accident: '0',
          is_fire_event: '0',
          is_smoke_fire_attempt: '0',
          // 事件相关字段默认值 (22-24)
          event_cause: '',
          event_type: '',
          event_economic_loss: '',
          // 分类和原因分析字段默认值 (25-31)
          attempt_classification: '',
          direct_cause_type: '',
          detail_content1: '',
          indirect_cause_type: '',
          detail_content2: '',
          system_cause_type: '',
          detail_content3: '',
          // 纠正措施和状态字段默认值 (32-33)
          corrective_measures: '',
          completion_status: '',
          // 责任和处罚相关字段默认值 (34-37)
          is_responsible_accident: '0',
          punishment_completed: '0',
          punishment_info: '',
          is_reported: '0',
          // 更新需求字段默认值 (38-39)
          need_update_hazard_list: '0',
          need_update_safety_procedures: '0',
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="发生日期"
              name="happen_date"
              rules={[{ required: true, message: '请选择发生日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="OA编号"
              name="oa_number"
              rules={[{ required: true, message: '请输入OA编号' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="OA提交日期"
              name="oa_submit_date"
              rules={[{ required: true, message: '请选择OA提交日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="产线"
              name="product_line"
              rules={[{ required: true, message: '请输入产线' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="详细地点"
              name="detail_place"
              rules={[{ required: true, message: '请输入详细地点' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="自燃电芯类型"
              name="self_ignite_cell_type"
              rules={[{ required: true, message: '请输入自燃电芯类型' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="自燃电芯数量"
              name="self_ignite_cell_number"
              rules={[{ required: true, message: '请输入自燃电芯数量' }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="事故或事件"
              name="accident_or_event"
              rules={[{ required: true, message: '请选择事故或事件' }]}
            >
              <Select onChange={(value) => setAccidentOrEvent(value)}>
                <Option value="事故">事故</Option>
                <Option value="事件">事件</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="内部或关联"
              name="internal_or_related"
            >
              <Select>
                <Option value="内部">内部</Option>
                <Option value="关联">关联</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="电池自燃原因"
              name="battery_self_ignite_reason"
              rules={[{ required: true, message: '请输入电池自燃原因' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="详细内容"
              name="detail_content"
              rules={[{ required: true, message: '请输入详细内容' }]}
            >
              <TextArea rows={3} />
            </Form.Item>
          </Col>
        </Row>

        {/* 根据选择的事故或事件显示不同字段 */}
        {accidentOrEvent === '事故' ? (
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                label="事故原因"
                name="accident_cause"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="事故类型"
                name="accident_type"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="事故等级"
                name="accident_level"
              >
                <Select>
                  <Option value="轻微">轻微</Option>
                  <Option value="一般">一般</Option>
                  <Option value="较大">较大</Option>
                  <Option value="重大">重大</Option>
                  <Option value="特别重大">特别重大</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="经济损失"
                name="economic_loss"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="工时损失"
                name="work_hours_loss"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        ) : (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="事件原因"
                name="event_cause"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="事件类型"
                name="event_type"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="事件经济损失"
                name="event_economic_loss"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="交通事故"
              name="is_traffic_accident"
            >
              <Switch 
                checked={form.getFieldValue('is_traffic_accident') === '1'}
                onChange={(checked) => form.setFieldValue('is_traffic_accident', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="火灾事件"
              name="is_fire_event"
            >
              <Switch 
                checked={form.getFieldValue('is_fire_event') === '1'}
                onChange={(checked) => form.setFieldValue('is_fire_event', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="冒烟起火未遂"
              name="is_smoke_fire_attempt"
            >
              <Switch 
                checked={form.getFieldValue('is_smoke_fire_attempt') === '1'}
                onChange={(checked) => form.setFieldValue('is_smoke_fire_attempt', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="未遂分类"
              name="attempt_classification"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="直接原因类型"
              name="direct_cause_type"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="间接原因类型"
              name="indirect_cause_type"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="系统原因类型"
              name="system_cause_type"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="直接原因详细内容"
              name="detail_content1"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="间接原因详细内容"
              name="detail_content2"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="系统原因详细内容"
              name="detail_content3"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="纠正措施"
          name="corrective_measures"
        >
          <TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="完成状态"
              name="completion_status"
            >
              <Select>
                <Option value="未开始">未开始</Option>
                <Option value="进行中">进行中</Option>
                <Option value="已完成">已完成</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="责任事故"
              name="is_responsible_accident"
            >
              <Switch 
                checked={form.getFieldValue('is_responsible_accident') === '1'}
                onChange={(checked) => form.setFieldValue('is_responsible_accident', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="处罚完成"
              name="punishment_completed"
            >
              <Switch 
                checked={form.getFieldValue('punishment_completed') === '1'}
                onChange={(checked) => form.setFieldValue('punishment_completed', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="已上报"
              name="is_reported"
            >
              <Switch 
                checked={form.getFieldValue('is_reported') === '1'}
                onChange={(checked) => form.setFieldValue('is_reported', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="处罚信息"
              name="punishment_info"
            >
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="需要更新危险源清单"
              name="need_update_hazard_list"
            >
              <Switch 
                checked={form.getFieldValue('need_update_hazard_list') === '1'}
                onChange={(checked) => form.setFieldValue('need_update_hazard_list', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="需要更新安全程序"
              name="need_update_safety_procedures"
            >
              <Switch 
                checked={form.getFieldValue('need_update_safety_procedures') === '1'}
                onChange={(checked) => form.setFieldValue('need_update_safety_procedures', checked ? '1' : '0')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Row justify="end" gutter={16}>
            <Col>
              <Button onClick={onCancel}>
                取消
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === 'create' ? '创建' : '更新'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AccidentForm;