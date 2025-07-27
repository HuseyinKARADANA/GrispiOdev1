"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, Avatar, Button, Input, Tag, Space, Divider, Typography, Row, Col, message } from "antd"
import { ArrowLeftOutlined, SendOutlined, CloseOutlined } from "@ant-design/icons"

const { TextArea } = Input
const { Text, Title } = Typography

function RequestDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [response, setResponse] = useState("")

  const ticketData = {
    id: "#12",
    title: "A headline of an example customer request question",
    requester: "Test Customer 1",
    created: "today at 11:35",
    lastActivity: "today at 12:00",
    assignedTo: "Az",
    status: "Awaiting your reply",
    priority: "low",
    issueType: "category1",
  }

  const messages = [
    {
      id: 1,
      sender: "Customer 1",
      time: "1 hour ago",
      content:
        "Hello, I'm unable to log into my account. Every time I enter my credentials, I get an 'Invalid username or password' error. Could you please help me resolve this?",
      isCustomer: true,
    },
    {
      id: 2,
      sender: "Az",
      time: "32 minutes ago",
      content: "Request is pending.",
      isCustomer: false,
    },
  ]

  const handleSendResponse = () => {
    if (!response.trim()) {
      message.warning("Please enter a response")
      return
    }
    message.success("Response sent successfully")
    setResponse("")
  }

  const handleCloseTicket = () => {
    message.success("Ticket closed successfully")
    navigate("/requests")
  }

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/requests")} style={{ marginBottom: 16 }}>
        Back to Requests
      </Button>

      <Row gutter={24}>
        <Col span={16}>
          <Card>
            <Title level={4} style={{ marginBottom: 24 }}>
              {ticketData.title}
            </Title>

            <div style={{ marginBottom: 24 }}>
              {messages.map((message, index) => (
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
                        backgroundColor: message.isCustomer ? "#722ed1" : "#52c41a",
                      }}
                    >
                      {message.sender.charAt(0)}
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
                        <Text strong>{message.sender}</Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {message.time}
                        </Text>
                      </div>
                      <div
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "12px 16px",
                          borderRadius: "8px",
                          lineHeight: "1.6",
                        }}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                  {index < messages.length - 1 && <Divider />}
                </div>
              ))}
            </div>

            <Card size="small" style={{ backgroundColor: "#fafafa" }}>
              <div style={{ marginBottom: 16 }}>
                <Text strong>To:</Text>
                <br />
                <Text strong>Email CCs:</Text>
              </div>

              <TextArea
                placeholder="Write a response..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={4}
                style={{ marginBottom: 16 }}
              />

              <Space>
                <Button type="primary" icon={<SendOutlined />} onClick={handleSendResponse}>
                  Send
                </Button>
                <Button danger icon={<CloseOutlined />} onClick={handleCloseTicket}>
                  Close Ticket
                </Button>
              </Space>
            </Card>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Ticket Information" size="small">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Text type="secondary">Requester</Text>
                <br />
                <Text strong>{ticketData.requester}</Text>
              </div>

              <div>
                <Text type="secondary">Created</Text>
                <br />
                <Text>{ticketData.created}</Text>
              </div>

              <div>
                <Text type="secondary">Last Activity</Text>
                <br />
                <Text>{ticketData.lastActivity}</Text>
              </div>

              <div>
                <Text type="secondary">Assigned to</Text>
                <br />
                <Text strong>{ticketData.assignedTo}</Text>
              </div>

              <div>
                <Text type="secondary">ID</Text>
                <br />
                <Text strong>{ticketData.id}</Text>
              </div>

              <div>
                <Text type="secondary">Status</Text>
                <br />
                <Tag color="orange">{ticketData.status}</Tag>
              </div>

              <div>
                <Text type="secondary">Priority</Text>
                <br />
                <Tag color="gray">{ticketData.priority.toUpperCase()}</Tag>
              </div>

              <div>
                <Text type="secondary">Issue Type</Text>
                <br />
                <Text>{ticketData.issueType}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default RequestDetail
