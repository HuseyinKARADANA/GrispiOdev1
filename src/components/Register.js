import { useState } from "react"
import { Form, Input, Button, Card, Typography, Divider, App } from "antd"
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons"
import { useNavigate, Link } from "react-router-dom"
import { apiPost } from "../lib/api"
import { API_ENDPOINTS } from "../lib/config"

const { Title, Text } = Typography

function Register() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { message } = App.useApp()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const response = await apiPost(API_ENDPOINTS.REGISTER, {
        name: values.name,
        surname: values.surname,
        preliminary_phone: values.phone,
        preliminary_email: values.email,
        password: values.password,
        role: "employee"
      })

      message.success("Kayıt başarılı! Giriş yapabilirsiniz.")
      navigate("/login")
    } catch (error) {
      message.error(error.message || "Kayıt olurken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
        bodyStyle={{ padding: "40px" }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 16px rgba(114, 46, 209, 0.3)",
            }}
          >
            <UserOutlined
              style={{ fontSize: "32px", color: "white" }}
            />
          </div>
          <Title level={2} style={{ margin: 0, color: "#722ed1" }}>
            Hesap Oluşturun
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Yeni hesabınızı oluşturun
          </Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Ad gerekli!" },
              { min: 2, message: "Ad en az 2 karakter olmalı!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Ad"
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item
            name="surname"
            rules={[
              { required: true, message: "Soyad gerekli!" },
              { min: 2, message: "Soyad en az 2 karakter olmalı!" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Soyad"
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "E-posta adresi gerekli!" },
              { type: "email", message: "Geçerli bir e-posta adresi girin!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="E-posta adresi"
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Telefon numarası gerekli!" },
              { 
                pattern: /^[\+\d\s\-\(\)]+$/, 
                message: "Sadece sayı, +, -, boşluk ve parantez kullanabilirsiniz!" 
              },
              { 
                min: 10, 
                message: "Telefon numarası en az 10 karakter olmalı!" 
              },
              { 
                max: 20, 
                message: "Telefon numarası en fazla 20 karakter olabilir!" 
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Telefon numarası (örn: +90 555 123 4567)"
              maxLength={20}
              onKeyPress={(e) => {
                // Sadece sayı, +, -, boşluk, parantez ve backspace'e izin ver
                const allowedChars = /[\d\+\-\s\(\)]/;
                const key = e.key;
                
                if (key === 'Backspace' || key === 'Delete' || key === 'Tab') {
                  return;
                }
                
                if (!allowedChars.test(key)) {
                  e.preventDefault();
                }
              }}
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Şifre gerekli!" },
              { min: 6, message: "Şifre en az 6 karakter olmalı!" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermeli!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Şifre"
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Şifre tekrarı gerekli!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error("Şifreler eşleşmiyor!"))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Şifre tekrarı"
              style={{
                borderRadius: "8px",
                height: "48px",
                border: "1px solid #d9d9d9",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                border: "none",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 4px 16px rgba(114, 46, 209, 0.3)",
              }}
            >
              Kayıt Ol
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "24px 0" }}>
          <Text type="secondary">veya</Text>
        </Divider>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Zaten hesabınız var mı? </Text>
          <Link
            to="/login"
            style={{
              color: "#722ed1",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Giriş yapın
          </Link>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f6f8ff",
            borderRadius: "8px",
            border: "1px solid #e6f0ff",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            <strong>Güvenlik Notu:</strong>
            <br />
            • Şifreniz en az 6 karakter olmalı
            <br />
            • Büyük harf, küçük harf ve rakam içermeli
            <br />
            • Kişisel bilgileriniz AES ile şifrelenerek saklanacak
            <br />
            • Tüm kullanıcılar "Employee" rolünde kayıt olacak
          </Text>
        </div>
      </Card>

      <style jsx>{`
        .ant-input:focus,
        .ant-input-focused {
          border-color: #722ed1 !important;
          box-shadow: 0 0 0 2px rgba(114, 46, 209, 0.2) !important;
        }

        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #531dab 0%, #722ed1 100%) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(114, 46, 209, 0.4) !important;
        }

        .ant-card {
          transition: transform 0.2s ease;
        }

        .ant-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}

export default Register 