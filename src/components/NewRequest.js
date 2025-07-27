"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Form, Input, Select, Button, Upload, message, Typography, Space } from "antd"
import { 
  ArrowLeftOutlined, 
  UploadOutlined, 
  InfoCircleOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MessageOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  SmileOutlined,
  ClearOutlined,
  UndoOutlined,
  RedoOutlined
} from "@ant-design/icons"

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

function NewRequest() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const categories = [
    { value: "category1", label: "Category 1" },
    { value: "category2", label: "Category 2" },
    { value: "category3", label: "Category 3" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing" },
    { value: "general", label: "General Inquiry" },
  ]

  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: () => {
      return false // Prevent auto upload
    },
    onChange(info) {
      console.log("File list:", info.fileList)
    },
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      message.success("Request submitted successfully!")
      navigate("/requests")
    } catch (error) {
      message.error("Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ width: 400, maxWidth: "98vw", margin: "24px 0" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/requests")} style={{ marginBottom: 12, fontSize: 14, height: 32, padding: "0 12px" }}>
          Back
        </Button>

        <Card style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: "10px", padding: 0 }}>
          <Title level={4} style={{ marginBottom: 6, color: "#222", fontSize: 20 }}>
            Send a request
          </Title>
          <Text type="secondary" style={{ marginBottom: 18, display: "block", fontSize: "13px", color: "#666" }}>
            Please fill in the form below to send your request to our support team.
          </Text>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} style={{ marginTop: 0 }}>
            <Form.Item
              label={<span style={{ fontSize: 13, color: "#222" }}>What is your request?</span>}
              name="category"
              rules={[{ required: true, message: "Please select a category" }]}
              style={{ marginBottom: 12 }}
            >
              <Select placeholder="Select a category" size="middle" style={{ borderRadius: "5px", fontSize: 13 }}>
                {categories.map((category) => (
                  <Option key={category.value} value={category.value}>
                    {category.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              label={
                <Space>
                  <span style={{ color: "#ff4d4f" }}>*</span>
                  <span style={{ fontSize: 13, color: "#222" }}>Subject</span>
                  <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: "13px" }} />
                </Space>
              }
              name="subject" 
              rules={[{ required: true, message: "Please enter a subject" }]}
              style={{ marginBottom: 12 }}
            >
              <Input placeholder="Enter the subject of your request" size="middle" style={{ borderRadius: "5px", fontSize: 13, height: 32 }} />
            </Form.Item>

            <Form.Item 
              label={
                <Space>
                  <span style={{ fontSize: 13, color: "#222" }}>Attachments</span>
                  <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: "13px" }} />
                </Space>
              }
              name="attachments"
              style={{ marginBottom: 12 }}
            >
              <Upload {...uploadProps}>
                <Button
                  icon={<UploadOutlined />}
                  size="middle"
                  style={{ 
                    width: "100%", 
                    height: "38px", 
                    border: "1.5px dashed #d9d9d9",
                    borderRadius: "5px",
                    backgroundColor: "#fafafa",
                    fontSize: 13
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#666" }}>Click to upload</div>
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label={
                <Space>
                  <span style={{ color: "#ff4d4f" }}>*</span>
                  <span style={{ fontSize: 13, color: "#222" }}>Description</span>
                  <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: "13px" }} />
                </Space>
              }
              name="description"
              rules={[{ required: true, message: "Please enter a description" }]}
              style={{ marginBottom: 18 }}
            >
              <div>
                {/* Rich Text Editor Toolbar */}
                <div style={{ 
                  border: "1px solid #d9d9d9", 
                  borderBottom: "none", 
                  padding: "4px 8px", 
                  backgroundColor: "#fafafa",
                  borderRadius: "5px 5px 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexWrap: "wrap"
                }}>
                  <Button type="text" size="small" icon={<UndoOutlined />} />
                  <Button type="text" size="small" icon={<RedoOutlined />} />
                  <Select defaultValue="normal" size="small" style={{ width: 80, fontSize: 12 }}>
                    <Option value="normal">Normal</Option>
                    <Option value="h1">Heading 1</Option>
                    <Option value="h2">Heading 2</Option>
                  </Select>
                  <Button type="text" size="small" icon={<BoldOutlined />} />
                  <Button type="text" size="small" icon={<ItalicOutlined />} />
                  <Button type="text" size="small" icon={<UnderlineOutlined />} />
                  <Button type="text" size="small" icon={<StrikethroughOutlined />} />
                  <Button type="text" size="small" icon={<UnorderedListOutlined />} />
                  <Button type="text" size="small" icon={<OrderedListOutlined />} />
                  <Button type="text" size="small" icon={<AlignLeftOutlined />} />
                  <Button type="text" size="small" icon={<AlignCenterOutlined />} />
                  <Button type="text" size="small" icon={<AlignRightOutlined />} />
                  <Button type="text" size="small" icon={<MessageOutlined />} />
                  <Button type="text" size="small" icon={<LinkOutlined />} />
                  <Button type="text" size="small" icon={<PictureOutlined />} />
                  <Button type="text" size="small" icon={<CodeOutlined />} />
                  <Button type="text" size="small" icon={<SmileOutlined />} />
                  <Button type="text" size="small" icon={<ClearOutlined />} />
                </div>
                
                <TextArea 
                  placeholder="Please describe your request in detail..." 
                  rows={5} 
                  size="middle"
                  style={{ 
                    borderRadius: "0 0 5px 5px",
                    borderTop: "none",
                    fontSize: 13,
                    minHeight: 80
                  }}
                />
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="middle" 
                  loading={loading} 
                  style={{ 
                    minWidth: "120px",
                    backgroundColor: "#722ed1",
                    borderColor: "#722ed1",
                    borderRadius: "5px",
                    height: "36px",
                    fontSize: "15px",
                    fontWeight: "500"
                  }}
                >
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default NewRequest
