import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import NewsTicker from './components/NewsTicker';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Newspapers from './pages/Newspapers';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-[#F4F5F7] text-[#121212] selection:bg-[#FACC15] selection:text-black font-sans">
          <div>
            <Navbar />
            <NewsTicker />
            <main className="pb-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:identifier" element={<BlogDetail />} />
                <Route path="/newspapers" element={<Newspapers />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
