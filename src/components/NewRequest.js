"use client"

import { useState, useEffect } from "react"
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
import { apiGet } from "../lib/api"
import { BASE_URL, getAuthToken } from "../lib/config"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

function NewRequest() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [catLoading, setCatLoading] = useState(false)
  const [catError, setCatError] = useState("")
  const [description, setDescription] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true)
      setCatError("")
      try {
        const response = await apiGet("/Category/active_list")
        setCategories(response)
      } catch (err) {
        setCatError("Kategoriler yüklenemedi")
      } finally {
        setCatLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        message.success("Dosya yüklendi!");
        return data.fileUrl;
      } else {
        message.error(data.error || "Yükleme başarısız!");
      }
    } catch (err) {
      message.error("Yükleme sırasında hata oluştu!");
    }
    return null;
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: () => {
      return false // Prevent auto upload
    },
    onChange(info) {
      console.log("File list:", info.fileList)
      setUploadedFiles(info.fileList)
    },
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('subject', values.subject);
      formData.append('category_id', values.category);
      formData.append('priority', values.priority);
      formData.append('description', description);
      
      // Dosyaları ekle
      uploadedFiles.forEach((file, index) => {
        if (file.originFileObj) {
          formData.append('attachments', file.originFileObj);
        }
      });

      const response = await fetch(`${BASE_URL}/Ticket/create`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success("Destek talebi başarıyla oluşturuldu!");
        navigate("/requests");
      } else {
        message.error(data.error || "Talep oluşturulurken hata oluştu");
      }
    } catch (error) {
      message.error("Talep oluşturulurken hata oluştu");
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
              <Select
                placeholder={catLoading ? "Kategoriler yükleniyor..." : "Select a category"}
                size="middle"
                style={{ borderRadius: "5px", fontSize: 13 }}
                loading={catLoading}
                disabled={catLoading || !!catError}
                notFoundContent={catError || "Kategori bulunamadı"}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item 
              label={
                <Space>
                  <span style={{ color: "#ff4d4f" }}>*</span>
                  <span style={{ fontSize: 13, color: "#222" }}>Priority</span>
                  <InfoCircleOutlined style={{ color: "#bfbfbf", fontSize: "13px" }} />
                </Space>
              }
              name="priority"
              rules={[{ required: true, message: "Please select priority" }]}
              style={{ marginBottom: 12 }}
            >
              <Select
                placeholder="Select priority"
                size="middle"
                style={{ borderRadius: "5px", fontSize: 13 }}
              >
                <Option value="LOW">LOW</Option>
                <Option value="MEDIUM">MEDIUM</Option>
                <Option value="HIGH">HIGH</Option>
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
              // ReactQuill ile Form entegrasyonu için valuePropName ve trigger ekleniyor
              valuePropName="value"
              getValueFromEvent={val => val}
              trigger="onChange"
            >
              <ReactQuill
                value={description}
                onChange={setDescription}
                theme="snow"
                style={{ minHeight: 120, borderRadius: 5, background: "#fff" }}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link', 'image', 'code-block'],
                    ['clean']
                  ]
                }}
              />
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
