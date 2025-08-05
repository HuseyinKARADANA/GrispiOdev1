import { useState } from "react"
import { Form, Input, Button, Card, Typography, Divider, App, Checkbox } from "antd"
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons"
import { useNavigate, Link } from "react-router-dom"
import { apiPost } from "../lib/api"
import { API_ENDPOINTS, setAuthToken } from "../lib/config"

const { Title, Text } = Typography

function Login() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { message } = App.useApp()

  const onFinish = async (values) => {
    try {
      setLoading(true)
      const response = await apiPost(API_ENDPOINTS.LOGIN, {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe || false
      })

      if (response.token) {
        // Token'ı sakla
        setAuthToken(response.token)
        
        // Kullanıcı bilgilerini de sakla
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
        
        message.success("Başarıyla giriş yapıldı!")
        
        // Requests sayfasına yönlendir
        navigate("/requests")
      } else {
        message.error("Token alınamadı!")
      }
    } catch (error) {
      message.error(error.message || "Giriş yapılırken hata oluştu")
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
          maxWidth: "400px",
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
            Hoş Geldiniz
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Hesabınıza giriş yapın
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
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
             name="password"
             rules={[
               { required: true, message: "Şifre gerekli!" },
               { min: 6, message: "Şifre en az 6 karakter olmalı!" },
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

           <Form.Item name="rememberMe" valuePropName="checked">
             <Checkbox style={{ color: "#666" }}>Beni hatırla</Checkbox>
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
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: "24px 0" }}>
          <Text type="secondary">veya</Text>
        </Divider>

        <div style={{ textAlign: "center" }}>
          <Text type="secondary">Hesabınız yok mu? </Text>
          <Link
            to="/register"
            style={{
              color: "#722ed1",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Kayıt olun
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
            <strong>Demo Hesap:</strong>
            <br />
            E-posta: test@example.com
            <br />
            Şifre: Test123
            <br />
            <br />
            <strong>Not:</strong> Backend'de kayıtlı bir hesap kullanın
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

export default Login 