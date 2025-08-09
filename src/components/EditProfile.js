"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, Row, Col, Typography, Space } from "antd"
import { EditOutlined } from "@ant-design/icons"
import { apiGet } from "../lib/api"

const { Title, Text } = Typography

function EditProfile() {
  const [form] = Form.useForm();
  // mevcut user verisini al
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [userRole, setUserRole] = useState("");

  // Orijinal veriler (örnek)
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Hüseyin",
    lastName: "Karadana",
    phone: "598 765 43 21",
    email: "customer@grispi.com.tr",
    website: ""
  })
  const [personalInfoDraft, setPersonalInfoDraft] = useState(personalInfo)

  const [address, setAddress] = useState({
    country: "Turkey",
    city: "İzmir",
    addressLine: "",
    postalCode: ""
  })
  const [addressDraft, setAddressDraft] = useState(address)

  const [passwordDraft, setPasswordDraft] = useState({ current: "" })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiGet("/User/profile");
        setPersonalInfo({
          firstName: data.name,
          lastName: data.surname,
          phone: data.preliminary_phone,
          email: data.preliminary_email,
          website: data.website || ""
        });
        setPersonalInfoDraft({
          firstName: data.name,
          lastName: data.surname,
          phone: data.preliminary_phone,
          email: data.preliminary_email,
          website: data.website || ""
        });
        setAddress({
          country: data.address.country,
          city: data.address.city,
          addressLine: data.address.address_line,
          postalCode: data.address.postal_code
        });
        setAddressDraft({
          country: data.address.country,
          city: data.address.city,
          addressLine: data.address.address_line,
          postalCode: data.address.postal_code
        });
        setUserRole(data.role);
        form.setFieldsValue({
          firstName: data.name,
          lastName: data.surname,
          primaryPhone: data.preliminary_phone,
          primaryEmail: data.preliminary_email,
          website: data.website || "",
          country: data.address.country,
          city: data.address.city,
          addressLine: data.address.address_line,
          postalCode: data.address.postal_code,
          currentPassword: ""
        });
      } catch (err) {
        // Hata yönetimi
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // Kişisel Bilgi Edit
  const handleEditPersonal = () => {
    setIsEditingPersonal(true)
    setPersonalInfoDraft(personalInfo)
  }
  const handleUndoPersonal = () => {
    setIsEditingPersonal(false)
    setPersonalInfoDraft(personalInfo)
  }
  const handleSavePersonal = async () => {
    // API entegrasyonu burada olacak
    setPersonalInfo(personalInfoDraft)
    setIsEditingPersonal(false)
  }

  // Adres Edit
  const handleEditAddress = () => {
    setIsEditingAddress(true)
    setAddressDraft(address)
  }
  const handleUndoAddress = () => {
    setIsEditingAddress(false)
    setAddressDraft(address)
  }
  const handleSaveAddress = async () => {
    // API entegrasyonu burada olacak
    setAddress(addressDraft)
    setIsEditingAddress(false)
  }

  // Şifre Edit
  const handleEditPassword = () => {
    setIsEditingPassword(true)
    setPasswordDraft({ current: "" })
  }
  const handleUndoPassword = () => {
    setIsEditingPassword(false)
    setPasswordDraft({ current: "" })
  }
  const handleSavePassword = async () => {
    // API entegrasyonu burada olacak
    setIsEditingPassword(false)
  }

  const handleUndoAll = () => {
    // Tüm edit modlarını kapat ve draftları orijinal değerlere döndür
    setIsEditingPersonal(false);
    setIsEditingAddress(false);
    setIsEditingPassword(false);

    setPersonalInfoDraft(personalInfo);
    setAddressDraft(address);
    setPasswordDraft({ current: "" });

    // Form alanlarını da sıfırla
    form.resetFields();
  };

  const handleSaveAll = () => {
    // Tüm draftları kaydet ve edit modlarını kapat
    setPersonalInfo(personalInfoDraft);
    setAddress(addressDraft);
    // Şifre için ayrıca API'ye gönderim yapılabilir
    setIsEditingPersonal(false);
    setIsEditingAddress(false);
    setIsEditingPassword(false);
  };

  const initialValues = {
    firstName: "Hüseyin",
    lastName: "Karadana",
    primaryPhone: "598 765 43 21",
    primaryEmail: "customer@grispi.com.tr",
    website: "",
    country: "Turkey",
    city: "İzmir",
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
              <div style={{ fontSize: 22, fontWeight: 600, color: "#222" }}>{personalInfo.firstName} {personalInfo.lastName}</div>
              <div style={{ fontSize: 14, color: "#888", marginTop: 2 }}>
                Role <span style={{ color: "#222", fontWeight: 500, marginLeft: 6 }}>{userRole}</span>
              </div>
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
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <EditOutlined
                    style={{
                      fontSize: 20,
                      color: isEditingPersonal ? "#722ed1" : "#bfbfbf",
                      cursor: "pointer",
                      transition: "color 0.2s"
                    }}
                    onClick={handleEditPersonal}
                  />
                </div>
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName" style={{ marginBottom: 8 }}>
                    <Input
                      value={isEditingPersonal ? personalInfoDraft.firstName : personalInfo.firstName}
                      onChange={e => setPersonalInfoDraft({ ...personalInfoDraft, firstName: e.target.value })}
                      disabled={!isEditingPersonal}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                  <Form.Item label="Preliminary Phone" name="primaryPhone" style={{ marginBottom: 8 }}>
                    <Input disabled={!isEditingPersonal} addonBefore={<span style={{ display: "flex", alignItems: "center" }}><img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Flag_of_Turkey.svg" alt="tr" style={{ width: 18, marginRight: 4, borderRadius: 2 }} /> <span style={{ marginLeft: 4, fontSize: 12, color: "#222" }}>+90</span></span>} size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Website (Optional)" name="website" style={{ marginBottom: 8 }}>
                    <Input disabled={!isEditingPersonal} size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  {isEditingPersonal && (
                    <>
                      <div style={{ color: "#722ed1", fontSize: 13, marginTop: 2, cursor: "pointer" }}>+ Add more</div>
                      <div style={{ color: "#722ed1", fontSize: 13, marginTop: 2, cursor: "pointer" }}>+ Add Phone</div>
                     
                    </>
                  )}
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName" style={{ marginBottom: 8 }}>
                    <Input disabled={!isEditingPersonal} size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  <Form.Item label="Preliminary Email" name="primaryEmail" style={{ marginBottom: 8 }}>
                    <Input disabled={!isEditingPersonal} size="middle" style={{ borderRadius: 6, height: 32 }} />
                  </Form.Item>
                  {isEditingPersonal && (
                    <div style={{ color: "#722ed1", fontSize: 13, marginTop: 2, cursor: "pointer" }}>+ Add Email</div>
                  )}
                </Col>
              </Row>
            </Card>

            {/* Address */}
            <Card style={{ borderRadius: 8, border: "1.5px solid #eee", marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Address</Title>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <EditOutlined
                    style={{
                      fontSize: 20,
                      color: isEditingAddress ? "#722ed1" : "#bfbfbf",
                      cursor: "pointer",
                      transition: "color 0.2s"
                    }}
                    onClick={handleEditAddress}
                  />
                </div>
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Country" name="country" style={{ marginBottom: 8 }}>
                    <Input
                      value={isEditingAddress ? addressDraft.country : address.country}
                      onChange={e => setAddressDraft({ ...addressDraft, country: e.target.value })}
                      disabled={!isEditingAddress}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                  <Form.Item label="Address Line" name="addressLine" style={{ marginBottom: 8 }}>
                    <Input
                      value={isEditingAddress ? addressDraft.addressLine : address.addressLine}
                      onChange={e => setAddressDraft({ ...addressDraft, addressLine: e.target.value })}
                      disabled={!isEditingAddress}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="City" name="city" style={{ marginBottom: 8 }}>
                    <Input
                      value={isEditingAddress ? addressDraft.city : address.city}
                      onChange={e => setAddressDraft({ ...addressDraft, city: e.target.value })}
                      disabled={!isEditingAddress}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                  <Form.Item label="Postal Code" name="postalCode" style={{ marginBottom: 8 }}>
                    <Input
                      value={isEditingAddress ? addressDraft.postalCode : address.postalCode}
                      onChange={e => setAddressDraft({ ...addressDraft, postalCode: e.target.value })}
                      disabled={!isEditingAddress}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Password */}
            <Card style={{ borderRadius: 8, border: "1.5px solid #eee", marginBottom: 16 }} bodyStyle={{ padding: 16, paddingBottom: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>Password</Title>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <EditOutlined
                    style={{
                      fontSize: 20,
                      color: isEditingPassword ? "#722ed1" : "#bfbfbf",
                      cursor: "pointer",
                      transition: "color 0.2s"
                    }}
                    onClick={handleEditPassword}
                  />
                </div>
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="Current Password" name="currentPassword" style={{ marginBottom: 8 }}>
                    <Input.Password
                      value={passwordDraft.current}
                      onChange={e => setPasswordDraft({ ...passwordDraft, current: e.target.value })}
                      disabled={!isEditingPassword}
                      size="middle"
                      style={{ borderRadius: 6, height: 32 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Butonlar */}
            {(isEditingPersonal || isEditingAddress || isEditingPassword) && (
              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 32, marginBottom: 32 }}>
                <Button onClick={handleUndoAll} style={{ borderColor: "#722ed1", color: "#722ed1" }}>Undo Changes</Button>
                <Button type="primary" onClick={handleSaveAll} style={{ background: "#722ed1", borderColor: "#722ed1" }}>Save Changes</Button>
              </div>
            )}
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default EditProfile
