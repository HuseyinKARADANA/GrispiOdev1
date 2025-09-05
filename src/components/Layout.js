"use client"

import { Layout as AntLayout, Menu, Avatar, Dropdown, Badge, Button, App, Drawer } from "antd"
import {
  HomeOutlined,
  SettingOutlined,
  PlusOutlined,
  BellOutlined,
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { removeAuthToken, removeCurrentUser, getCurrentUser } from "../lib/config"

const { Header, Sider, Content } = AntLayout

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = getCurrentUser()
  const { message } = App.useApp()
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const handleLogout = () => {
    removeAuthToken()
    removeCurrentUser()
    message.success("Başarıyla çıkış yapıldı!")
    navigate("/login")
  }

  // Mobil tespiti için useEffect
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update)
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update)
    }
  }, [])

  const menuItems = [
    {
      key: "/requests",
      icon: <HomeOutlined style={{ fontSize: "20px" }} />,
      label: "Requests",
    },
    // Teknisyen rolü için ek menü
    ...(currentUser?.role === "technician" || currentUser?.role === "admin" ? [
      {
        key: "/technician-tickets",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        label: "Açık Ticket'lar",
      }
    ] : []),
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

  // Mobil navigasyon bileşeni
  const MobileNavigation = () => (
    <div style={{ padding: "16px 0" }}>
      {/* Logo */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        marginBottom: "24px",
        padding: "0 16px"
      }}>
        <img 
          src="/grispiglobal_logo.jpg" 
          alt="Grispi Global Logo"
          style={{
            width: "40px",
            height: "30px",
            objectFit: "contain",
            borderRadius: "8px",
            marginRight: "12px"
          }}
        />
        <div style={{
          color: "#632d91",
          fontSize: "18px",
          fontWeight: "bold"
        }}>
          Grispi
        </div>
      </div>

      {/* Menü Öğeleri */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              navigate(item.key)
              setMobileDrawerVisible(false)
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              cursor: "pointer",
              backgroundColor: location.pathname === item.key ? "rgba(99, 45, 145, 0.1)" : "transparent",
              borderLeft: location.pathname === item.key ? "3px solid #632d91" : "3px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ 
              color: location.pathname === item.key ? "#632d91" : "#666", 
              marginRight: "12px",
              fontSize: "18px"
            }}>
              {item.icon}
            </div>
            <div style={{ 
              color: location.pathname === item.key ? "#632d91" : "#333", 
              fontSize: "16px",
              fontWeight: location.pathname === item.key ? "600" : "400"
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: isMobile ? "0 16px" : "0 16px 0 0",
          borderBottom: "1px solid #e9ecef",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          marginLeft: isMobile ? 0 : 80,
          boxSizing: "border-box",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Sol taraf - Mobil toggle ve New Ticket butonu */}
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileDrawerVisible(true)}
              style={{
                background: "transparent",
                color: "#632d91",
                fontSize: "18px",
                border: "none",
                borderRadius: "4px",
                height: "40px",
                width: "40px",
                marginRight: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            />
          )}
          <Button
            type="text"
            icon={<PlusOutlined />}
            onClick={() => navigate("/new-request")}
            style={{
              background: "transparent",
              color: "#632d91",
              fontWeight: 600,
              fontSize: isMobile ? "14px" : "16px",
              border: "none",
              borderRadius: 0,
              height: "100%",
              padding: isMobile ? "0 12px 0 0" : "0 16px 0 0",
              boxShadow: "none",
              cursor: "pointer"
            }}
          >
            {isMobile ? "New" : "New Ticket"}
          </Button>
        </div>

        {/* Sağ taraf - Bildirim ve profil */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "16px" }}>
          <Badge count={0}>
            <BellOutlined style={{ fontSize: isMobile ? "16px" : "18px", color: "#6c757d" }} />
          </Badge>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "8px" : "12px",
                cursor: "pointer",
                padding: isMobile ? "6px 8px" : "8px 12px",
                borderRadius: "8px",
                backgroundColor: "rgba(99, 45, 145, 0.05)",
                border: "1px solid rgba(99, 45, 145, 0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(99, 45, 145, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(99, 45, 145, 0.05)"
              }}
            >
              {/* Kullanıcı Bilgileri - Mobilde gizle */}
              {!isMobile && (
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
              )}
              
              {/* Avatar */}
              <Avatar style={{ backgroundColor: "#632d91", fontSize: isMobile ? "12px" : "14px" }}>
                {currentUser?.name?.charAt(0) || 'U'}
              </Avatar>
            </div>
          </Dropdown>
        </div>
      </Header>

      <AntLayout style={{ marginTop: 64 }}>
        {/* Desktop Sider */}
        {!isMobile && (
          <Sider
            width={80}
            style={{
              background: "#632d91",
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
              flexDirection: "column",
              justifyContent: "center", 
              alignItems: "center", 
              height: "50px",
              marginBottom: "16px"
            }}>
              <img 
                src="/grispiglobal_logo.jpg" 
                alt="Grispi Global Logo"
                style={{
                  width: "40px",
                  height: "30px",
                  objectFit: "contain",
                  borderRadius: "8px",
                  marginBottom: "2px"
                }}
              />
              <div style={{
                color: "white",
                fontSize: "8px",
                fontWeight: "bold",
                textAlign: "center",
                lineHeight: "1.2"
              }}>
                Grispi
              </div>
            </div>

            {/* Menü Öğeleri */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => navigate(item.key)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "50px",
                    margin: "0 6px",
                    borderRadius: "6px",
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
                  <div style={{ 
                    color: "white", 
                    marginBottom: "2px",
                    fontSize: "16px"
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ 
                    color: "white", 
                    fontSize: "8px", 
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
        )}

        <Content
          style={{
            marginLeft: isMobile ? 0 : 80,
            padding: isMobile ? "16px" : "16px",
            background: "#f8f9fa",
            minHeight: "calc(100vh - 64px)",
            transition: "margin-left 0.2s ease",
          }}
        >
          {children}
        </Content>
      </AntLayout>

      {/* Mobile Navigation Drawer */}
      <Drawer
        title={null}
        placement="left"
        width={280}
        open={mobileDrawerVisible}
        onClose={() => setMobileDrawerVisible(false)}
        closable={false}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ display: "none" }}
        className="mobile-nav-drawer"
      >
        <MobileNavigation />
      </Drawer>
    </AntLayout>
  )
}

export default Layout
