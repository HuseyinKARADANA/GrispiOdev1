"use client"

import { useState, useEffect } from "react"
import { Table, Input, Select, Tag, Space, Card, Tabs, Button, message, Pagination, Row, Col, Drawer, Statistic, Dropdown, Menu } from "antd"
import { SearchOutlined, FilterOutlined, ReloadOutlined, PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from "@ant-design/icons"
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
  const [stats, setStats] = useState({
    openRequests: 0,
    resolvedRequests: 0,
    todayOpened: 0,
    todayResolved: 0
  })
  const [isMobile, setIsMobile] = useState(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false)
  const [tabsDropdownVisible, setTabsDropdownVisible] = useState(false)
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
      calculateStats(data.data)
    } catch (err) {
      console.error("Ticket yükleme hatası:", err)
      message.error(err.message || "Ticketlar yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  // İstatistikleri hesapla
  const calculateStats = (data) => {
    const today = new Date().toISOString().split('T')[0]
    const openRequests = data.filter(item => item.status === 'OPEN').length
    const resolvedRequests = data.filter(item => item.status === 'CLOSED').length
    const todayOpened = data.filter(item => {
      if (!item.created_date) return false
      const createdDate = item.created_date.split('.').reverse().join('-')
      return createdDate === today
    }).length
    const todayResolved = data.filter(item => {
      if (!item.update_date) return false
      const updateDate = item.update_date.split('.').reverse().join('-')
      return updateDate === today && item.status === 'CLOSED'
    }).length

    setStats({
      openRequests,
      resolvedRequests,
      todayOpened,
      todayResolved
    })
  }

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize)
    // eslint-disable-next-line
  }, [])

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
            if (!a.update_date || !b.update_date) return 0
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

  const showFilterDrawer = () => {
    setFilterDrawerVisible(true)
  }

  const hideFilterDrawer = () => {
    setFilterDrawerVisible(false)
  }

  const showTabsDropdown = () => {
    setTabsDropdownVisible(true)
  }

  const hideTabsDropdown = () => {
    setTabsDropdownVisible(false)
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
    <>
    <div style={{ 
      background: "#f8f9fa", 
      minHeight: "100vh", 
      width: "100%",
      padding: isMobile ? "8px" : "16px"
    }}>
      {/* Dashboard Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? "24px" : "28px", fontWeight: "600", color: "#333" }}>Requests</h1>
            <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "14px" }}>Ticket yönetim sistemi</p>
          </div>
          
        </div>

       
      </div>

      {/* Ana İçerik */}
      <Card 
        style={{ 
          borderRadius: "12px", 
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "none",
          width: "100%"
        }}
      >
        {/* Tabs ve Filtreler */}
        <div style={{ marginBottom: "24px" }}>
          {/* Desktop Tabs */}
          {!isMobile && (
            <Tabs 
              activeKey={activeTab}
              onChange={handleTabChange}
              items={tabItems}
              style={{ marginBottom: "16px" }}
              tabBarStyle={{
                borderBottom: "1px solid #f0f0f0",
                marginBottom: "16px"
              }}
              tabBarExtraContent={
                <Space>
                  <Button 
                    icon={<ReloadOutlined />}
                    onClick={() => fetchTickets(pagination.current, pagination.pageSize)}
                    style={{ borderRadius: "6px" }}
                    size="middle"
                  >
                    Yenile
                  </Button>
                </Space>
              }
              size="middle"
              type="line"
            />
          )}
          
          {/* Mobile Tabs Dropdown */}
          {isMobile && (
            <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
              <Dropdown
                menu={{
                  items: tabItems.map(item => ({
                    key: item.key,
                    label: item.label,
                    onClick: () => {
                      handleTabChange(item.key)
                      hideTabsDropdown()
                    }
                  }))
                }}
                open={tabsDropdownVisible}
                onOpenChange={setTabsDropdownVisible}
                trigger={['click']}
                placement="bottomLeft"
              >
                <Button 
                  style={{ 
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    background: "white",
                    color: "#333",
                    flex: 1,
                    width: "100%"
                  }}
                >
                  {tabItems.find(item => item.key === activeTab)?.label || "My Requests"}
                  <span style={{ marginLeft: "8px" }}>▼</span>
                </Button>
              </Dropdown>
              
              <Button 
                icon={<ReloadOutlined />}
                onClick={() => fetchTickets(pagination.current, pagination.pageSize)}
                style={{ borderRadius: "6px", flexShrink: 0 }}
                size="small"
              />
            </div>
          )}
          
          {/* Arama ve Filtreler */}
          <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
            <Col xs={24} sm={24} md={8} lg={6}>
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
            </Col>
            
            {/* Desktop Filtreler */}
            {!isMobile && (
              <>
                <Col xs={24} sm={12} md={4} lg={3}>
                  <Select 
                    placeholder="Status" 
                    style={{ width: "100%" }} 
                    allowClear
                    onChange={handleStatusFilterChange}
                  >
                    <Option value="open">Open</Option>
                    <Option value="closed">Closed</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4} lg={3}>
                  <Select 
                    placeholder="Priority" 
                    style={{ width: "100%" }} 
                    allowClear
                    onChange={handlePriorityFilterChange}
                  >
                    <Option value="high">High</Option>
                    <Option value="normal">Normal</Option>
                    <Option value="low">Low</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4} lg={3}>
                  <Select 
                    placeholder="Category" 
                    style={{ width: "100%" }} 
                    allowClear
                    onChange={handleCategoryFilterChange}
                  >
                    <Option value="category1">Category 1</Option>
                    <Option value="category2">Category 2</Option>
                    <Option value="category3">Category 3</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={4} lg={3}>
                  <Select 
                    placeholder="Order by" 
                    style={{ width: "100%" }} 
                    allowClear
                    onChange={handleOrderByChange}
                  >
                    <Option value="date">Date</Option>
                    <Option value="priority">Priority</Option>
                    <Option value="status">Status</Option>
                    <Option value="ticketId">Ticket ID</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={24} md={8} lg={6}>
                  {searchText && (
                    <Button 
                      onClick={clearAllFilters}
                      style={{ width: "100%" }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Col>
              </>
            )}
            
            {/* Mobile Filter Button */}
            {isMobile && (
              <Col xs={24}>
                <Button 
                  icon={<FilterOutlined />}
                  onClick={showFilterDrawer}
                  style={{ width: "100%" }}
                  size="middle"
                >
                  Filtreler
                </Button>
              </Col>
            )}
          </Row>
        </div>

        {/* Desktop Table */}
        {!isMobile && (
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
              style: { marginTop: "16px" }
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

        {/* Mobile Cards */}
        {isMobile && (
          <div style={{ marginTop: "16px", padding: "0 4px" }}>
            {filteredData.map((item) => {
              const id = item.ticket_id.toString().replace('#', '')
              return (
                <Card 
                  key={item.ticket_id} 
                  className="mobile-card"
                  style={{ 
                    marginBottom: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "none",
                    width: "100%"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div 
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          backgroundColor: item.status === 'OPEN' ? '#ff4d4f' : '#52c41a'
                        }}
                      />
                      <span style={{ fontWeight: "600", color: "#595959", fontSize: "14px" }}>
                        {item.ticket_id}
                      </span>
                    </div>
                    {item.priority && (
                      <Tag color={getPriorityColor(item.priority)} style={{ fontSize: "12px", borderRadius: "4px" }}>
                        {item.priority}
                      </Tag>
                    )}
                  </div>
                  
                  <Button 
                    type="link" 
                    onClick={() => navigate(`/requests/${id}`)}
                    style={{ 
                      padding: 0, 
                      fontSize: "16px", 
                      textAlign: "left", 
                      color: "#632d91", 
                      fontWeight: "600", 
                      lineHeight: "1.4",
                      marginBottom: "8px",
                      display: "block",
                      width: "100%",
                      height: "auto",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                    title={item.subject}
                  >
                    {item.subject}
                  </Button>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", color: "#595959", fontSize: "12px" }}>
                    {item.category && (
                      <span className="meta-span" style={{ 
                        background: "#fafafa", 
                        padding: "4px 8px", 
                        borderRadius: "4px",
                        display: "inline-block"
                      }}>
                        Category: {item.category}
                      </span>
                    )}
                    <span className="meta-span" style={{ 
                      background: "#fafafa", 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      display: "inline-block"
                    }}>
                      Updated: {item.update_date}
                    </span>
                    <span className="meta-span" style={{ 
                      background: "#fafafa", 
                      padding: "4px 8px", 
                      borderRadius: "4px",
                      display: "inline-block"
                    }}>
                      Created: {item.created_date}
                    </span>
                  </div>
                </Card>
              )
            })}
            
            {/* Mobile Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: "16px" }}>
              <Pagination
                current={pagination.current}
                pageSize={pagination.pageSize}
                total={pagination.total}
                showSizeChanger={false}
                showQuickJumper={false}
                onChange={(page, pageSize) => fetchTickets(page, pageSize)}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
                size="small"
              />
            </div>
          </div>
        )}

      </Card>

      {/* Mobile Filter Drawer */}
      <Drawer
        title="Filtreler"
        placement="bottom"
        onClose={hideFilterDrawer}
        open={filterDrawerVisible}
        height="auto"
        style={{ maxHeight: "80vh" }}
      >
        <div style={{ padding: "16px 0" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Status</label>
            <Select 
              placeholder="Status seçin" 
              style={{ width: "100%" }} 
              allowClear
              onChange={handleStatusFilterChange}
            >
              <Option value="open">Open</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Priority</label>
            <Select 
              placeholder="Priority seçin" 
              style={{ width: "100%" }} 
              allowClear
              onChange={handlePriorityFilterChange}
            >
              <Option value="high">High</Option>
              <Option value="normal">Normal</Option>
              <Option value="low">Low</Option>
            </Select>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Category</label>
            <Select 
              placeholder="Category seçin" 
              style={{ width: "100%" }} 
              allowClear
              onChange={handleCategoryFilterChange}
            >
              <Option value="category1">Category 1</Option>
              <Option value="category2">Category 2</Option>
              <Option value="category3">Category 3</Option>
            </Select>
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Sıralama</label>
            <Select 
              placeholder="Sıralama seçin" 
              style={{ width: "100%" }} 
              allowClear
              onChange={handleOrderByChange}
            >
              <Option value="date">Tarih</Option>
              <Option value="priority">Priority</Option>
              <Option value="status">Status</Option>
              <Option value="ticketId">Ticket ID</Option>
            </Select>
          </div>
          
          <div style={{ display: "flex", gap: "12px" }}>
            <Button 
              onClick={clearAllFilters}
              style={{ flex: 1 }}
            >
              Filtreleri Temizle
            </Button>
            <Button 
              type="primary"
              onClick={hideFilterDrawer}
              style={{ flex: 1 }}
            >
              Uygula
            </Button>
          </div>
        </div>
      </Drawer>

      <style jsx>{`
        /* Tab Styles */
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #632d91 !important;
          font-weight: 600;
        }
        .ant-tabs-ink-bar {
          background: #632d91 !important;
        }
        
        /* Mobile Tab Styles */
        @media (max-width: 768px) {
          .ant-dropdown-menu {
            background: white !important;
            border: 1px solid #d9d9d9 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
            border-radius: 6px !important;
          }
          .ant-dropdown-menu-item {
            color: #333 !important;
            padding: 8px 16px !important;
          }
          .ant-dropdown-menu-item:hover {
            background: #f5f5f5 !important;
          }
          .ant-dropdown-menu-item-selected {
            background: #e6f7ff !important;
            color: #632d91 !important;
          }
        }
        
        /* Dropdown Styles */
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
        
        /* Input Styles */
        .ant-input {
          background-color: white !important;
          color: #333 !important;
        }
        .ant-input::placeholder {
          color: #bfbfbf !important;
        }
        
        /* Button Styles */
        .ant-btn {
          color: #333 !important;
        }

        /* Table Styles */
        .table-row-white {
          background-color: white;
        }
        .table-row-gray {
          background-color: #fafafa;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f0f0 !important;
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
        
        /* Card Styles */
        .mobile-card {
          transition: all 0.3s ease;
          margin-bottom: 16px !important;
        }
        .mobile-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        
        /* Text Overflow Styles */
        .mobile-card .ant-btn {
          max-width: 100% !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        .mobile-card .meta-span {
          max-width: calc(50% - 3px) !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }
        
        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .ant-statistic-content {
            font-size: 20px !important;
          }
          .ant-card {
            margin-bottom: 16px !important;
          }
          .mobile-card {
            margin-bottom: 16px !important;
          }
          .ant-pagination {
            text-align: center;
          }
          .ant-pagination-item {
            min-width: 32px;
          }
          .ant-pagination-total-text {
            font-size: 12px;
          }
          
          /* Mobile text overflow */
          .mobile-card .meta-span {
            max-width: calc(100% - 6px) !important;
          }
          
          /* Mobile container adjustments */
          .ant-card-body {
            padding: 12px !important;
          }
          
          /* Mobile tabs adjustments */
          .ant-tabs-content-holder {
            padding: 0 !important;
          }
          
          /* Mobile filter row adjustments */
          .ant-row {
            margin-left: -4px !important;
            margin-right: -4px !important;
          }
          .ant-col {
            padding-left: 4px !important;
            padding-right: 4px !important;
          }
        }
      `}</style>
    </div>
    </>
  )
}

export default RequestList
