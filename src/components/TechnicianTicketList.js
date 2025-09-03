"use client"

import { useState, useEffect } from "react"
import { Table, Input, Select, Tag, Space, Card, Button, message, Spin } from "antd"
import { SearchOutlined, UserOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { apiGet, apiPost } from "../lib/api"
import { API_ENDPOINTS, getCurrentUser } from "../lib/config"

const { Search } = Input
const { Option } = Select

function TechnicianTicketList() {
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [allData, setAllData] = useState([])
  const [orderBy, setOrderBy] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState({})
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  // API'den tüm açık ticket'ları çekme fonksiyonu
  const fetchOpenTickets = async (page = 1, perPage = 10) => {
    setLoading(true)
    try {
      const data = await apiGet(`${API_ENDPOINTS.TICKET_ALL_OPEN}?page=${page}&per_page=${perPage}`)
      setAllData(data.data || [])
      setPagination({
        current: data.pagination?.page || 1,
        pageSize: data.pagination?.per_page || 10,
        total: data.pagination?.total_items || 0
      })
    } catch (err) {
      message.error("Açık ticket'lar yüklenemedi")
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOpenTickets(pagination.current, pagination.pageSize)
  }, [])

  // Table pagination değiştiğinde API'den yeni veri çek
  const handleTableChange = (pag) => {
    fetchOpenTickets(pag.current, pag.pageSize)
  }

  // Ticket'ı devral
  const handleAssignTicket = async (ticketId) => {
    if (!currentUser?.id) {
      message.error("Kullanıcı bilgisi bulunamadı")
      return
    }

    // ticket_id'yi güvenli bir şekilde string'e çevir
    const safeTicketId = String(ticketId || '').replace('#', '')

    setAssigning(prev => ({ ...prev, [safeTicketId]: true }))
    
    try {
      // POST metodu kullan ve body'de assigned_user_id gönderme (endpoint request.user_id'den alıyor)
      await apiPost(API_ENDPOINTS.TICKET_ASSIGN(safeTicketId), {})
      message.success("Ticket başarıyla devralındı")
      
      // Ticket listesini yenile
      await fetchOpenTickets(pagination.current, pagination.pageSize)
    } catch (error) {
      message.error("Ticket devralınırken hata oluştu")
      console.error("Assign error:", error)
    } finally {
      setAssigning(prev => ({ ...prev, [safeTicketId]: false }))
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
      case "urgent":
        return "#ff4d4f"
      case "medium":
      case "normal":
        return "#1890ff"
      case "low":
        return "#8c8c8c"
      default:
        return "default"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "#ff4d4f"
      case "in_progress":
        return "#1890ff"
      case "waiting":
        return "#fa8c16"
      case "closed":
        return "#52c41a"
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
          item.subject?.toLowerCase().includes(searchText.toLowerCase()) ||
          String(item.ticket_id || item.id || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (item.category_name && item.category_name.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.requester?.name && item.requester.name.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((item) => item.status?.toLowerCase() === statusFilter.toLowerCase())
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter((item) => item.priority?.toLowerCase() === priorityFilter.toLowerCase())
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category_name === categoryFilter)
    }

    // Sort data
    if (orderBy) {
      filtered.sort((a, b) => {
        switch (orderBy) {
          case "date":
            return new Date(b.update_date || b.created_date) - new Date(a.update_date || a.created_date)
          case "priority":
            const priorityOrder = { HIGH: 4, URGENT: 3, MEDIUM: 2, NORMAL: 2, LOW: 1 }
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          case "status":
            return (a.status || "").localeCompare(b.status || "")
          case "ticketId":
            const aId = String(a.ticket_id || a.id || '').replace('#', '')
            const bId = String(b.ticket_id || b.id || '').replace('#', '')
            return parseInt(aId) - parseInt(bId)
          default:
            return 0
        }
      })
    }

    setFilteredData(filtered)
  }, [searchText, orderBy, statusFilter, priorityFilter, categoryFilter, allData])

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

  const clearAllFilters = () => {
    setSearchText("")
    setOrderBy("")
    setStatusFilter("")
    setPriorityFilter("")
    setCategoryFilter("")
  }

  const columns = [
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: "500" }}>
          {status === "OPEN" ? "Açık" : 
           status === "IN_PROGRESS" ? "İşlemde" : 
           status === "WAITING" ? "Beklemede" : 
           status === "CLOSED" ? "Kapalı" : status}
        </Tag>
      ),
    },
    {
      title: "Ticket ID",
      dataIndex: "ticket_id",
      key: "ticket_id",
      width: 100,
      render: (ticketId, record) => {
        // ticket_id'yi güvenli bir şekilde string'e çevir
        const safeTicketId = String(ticketId || record.id || '').replace('#', '')
        
        return (
          <Button 
            type="link" 
            onClick={() => navigate(`/requests/${safeTicketId}`)} 
            style={{ 
              padding: 0, 
              height: "auto",
              color: "#722ed1",
              fontWeight: "500"
            }}
          >
            {ticketId || `#${record.id}`}
          </Button>
        )
      },
    },
    {
      title: "Konu",
      dataIndex: "subject",
      key: "subject",
      render: (subject, record) => {
        // ticket_id'yi güvenli bir şekilde string'e çevir
        const safeTicketId = String(record.ticket_id || record.id || '').replace('#', '')
        
        return (
          <Button
            type="link"
            onClick={() => navigate(`/requests/${safeTicketId}`)}
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
        )
      },
    },
    {
      title: "Talep Eden",
      dataIndex: "requester",
      key: "requester",
      width: 150,
      render: (requester) => (
        <div>
          {requester ? `${requester.name} ${requester.surname}` : "Bilinmeyen"}
        </div>
      ),
    },
    {
      title: "Öncelik",
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
          {priority === "HIGH" ? "Yüksek" :
           priority === "MEDIUM" ? "Orta" :
           priority === "LOW" ? "Düşük" :
           priority === "URGENT" ? "Acil" : priority}
        </Tag>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category_name",
      key: "category_name",
      width: 120,
    },
    {
      title: "Oluşturulma",
      dataIndex: "created_date",
      key: "created_date",
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString('tr-TR') : "-",
    },
    {
      title: "Son Güncelleme",
      dataIndex: "update_date",
      key: "update_date",
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString('tr-TR') : "-",
    },
    {
      title: "İşlem",
      key: "action",
      width: 120,
      render: (_, record) => {
        // ticket_id'yi güvenli bir şekilde string'e çevir
        const safeTicketId = String(record.ticket_id || record.id || '').replace('#', '')
        
        return (
          <Button
            type="primary"
            icon={<UserOutlined />}
            loading={assigning[safeTicketId]}
            onClick={() => handleAssignTicket(safeTicketId)}
            disabled={record.assignee?.id === currentUser?.id}
            style={{
              backgroundColor: record.assignee?.id === currentUser?.id ? "#52c41a" : "#722ed1",
              borderColor: record.assignee?.id === currentUser?.id ? "#52c41a" : "#722ed1",
            }}
          >
            {record.assignee?.id === currentUser?.id ? "Devralındı" : "Devral"}
          </Button>
        )
      },
    },
  ]

  return (
    <div style={{ background: "white", borderRadius: "8px", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: 0, color: "#333", fontSize: "24px", fontWeight: "600" }}>
          Açık Ticket'lar
        </h2>
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Tüm açık ticket'ları görüntüleyin ve devralın
        </p>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Search
            placeholder="Ticket'larda ara..."
            allowClear
            enterButton={
              <div style={{
                backgroundColor: "#632d91",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                borderRadius: "0 6px 6px 0"
              }}>
                <SearchOutlined style={{ color: "white", fontSize: "16px" }} />
              </div>
            }
            size="middle"
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            value={searchText}
            style={{ width: 250 }}
          />

          <Select 
            placeholder="Durum" 
            style={{ width: 120 }} 
            allowClear
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <Option value="open">Açık</Option>
            <Option value="in_progress">İşlemde</Option>
            <Option value="waiting">Beklemede</Option>
          </Select>

          <Select 
            placeholder="Öncelik" 
            style={{ width: 120 }} 
            allowClear
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
          >
            <Option value="high">Yüksek</Option>
            <Option value="medium">Orta</Option>
            <Option value="low">Düşük</Option>
            <Option value="urgent">Acil</Option>
          </Select>

          <Select 
            placeholder="Kategori" 
            style={{ width: 140 }} 
            allowClear
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
          >
            <Option value="Account Management">Hesap Yönetimi</Option>
            <Option value="Technical Support">Teknik Destek</Option>
            <Option value="Billing">Faturalama</Option>
          </Select>

          <Select 
            placeholder="Sırala" 
            style={{ width: 120 }} 
            allowClear
            value={orderBy}
            onChange={handleOrderByChange}
          >
            <Option value="date">Tarih</Option>
            <Option value="priority">Öncelik</Option>
            <Option value="status">Durum</Option>
            <Option value="ticketId">Ticket ID</Option>
          </Select>

          {(searchText || orderBy || statusFilter || priorityFilter || categoryFilter) && (
            <Button 
              size="small" 
              onClick={clearAllFilters}
              style={{ fontSize: "12px" }}
            >
              Filtreleri Temizle
            </Button>
          )}
        </Space>
      </div>

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
          showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} kayıt`,
        }}
        onChange={handleTableChange}
        size="middle"
        style={{ background: "white" }}
        rowClassName={(record, index) => 
          index % 2 === 0 ? 'table-row-white' : 'table-row-gray'
        }
        rowKey={record => String(record.ticket_id || record.id || '')}
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

export default TechnicianTicketList
