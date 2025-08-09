"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Avatar, Button, Input, Tag, Space, Divider, Typography, Row, Col, message, Spin, Select } from "antd"
import { ArrowLeftOutlined, SendOutlined, CloseOutlined, LoadingOutlined, PaperClipOutlined } from "@ant-design/icons"
import { apiGet, apiPost, apiPatch, apiDelete } from "../lib/api"
import { API_ENDPOINTS, getCurrentUser } from "../lib/config"

const { TextArea } = Input
const { Text, Title } = Typography
const { Option } = Select

function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [ticketData, setTicketData] = useState(null)
  const [messages, setMessages] = useState([])
  const [ccUsers, setCcUsers] = useState([])
  const [followers, setFollowers] = useState([])
  const currentUser = getCurrentUser()

  // Ticket verilerini yükle
  const loadTicketData = async () => {
    try {
      setLoading(true)
      const data = await apiGet(API_ENDPOINTS.TICKET_DETAIL(id))
      
      if (data.ticket) {
        setTicketData(data.ticket)
        setMessages(data.messages || [])
        setCcUsers(data.ccs || [])
        setFollowers(data.followers || [])
      }
    } catch (error) {
      message.error("Ticket verileri yüklenirken hata oluştu")
      console.error("Ticket load error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mesaj gönder
  const handleSendResponse = async () => {
    if (!response.trim()) {
      message.warning("Lütfen bir yanıt girin")
      return
    }

    try {
      setSending(true)
      const messageData = {
        message_text: response.trim(),
        is_internal: 0 // 0 = public message, 1 = internal message
      }

      await apiPost(API_ENDPOINTS.TICKET_MESSAGES(id), messageData)
      message.success("Yanıt başarıyla gönderildi")
      setResponse("")
      
      // Ticket verilerini yeniden yükle
      await loadTicketData()
    } catch (error) {
      message.error("Yanıt gönderilirken hata oluştu")
      console.error("Send message error:", error)
    } finally {
      setSending(false)
    }
  }

  // Ticket durumunu güncelle
  const handleUpdateTicket = async (updates) => {
    try {
      await apiPatch(API_ENDPOINTS.TICKET_UPDATE(id), updates)
      message.success("Ticket başarıyla güncellendi")
      await loadTicketData()
    } catch (error) {
      message.error("Ticket güncellenirken hata oluştu")
      console.error("Update ticket error:", error)
    }
  }

  // Ticket'ı kapat
  const handleCloseTicket = async () => {
    try {
      await handleUpdateTicket({ status: "CLOSED" })
      message.success("Ticket başarıyla kapatıldı")
      navigate("/requests")
    } catch (error) {
      message.error("Ticket kapatılırken hata oluştu")
      console.error("Close ticket error:", error)
    }
  }

  // CC kullanıcısı ekle
  const handleAddCc = async (userId) => {
    try {
      await apiPost(API_ENDPOINTS.TICKET_CC(id), { user_id: userId })
      message.success("CC kullanıcısı eklendi")
      await loadTicketData()
    } catch (error) {
      message.error("CC kullanıcısı eklenirken hata oluştu")
      console.error("Add CC error:", error)
    }
  }

  // Follower ekle
  const handleAddFollower = async (userId) => {
    try {
      await apiPost(API_ENDPOINTS.TICKET_FOLLOWERS(id), { user_id: userId })
      message.success("Follower eklendi")
      await loadTicketData()
    } catch (error) {
      message.error("Follower eklenirken hata oluştu")
      console.error("Add follower error:", error)
    }
  }

  // CC kullanıcısını kaldır
  const handleRemoveCc = async (userId) => {
    try {
      await apiDelete(API_ENDPOINTS.TICKET_CC_REMOVE(id, userId))
      message.success("CC kullanıcısı kaldırıldı")
      await loadTicketData()
    } catch (error) {
      message.error("CC kullanıcısı kaldırılırken hata oluştu")
      console.error("Remove CC error:", error)
    }
  }

  // Follower kaldır
  const handleRemoveFollower = async (userId) => {
    try {
      await apiDelete(API_ENDPOINTS.TICKET_FOLLOWERS_REMOVE(id, userId))
      message.success("Follower kaldırıldı")
      await loadTicketData()
    } catch (error) {
      message.error("Follower kaldırılırken hata oluştu")
      console.error("Remove follower error:", error)
    }
  }

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    if (id) {
      loadTicketData()
    }
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Ticket yükleniyor...</div>
      </div>
    )
  }

  if (!ticketData) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Text>Ticket bulunamadı</Text>
      </div>
    )
  }

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/requests")} style={{ marginBottom: 16 }}>
        Requests'e Geri Dön
      </Button>

      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <Title level={4} style={{ marginBottom: 8 }}>
              {ticketData.subject || "Ticket Başlığı"}
            </Title>
            {ticketData.description && (
              <Text type="secondary" style={{ fontSize: "14px", lineHeight: "1.5", display: "block", marginBottom: 24 }}>
                {ticketData.description.replace(/<[^>]*>/g, '')}
              </Text>
            )}

            <div style={{ marginBottom: 24 }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                  Henüz mesaj yok
                </div>
              ) : (
                messages.map((message, index) => (
                  <div key={message.id}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <Avatar
                        style={{
                          backgroundColor: message.is_internal ? "#52c41a" : "#722ed1",
                        }}
                      >
                        {message.sender_user_id ? String(message.sender_user_id).charAt(0) : "U"}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 8,
                          }}
                        >
                          <Text strong>
                            {message.sender_user_id === ticketData.requester?.id 
                              ? `${ticketData.requester.name} ${ticketData.requester.surname}`
                              : message.sender_user_id === ticketData.assignee?.id
                              ? `${ticketData.assignee.name} ${ticketData.assignee.surname}`
                              : `Kullanıcı ${message.sender_user_id}`
                            }
                          </Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {message.created_at ? new Date(message.created_at).toLocaleString('tr-TR') : "Bilinmeyen"}
                          </Text>
                          {message.is_internal && (
                            <Tag color="green" size="small">İç Mesaj</Tag>
                          )}
                        </div>
                        <div
                          style={{
                            backgroundColor: "#f5f5f5",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            lineHeight: "1.6",
                          }}
                        >
                          {message.message_text || "Mesaj içeriği bulunamadı"}
                        </div>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              <PaperClipOutlined /> Ekler:
                            </Text>
                            <div style={{ marginTop: 4 }}>
                              {message.attachments.map((attachment) => (
                                <Tag key={attachment.id} style={{ marginRight: 4 }}>
                                  {attachment.file_name}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < messages.length - 1 && <Divider />}
                  </div>
                ))
              )}
            </div>

            <Card size="small" style={{ backgroundColor: "#fafafa" }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>Kime:</Text>
                <br />
                <Text>
                  {ticketData.requester ? `${ticketData.requester.name} ${ticketData.requester.surname}` : "Bilinmeyen"}
                </Text>
                <br />
                <Text strong>Email CCs:</Text>
                <br />
                <Text>
                  {ccUsers.length > 0 
                    ? ccUsers.map(user => `${user.name} ${user.surname}`).join(", ") 
                    : "CC yok"
                  }
                </Text>
              </div>

              {ticketData.status === "CLOSED" ? (
                <div style={{ 
                  padding: "16px", 
                  backgroundColor: "#f5f5f5", 
                  borderRadius: "6px",
                  textAlign: "center",
                  color: "#666"
                }}>
                  <Text type="secondary">
                    Bu ticket kapatılmıştır. Yeni mesaj gönderilemez.
                  </Text>
                </div>
              ) : (
                <>
                  <TextArea
                    placeholder="Yanıt yazın..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={4}
                    style={{ marginBottom: 16 }}
                    disabled={sending}
                  />

                  <Space>
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />} 
                      onClick={handleSendResponse}
                      loading={sending}
                      disabled={!response.trim()}
                    >
                      Gönder
                    </Button>
                    <Button 
                      danger 
                      icon={<CloseOutlined />} 
                      onClick={handleCloseTicket}
                      disabled={ticketData.status === "CLOSED"}
                    >
                      Ticket'ı Kapat
                    </Button>
                  </Space>
                </>
              )}
            </Card>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Ticket Bilgileri" size="small">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Text type="secondary">Talep Eden</Text>
                <br />
                <Text strong>
                  {ticketData.requester ? `${ticketData.requester.name} ${ticketData.requester.surname}` : "Bilinmeyen"}
                </Text>
              </div>

              <div>
                <Text type="secondary">Oluşturulma</Text>
                <br />
                <Text>
                  {ticketData.created_date ? new Date(ticketData.created_date).toLocaleString('tr-TR') : "Bilinmeyen"}
                </Text>
              </div>

              <div>
                <Text type="secondary">Son Aktivite</Text>
                <br />
                <Text>
                  {ticketData.update_date ? new Date(ticketData.update_date).toLocaleString('tr-TR') : "Bilinmeyen"}
                </Text>
              </div>

              <div>
                <Text type="secondary">Atanan</Text>
                <br />
                <Text strong>
                  {ticketData.assignee ? `${ticketData.assignee.name} ${ticketData.assignee.surname}` : "Atanmamış"}
                </Text>
              </div>

              <div>
                <Text type="secondary">ID</Text>
                <br />
                <Text strong>#{ticketData.ticket_id || id}</Text>
              </div>

              <div>
                <Text type="secondary">Durum</Text>
                <br />
                <Select
                  value={ticketData.status || "OPEN"}
                  style={{ width: "100%" }}
                  onChange={(value) => handleUpdateTicket({ status: value })}
                >
                  <Option value="OPEN">Açık</Option>
                  <Option value="IN_PROGRESS">İşlemde</Option>
                  <Option value="WAITING">Beklemede</Option>
                  <Option value="CLOSED">Kapalı</Option>
                </Select>
              </div>

              <div>
                <Text type="secondary">Öncelik</Text>
                <br />
                <Select
                  value={ticketData.priority || "LOW"}
                  style={{ width: "100%" }}
                  onChange={(value) => handleUpdateTicket({ priority: value })}
                >
                  <Option value="LOW">Düşük</Option>
                  <Option value="MEDIUM">Orta</Option>
                  <Option value="HIGH">Yüksek</Option>
                  <Option value="URGENT">Acil</Option>
                </Select>
              </div>

              <div>
                <Text type="secondary">Kategori</Text>
                <br />
                <Text>{ticketData.category_name || "Genel"}</Text>
              </div>

              {/* CC Kullanıcıları */}
              <div>
                <Text type="secondary">CC Kullanıcıları</Text>
                <br />
                {ccUsers.length > 0 ? (
                  <div style={{ marginTop: 4 }}>
                    {ccUsers.map((user) => (
                      <Tag key={user.user_id} closable onClose={() => handleRemoveCc(user.user_id)}>
                        {user.name} {user.surname}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary" style={{ fontSize: "12px" }}>CC kullanıcısı yok</Text>
                )}
              </div>

              {/* Followers */}
              <div>
                <Text type="secondary">Takipçiler</Text>
                <br />
                {followers.length > 0 ? (
                  <div style={{ marginTop: 4 }}>
                    {followers.map((user) => (
                      <Tag key={user.user_id} closable onClose={() => handleRemoveFollower(user.user_id)}>
                        {user.name} {user.surname}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary" style={{ fontSize: "12px" }}>Takipçi yok</Text>
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RequestDetail
