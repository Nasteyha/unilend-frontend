import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import ItemDetail from './pages/ItemDetail'
import CreateListing from './pages/CreateListing'
import ReceivedRequests from './pages/ReceivedRequests'
import MyRequests from './pages/MyRequests'
import AdminDashboard from './pages/AdminDashboard'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/received-requests" element={<ReceivedRequests />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App