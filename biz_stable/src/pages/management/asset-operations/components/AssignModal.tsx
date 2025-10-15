/**
 * 指派部门模态框组件
 * 用于将未纳管资产指派到指定部门
 */

import React, { useState } from 'react'
import { Modal, Form, Select, Input, message } from 'antd'
import type { Department, AssignFormData } from '../types'

const { TextArea } = Input

interface AssignModalProps {
  visible: boolean
  assetIds: string[]
  departments: Department[]
  onClose: () => void
  onSubmit: (data: AssignFormData) => void
}

const AssignModal: React.FC<AssignModalProps> = ({
  visible,
  assetIds,
  departments,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 模拟异步提交
      setTimeout(() => {
        onSubmit(values)
        message.success(`成功指派 ${assetIds.length} 个资产`)
        form.resetFields()
        setLoading(false)
        onClose()
      }, 500)
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  // 关闭模态框
  const handleClose = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="指派资产至部门"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleClose}
      confirmLoading={loading}
      width={600}
      destroyOnClose
      okText="确认指派"
      cancelText="取消"
    >
      <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        即将指派 <strong>{assetIds.length}</strong> 个资产
      </div>

      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="departmentId"
          label="目标部门"
          rules={[
            { required: true, message: '请选择目标部门' }
          ]}
        >
          <Select
            placeholder="选择部门"
            showSearch
            optionFilterProp="children"
            options={departments.map((dept) => ({
              value: dept.id,
              label: `${dept.name} (已纳管 ${dept.managedAssetCount} 个资产)`
            }))}
          />
        </Form.Item>

        <Form.Item
          name="responsiblePerson"
          label="责任人"
          rules={[
            { required: true, message: '请输入责任人姓名' },
            { max: 50, message: '责任人姓名不能超过50个字符' }
          ]}
        >
          <Input placeholder="请输入责任人姓名" />
        </Form.Item>

        <Form.Item
          name="contactInfo"
          label="联系方式"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
          ]}
        >
          <Input placeholder="请输入联系方式（选填）" />
        </Form.Item>

        <Form.Item
          name="remark"
          label="备注"
          rules={[
            { max: 200, message: '备注不能超过200个字符' }
          ]}
        >
          <TextArea
            placeholder="请输入备注信息（选填）"
            rows={4}
            showCount
            maxLength={200}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AssignModal
