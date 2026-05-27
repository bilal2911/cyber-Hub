import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import MobileBottomBar from './components/MobileBottomBar';
import LoanModal from './components/LoanModal';
import Toast from './components/Toast';

// Pages
import Home from './pages/Home';
import ServiceDetail from './pages/ServiceDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import api from './utils/api';

const AppContent = () => {
  const [settings, setSettings] = useState(null);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  // Fetch site configurations once during startup
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        if (res.data.success) {
          setSettings(res.data.data);
        }
      } catch (err) {
        console.error('Error loading global settings:', err.message);
      }
    };
    fetchSettings();
  }, []);

  const handleShowToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleCloseToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-cream text-dark-blue-light selection:bg-teal-accent selection:text-white">
        
        {/* Render headers & floating widgets only on public screens */}
        <Routes>
          <Route 
            path="/admin/*" 
            element={null} 
          />
          <Route 
            path="*" 
            element={<Header onOpenLoanModal={() => setIsLoanModalOpen(true)} />} 
          />
        </Routes>

        {/* Content routing viewports */}
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={<Home settings={settings} onShowToast={handleShowToast} />} 
            />
            <Route 
              path="/service/:slug" 
              element={<ServiceDetail onShowToast={handleShowToast} />} 
            />
            <Route 
              path="/admin/login" 
              element={<AdminLogin onShowToast={handleShowToast} />} 
            />
            <Route 
              path="/admin" 
              element={<AdminDashboard onShowToast={handleShowToast} />} 
            />
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Render footers only on public screens */}
        <Routes>
          <Route 
            path="/admin/*" 
            element={null} 
          />
          <Route 
            path="*" 
            element={<Footer settings={settings} />} 
          />
        </Routes>

        {/* Floating Widgets */}
        <Routes>
          <Route path="/admin/*" element={null} />
          <Route 
            path="*" 
            element={
              <>
                <FloatingWhatsApp settings={settings} />
                <MobileBottomBar settings={settings} />
              </>
            } 
          />
        </Routes>

        {/* Loan Inquiry Wizard Modal */}
        <LoanModal 
          isOpen={isLoanModalOpen} 
          onClose={() => setIsLoanModalOpen(false)} 
          onShowToast={handleShowToast} 
        />

        {/* Feedback Notifications Toast */}
        {toast.visible && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={handleCloseToast} 
          />
        )}

      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
