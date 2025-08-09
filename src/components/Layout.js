"use client"

import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button, App } from "antd"
import {
  HomeOutlined,
  SettingOutlined,
  PlusOutlined,
  BellOutlined,
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import { removeAuthToken, removeCurrentUser, getCurrentUser } from "../lib/config"

const { Header, Sider, Content } = AntLayout

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = getCurrentUser()
  const { message } = App.useApp()

  const handleLogout = () => {
    removeAuthToken()
    removeCurrentUser()
    message.success("Başarıyla çıkış yapıldı!")
    navigate("/login")
  }

  const menuItems = [
    {
      key: "/requests",
      icon: <HomeOutlined style={{ fontSize: "20px" }} />,
      label: "Requests",
    },
    {
      key: "/profile",
      icon: <SettingOutlined style={{ fontSize: "20px" }} />,
      label: "Profile",
    },
  ]

  const userMenuItems = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "8px 12px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ fontWeight: "600", fontSize: "14px", color: "#333" }}>
            {currentUser?.name} {currentUser?.surname}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
            {currentUser?.email}
          </div>
        </div>
      ),
      disabled: true,
    },
   
    {
      key: "profile",
      icon: <EditOutlined />,
      label: "Edit Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Log Out",
      onClick: handleLogout,
    },
  ]

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "rgba(255,255,255,0.7)", // %70 beyaz, hafif gri
          padding: "0 24px 0 0", // sol padding yok, sağ padding var
          borderBottom: "1px solid #e9ecef",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          marginLeft: 80, // sol menü genişliği kadar boşluk bırak
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
        }}
      >
        {/* Sol taraf - New Ticket butonu */}
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => navigate("/new-request")}
            style={{
              background: "transparent",
              color: "#22",
              fontWeight: 600,
              fontSize: "16px",
              border: "none",
              borderRadius: 0,
              height: "100%",
              padding: "0 24px 0 24px",
              boxShadow: "none",
              cursor: "pointer"
            }}
          >
            New Ticket
          </Button>
        </div>

        {/* Sağ taraf - Bildirim ve profil */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Badge count={0}>
            <BellOutlined style={{ fontSize: "18px", color: "#6c757d" }} />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                padding: "8px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(114, 46, 209, 0.05)",
                border: "1px solid rgba(114, 46, 209, 0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(114, 46, 209, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(114, 46, 209, 0.05)"
              }}
            >
              {/* Kullanıcı Bilgileri */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: "120px" }}>
                <div style={{ 
                  fontWeight: "600", 
                  fontSize: "14px", 
                  color: "#333",
                  lineHeight: "1.2",
                  textAlign: "right"
                }}>
                  {currentUser?.name} {currentUser?.surname}
                </div>
                <div style={{ 
                  fontSize: "12px", 
                  color: "#666",
                  lineHeight: "1.2",
                  textAlign: "right"
                }}>
                  {currentUser?.email}
                </div>
              </div>
              
              {/* Avatar */}
              <Avatar style={{ backgroundColor: "#722ed1" }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </Header>

      <AntLayout style={{ marginTop: 64 }}>
        <Sider
          width={80}
          style={{
            background: "#722ed1",
            position: "fixed",
            height: "100vh",
            left: 0,
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ padding: "16px 0", height: "100%", display: "flex", flexDirection: "column" }}>
            {/* Logo */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              height: "64px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "60px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(45deg,rgb(255, 93, 34),rgb(246, 183, 112))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "1.2"
              }}>
                Yolcu<br />360
              </div>
            </div>

            {/* Menü Öğeleri */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "60px",
                    margin: "0 8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: location.pathname === item.key ? "rgba(255,255,255,0.2)" : "transparent",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = location.pathname === item.key ? "rgba(255,255,255,0.2)" : "transparent"
                  }}
                >
                  <div style={{ color: "white", marginBottom: "4px" }}>
                    {item.icon}
                  </div>
                  <div style={{ 
                    color: "white", 
                    fontSize: "10px", 
                    textAlign: "center",
                    lineHeight: "1.2"
                  }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Sider>

        <Content
          style={{
            marginLeft: 80,
            padding: "24px",
            background: "#f8f9fa",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout
