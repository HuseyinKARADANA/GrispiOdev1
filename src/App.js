import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ConfigProvider } from "antd"
import Layout from "./components/Layout"
import RequestList from "./components/RequestList"
import RequestDetail from "./components/RequestDetail"
import NewRequest from "./components/NewRequest"
import EditProfile from "./components/EditProfile"

const theme = {
  token: {
    colorPrimary: "#722ed1",
    borderRadius: 6,
  },
}

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/requests" replace />} />
            <Route path="/requests" element={<RequestList />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/profile" element={<EditProfile />} />
          </Routes>
        </Layout>
      </Router>
    </ConfigProvider>
  )
}

export default App
