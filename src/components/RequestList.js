"use client"

import { useState } from "react"
import { Table, Input, Select, Tag, Space, Card, Tabs, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Search } = Input
const { Option } = Select

const mockData = [
  {
    key: "1",
    ticketId: "#254",
    subject: "Example Ticket Headline",
    status: "open",
    priority: "high",
    category: "category1",
    updateDate: "15.02.2025",
    createdDate: "24.01.2025",
  },
  {
    key: "2",
    ticketId: "#251",
    subject: "Example Ticket Headline",
    status: "closed",
    priority: "high",
    category: "category2",
    updateDate: "15.02.2024",
    createdDate: "24.01.2024",
  },
  {
    key: "3",
    ticketId: "#2711",
    subject: "Example Ticket Headline",
    status: "open",
    priority: "low",
    category: "category3",
    updateDate: "15.02.2025",
    createdDate: "24.01.2025",
  },
  {
    key: "4",
    ticketId: "#101",
    subject: "Example Ticket Headline",
    status: "closed",
    priority: "normal",
    category: "category2",
    updateDate: "15.02.2025",
    createdDate: "24.01.2025",
  },
  {
    key: "5",
    ticketId: "#589",
    subject: "Example Ticket Headline",
    status: "closed",
    priority: "normal",
    category: "category3",
    updateDate: "15.02.2025",
    createdDate: "24.01.2025",
  },
  {
    key: "6",
    ticketId: "#543",
    subject: "Example Ticket Headline",
    status: "closed",
    priority: "high",
    category: "category1",
    updateDate: "15.02.2025",
    createdDate: "24.01.2025",
  },
]

function RequestList() {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState(mockData)
  const navigate = useNavigate()

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff4d4f" // Kırmızı
      case "normal":
        return "#1890ff" // Mavi
      case "low":
        return "#8c8c8c" // Gri
      default:
        return "default"
    }
  }

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 80,
      render: (status) => (
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: status === "open" ? "#ff4d4f" : "#52c41a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {status === "open" ? "O" : "C"}
        </div>
      ),
    },
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
      width: 100,
      render: (ticketId, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/requests/${record.key}`)} 
          style={{ 
            padding: 0, 
            height: "auto",
            color: "#722ed1",
            fontWeight: "500"
          }}
        >
          {ticketId}
        </Button>
      ),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/requests/${record.key}`)}
          style={{ 
            padding: 0, 
            height: "auto", 
            textAlign: "left",
            color: "#722ed1",
            fontWeight: "500"
          }}
        >
          {subject}
        </Button>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority) => (
        <Tag 
          color={getPriorityColor(priority)}
          style={{
            borderRadius: "4px",
            fontWeight: "500"
          }}
        >
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Update Date",
      dataIndex: "updateDate",
      key: "updateDate",
      width: 120,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 120,
    },
  ]

  const handleSearch = (value) => {
    setSearchText(value)
    const filtered = mockData.filter(
      (item) =>
        item.subject.toLowerCase().includes(value.toLowerCase()) ||
        item.ticketId.toLowerCase().includes(value.toLowerCase()) ||
        item.category.toLowerCase().includes(value.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  const tabItems = [
    {
      key: "1",
      label: "My Requests",
      children: null,
    },
    {
      key: "2",
      label: "Requests I'm CC'd On",
      children: null,
    },
    {
      key: "3",
      label: "Requests I'm Followers On",
      children: null,
    },
  ]

  return (
    <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
      <Tabs 
        defaultActiveKey="1" 
        items={tabItems}
        style={{ marginBottom: "24px" }}
        tabBarStyle={{
          borderBottom: "1px solid #e9ecef",
          marginBottom: "24px"
        }}
        tabBarExtraContent={
          <Space style={{ marginLeft: "auto" }}>
            <Search
              placeholder="Search in requests"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />

            <Select placeholder="Order by" style={{ width: 120 }} allowClear>
              <Option value="date">Date</Option>
              <Option value="priority">Priority</Option>
              <Option value="status">Status</Option>
            </Select>
          </Space>
        }
      />

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        size="middle"
        style={{ background: "white" }}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-white' : 'table-row-gray'
        }
      />

      <style jsx>{`
        .table-row-white {
          background-color: white;
        }
        .table-row-gray {
          background-color: #fafafa;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f0f0 !important;
        }
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #722ed1 !important;
          font-weight: 600;
        }
        .ant-tabs-ink-bar {
          background: #722ed1 !important;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa !important;
          border-bottom: 1px solid #e9ecef !important;
          color: #666 !important;
          font-weight: 600 !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0 !important;
        }
      `}</style>
    </div>
  )
}

export default RequestList
