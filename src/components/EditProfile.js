"use client"

import { useState } from "react"
import { Card, Form, Input, Button, Row, Col, Typography, Space } from "antd"
import { EditOutlined } from "@ant-design/icons"

const { Title, Text } = Typography

function EditProfile() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const initialValues = {
    firstName: "",
    lastName: "",
    primaryPhone: "598 765 43 21",
    primaryEmail: "customer@grispi.com.tr",
    website: "",
    country: "",
    city: "",
    addressLine: "",
    postalCode: "",
    currentPassword: ""
  }

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{ width: 1000, maxWidth: "98vw", margin: "16px 0" }}>
        <Card style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 0, border: "1.5px solid #eee" }} bodyStyle={{ padding: 0 }}>
          {/* Üst Profil Alanı */}
          <div style={{ display: "flex", alignItems: "center", padding: "20px 24px 0 24px" }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#722ed1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 40,
                fontWeight: 700,
                marginRight: 20
              }}>
                G
                <EditOutlined style={{ position: "absolute", top: 4, right: 4, fontSize: 16, color: "#fff", background: "#722ed1", borderRadius: "50%", padding: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#222" }}>Customer Name</div>
              <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>Role <span style={{ color: "#222", fontWeight: 500, marginLeft: 6 }}>Admin</span></div>
            </div>
          </div>

          {/* Form Alanı */}
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            style={{ padding: "20px 24px 0 24px" }}
          >
            {/* Personal Information */}
            <Card style={{ borderRadius: 8, border: "1.5px solid #eee", marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Personal Information</Title>
                <EditOutlined style={{ color: "#bbb", fontSize: 16, cursor: "pointer" }} />
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Preliminary Phone" name="primaryPhone" style={{ marginBottom: 8 }}>
                    <Input addonBefore={<span style={{ display: "flex", alignItems: "center" }}><img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" alt="tr" style={{ width: 18, marginRight: 4, borderRadius: 2 }} /> <span style={{ marginLeft: 4, fontSize: 12, color: "#222" }}>+90</span></span>} size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Website (Optional)" name="website" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <div style={{ color: "#722ed1", fontSize: 13, marginTop: 2, cursor: "pointer" }}>+ Add more</div>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Preliminary Email" name="primaryEmail" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <div style={{ color: "#722ed1", fontSize: 13, marginTop: 24, cursor: "pointer" }}>+ Add Email</div>
                </Col>
              </Row>
              <div style={{ color: "#722ed1", fontSize: 13, marginTop: 2, cursor: "pointer" }}>+ Add Phone</div>
            </Card>

            {/* Address */}
            <Card style={{ borderRadius: 8, border: "1.5px solid #eee", marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Address</Title>
                <EditOutlined style={{ color: "#bbb", fontSize: 16, cursor: "pointer" }} />
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Country" name="country" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Address Line" name="addressLine" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="City" name="city" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Postal Code" name="postalCode" style={{ marginBottom: 8 }}>
                    <Input size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Password */}
            <Card style={{ borderRadius: 8, border: "1.5px solid #eee", marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Password</Title>
                <EditOutlined style={{ color: "#bbb", fontSize: 16, cursor: "pointer" }} />
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Current Password" name="currentPassword" style={{ marginBottom: 8 }}>
                    <Input.Password size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Butonlar */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, margin: "20px 0 16px 0" }}>
              <Button style={{ minWidth: 160, height: 36, background: "#fff", color: "#722ed1", border: "2px solid #722ed1", borderRadius: 6, fontWeight: 600, fontSize: 14 }}>Undo Changes</Button>
              <Button type="primary" style={{ minWidth: 160, height: 36, background: "#722ed1", border: "none", borderRadius: 6, fontWeight: 600, fontSize: 14 }}>Save Changes</Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default EditProfile
