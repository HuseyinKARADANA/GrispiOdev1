import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider, App as AntApp } from "antd"
import Layout from "./components/Layout"
import RequestList from "./components/RequestList"
import RequestDetail from "./components/RequestDetail"
import NewRequest from "./components/NewRequest"
import EditProfile from "./components/EditProfile"
import Login from "./components/Login"
import Register from "./components/Register"
import TechnicianTicketList from "./components/TechnicianTicketList"

const theme = {
  token: {
    colorPrimary: "#722ed1",
    borderRadius: 6,
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <AntApp>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/requests" replace />} />
            <Route path="/requests" element={<Layout><RequestList /></Layout>} />
            <Route path="/requests/:id" element={<Layout><RequestDetail /></Layout>} />
            <Route path="/new-request" element={<Layout><NewRequest /></Layout>} />
            <Route path="/profile" element={<Layout><EditProfile /></Layout>} />
            <Route path="/technician-tickets" element={<Layout><TechnicianTicketList /></Layout>} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
