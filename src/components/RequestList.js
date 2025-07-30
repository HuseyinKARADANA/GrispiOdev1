"use client"

import { useState, useEffect } from "react"
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
    subject: "Example yok Ticket Headline",
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
  const [orderBy, setOrderBy] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [activeTab, setActiveTab] = useState("1")
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

  const getCategoryColor = (category) => {
    switch (category) {
      case "category1":
        return "#722ed1" // Mor
      case "category2":
        return "#13c2c2" // Turkuaz
      case "category3":
        return "#fa8c16" // Turuncu
      default:
        return "#d9d9d9" // Gri
    }
  }

  // Filter and sort data based on all filters
  useEffect(() => {
    let filtered = [...mockData]

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.subject.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ticketId.toLowerCase().includes(searchText.toLowerCase()) ||
          item.category.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((item) => item.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Tab filter (simulate different data for different tabs)
    if (activeTab === "2") {
      // Requests I'm CC'd On - show only some tickets
      filtered = filtered.filter((item) => ["1", "3", "5"].includes(item.key))
    } else if (activeTab === "3") {
      // Requests I'm Followers On - show different tickets
      filtered = filtered.filter((item) => ["2", "4", "6"].includes(item.key))
    }

    // Sort data
    if (orderBy) {
      filtered.sort((a, b) => {
        switch (orderBy) {
          case "date":
            return new Date(b.updateDate.split('.').reverse().join('-')) - new Date(a.updateDate.split('.').reverse().join('-'))
          case "priority":
            const priorityOrder = { high: 3, normal: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case "status":
            return a.status.localeCompare(b.status)
          case "ticketId":
            return parseInt(a.ticketId.slice(1)) - parseInt(b.ticketId.slice(1))
          default:
            return 0
        }
      })
    }

    setFilteredData(filtered)
  }, [searchText, orderBy, statusFilter, priorityFilter, categoryFilter, activeTab])

  const handleSearch = (value) => {
    setSearchText(value)
  }

  const handleOrderByChange = (value) => {
    setOrderBy(value)
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
  }

  const handlePriorityFilterChange = (value) => {
    setPriorityFilter(value)
  }

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value)
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
  }

  const clearAllFilters = () => {
    setSearchText("")
    setOrderBy("")
    setStatusFilter("")
    setPriorityFilter("")
    setCategoryFilter("")
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
        activeKey={activeTab}
        onChange={handleTabChange}
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
              value={searchText}
              style={{ width: 250 }}
            />

            <Select 
              placeholder="Status" 
              style={{ width: 100 }} 
              allowClear
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <Option value="open">Open</Option>
              <Option value="closed">Closed</Option>
            </Select>

            <Select 
              placeholder="Priority" 
              style={{ width: 100 }} 
              allowClear
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
            >
              <Option value="high">High</Option>
              <Option value="normal">Normal</Option>
              <Option value="low">Low</Option>
            </Select>

            <Select 
              placeholder="Category" 
              style={{ width: 120 }} 
              allowClear
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <Option value="category1">Category 1</Option>
              <Option value="category2">Category 2</Option>
              <Option value="category3">Category 3</Option>
            </Select>

            <Select 
              placeholder="Order by" 
              style={{ width: 120 }} 
              allowClear
              value={orderBy}
              onChange={handleOrderByChange}
            >
              <Option value="date">Date</Option>
              <Option value="priority">Priority</Option>
              <Option value="status">Status</Option>
              <Option value="ticketId">Ticket ID</Option>
            </Select>

            {(searchText || orderBy || statusFilter || priorityFilter || categoryFilter) && (
              <Button 
                size="small" 
                onClick={clearAllFilters}
                style={{ fontSize: "12px" }}
              >
                Clear Filters
              </Button>
            )}
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
        
        /* Dropdown menü stilleri */
        .ant-select-dropdown {
          background-color: white !important;
          border: 1px solid #d9d9d9 !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }
        
        .ant-select-item {
          color: #333 !important;
          background-color: white !important;
        }
        
        .ant-select-item:hover {
          background-color: #f5f5f5 !important;
        }
        
        .ant-select-item-option-selected {
          background-color: #e6f7ff !important;
          color: #333 !important;
        }
        
        .ant-select-selection-item {
          color: #333 !important;
        }
        
        .ant-select-selection-placeholder {
          color: #bfbfbf !important;
        }
        
        /* Search input stilleri */
        .ant-input {
          background-color: white !important;
          color: #333 !important;
        }
        
        .ant-input::placeholder {
          color: #bfbfbf !important;
        }
        
        /* Button stilleri */
        .ant-btn {
          color: #333 !important;
        }
      `}</style>
    </div>
  )
}

export default RequestList
