"use client"

import { useState, useEffect } from "react"
import { Table, Input, Select, Tag, Space, Card, Tabs, Button, message, Pagination } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { apiGet } from "../lib/api"
import { API_ENDPOINTS } from "../lib/config"

const { Search } = Input
const { Option } = Select

function RequestList() {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [allData, setAllData] = useState([])
  const [orderBy, setOrderBy] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [activeTab, setActiveTab] = useState("1")
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  // API'den veri çekme fonksiyonu (pagination ile)
  const fetchTickets = async (page = 1, perPage = 10) => {
    setLoading(true)
    try {
      const data = await apiGet(`/Ticket/my-requests?page=${page}&per_page=${perPage}`)
      setAllData(data.data)
      setPagination({
        current: data.pagination.page,
        pageSize: data.pagination.per_page,
        total: data.pagination.total_items
      })
    } catch (err) {
      console.error("Ticket yükleme hatası:", err)
      message.error(err.message || "Ticketlar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize)
    // eslint-disable-next-line
  }, [])

  // Ekran boyutu takibi (mobil tespit)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener ? mq.addEventListener("change", update) : mq.addListener(update)
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", update) : mq.removeListener(update)
    }
  }, [])

  // Table pagination değiştiğinde API'den yeni veri çek
  const handleTableChange = (pag) => {
    fetchTickets(pag.current, pag.pageSize)
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#ff4d4f"
      case "normal":
        return "#1890ff"
      case "low":
        return "#8c8c8c"
      default:
        return "default"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "category1":
        return "#722ed1"
      case "category2":
        return "#13c2c2"
      case "category3":
        return "#fa8c16"
      default:
        return "#d9d9d9"
    }
  }

  // Filter and sort data based on all filters
  useEffect(() => {
    let filtered = [...allData]

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.subject.toLowerCase().includes(searchText.toLowerCase()) ||
          item.ticket_id.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.category && item.category.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status.toLowerCase() === statusFilter)
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((item) => item.priority.toLowerCase() === priorityFilter)
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    // Tab filter (şimdilik sadece My Requests aktif)
    // ...

    // Sort data
    if (orderBy) {
      filtered.sort((a, b) => {
        switch (orderBy) {
          case "date":
            return new Date(b.update_date.split('.').reverse().join('-')) - new Date(a.update_date.split('.').reverse().join('-'))
          case "priority":
            const priorityOrder = { HIGH: 3, NORMAL: 2, LOW: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case "status":
            return a.status.localeCompare(b.status)
          case "ticketId":
            return parseInt(a.ticket_id.replace('#', '')) - parseInt(b.ticket_id.replace('#', ''))
          default:
            return 0
        }
      })
    }

    setFilteredData(filtered)
  }, [searchText, orderBy, statusFilter, priorityFilter, categoryFilter, activeTab, allData])

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
            backgroundColor: status === "OPEN" ? "#ff4d4f" : "#52c41a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {status === "OPEN" ? "O" : "C"}
        </div>
      ),
    },
    {
      title: "Ticket ID",
      dataIndex: "ticket_id",
      key: "ticket_id",
      width: 100,
      render: (ticketId, record) => {
        const id = ticketId.toString().replace('#', '');
        return (
          <Button   
            type="link" 
            onClick={() => navigate(`/requests/${id}`)} 
            style={{ 
              padding: 0, 
              height: "auto",
                          color: "#632d91",
            fontWeight: "500"
          }}
        >
          {ticketId}
        </Button>
        );
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject, record) => {
        const id = record.ticket_id.toString().replace('#', '');
        return (
          <Button
            type="link"
            onClick={() => navigate(`/requests/${id}`)}
            style={{ 
              padding: 0, 
              height: "auto", 
              textAlign: "left",
                          color: "#632d91",
            fontWeight: "500"
          }}
        >
          {subject}
        </Button>
        );
      },
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
          {priority}
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
      dataIndex: "update_date",
      key: "update_date",
      width: 120,
    },
    {
      title: "Created Date",
      dataIndex: "created_date",
      key: "created_date",
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
    <div style={{ background: "white", borderRadius: "8px", padding: isMobile ? "12px" : "24px" }}>
      <Tabs 
        activeKey={activeTab}
        onChange={handleTabChange}
        items={tabItems}
        style={{ marginBottom: isMobile ? "12px" : "24px" }}
        tabBarStyle={{
          borderBottom: "1px solid #e9ecef",
          marginBottom: isMobile ? "12px" : "24px"
        }}
        tabBarExtraContent={
          isMobile ? (
            <div style={{ width: "100%", paddingLeft: 8, paddingRight: 8 }}>
              <Search
                placeholder="Search in requests"
                allowClear
                enterButton={<SearchOutlined />}
                size="middle"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
                value={searchText}
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <Space style={{ marginLeft: "auto" }}>
              <Search
                placeholder="Search in requests"
                allowClear
                enterButton={
                  <div style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%"
                  }}>
                    <SearchOutlined style={{ color: "white" }} />
                  </div>
                }
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
          )
        }
      />

      {isMobile ? (
        <>
          <div className="ticket-card-list">
            {filteredData.map((item) => {
              const id = item.ticket_id.toString().replace('#', '')
              return (
                <Card key={item.ticket_id} className="ticket-card" bordered>
                  <div className="ticket-card-header">
                    <div className={`status-dot ${item.status === 'OPEN' ? 'open' : 'closed'}`}></div>
                    <span className="ticket-id">{item.ticket_id}</span>
                    <Tag color={getPriorityColor(item.priority)} className="priority-tag">{item.priority}</Tag>
                  </div>
                  <Button type="link" onClick={() => navigate(`/requests/${id}`)} className="ticket-subject">
                    {item.subject}
                  </Button>
                  <div className="ticket-meta">
                    {item.category && <span className="meta-item">Category: {item.category}</span>}
                    <span className="meta-item">Updated: {item.update_date}</span>
                    <span className="meta-item">Created: {item.created_date}</span>
                  </div>
                </Card>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              showSizeChanger
              showQuickJumper
              onChange={(page, pageSize) => fetchTickets(page, pageSize)}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            />
          </div>
        </>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          size="middle"
          style={{ background: "white" }}
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'table-row-white' : 'table-row-gray'
          }
          rowKey={record => record.ticket_id}
          locale={{
            emptyText: loading ? "Yükleniyor..." : "Henüz hiç ticket oluşturulmamış"
          }}
        />
      )}

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
          color: #632d91 !important;
          font-weight: 600;
        }
        .ant-tabs-ink-bar {
          background: #632d91 !important;
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

        /* Mobil kart listesi */
        .ticket-card-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .ticket-card {
          border: 1px solid #f0f0f0;
          border-radius: 8px;
        }
        .ticket-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .status-dot.open { background-color: #ff4d4f; }
        .status-dot.closed { background-color: #52c41a; }
        .ticket-id { font-weight: 600; color: #595959; }
        .priority-tag { border-radius: 4px; margin-left: auto; }
        .ticket-subject { padding: 0; font-size: 16px; text-align: left; color: #632d91 !important; font-weight: 600; }
        .ticket-meta { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px; color: #595959; font-size: 12px; }
        .meta-item { background: #fafafa; padding: 2px 6px; border-radius: 4px; }
        @media (min-width: 769px) {
          .ticket-card-list { display: none; }
        }
      `}</style>
    </div>
  )
}

export default RequestList
