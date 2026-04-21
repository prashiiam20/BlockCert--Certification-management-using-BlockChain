import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { EthereumProvider, EthereumContext } from './context/EthereumContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import IssueCertificate from './pages/IssueCertificate';
import RevokeCertificate from './pages/RevokeCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import MyCertificates from './pages/MyCertificates';
import ManageRoles from './pages/ManageRoles';
import Login from './pages/Login';
import Footer from './components/Footer';

import { Box } from '@mui/material';

function AppContent() {
  const { account } = useContext(EthereumContext);

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Navbar />
        
        {/* Professional Soft Background */}
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          zIndex: -1, 
          background: 'linear-gradient(180deg, #FCFBF7 0%, #F5F2E1 100%)' 
        }} />

        <Box sx={{ pt: { xs: 14, md: 18 }, pb: 8, flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={account ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/issue" element={account ? <IssueCertificate /> : <Navigate to="/login" />} />
            <Route path="/revoke" element={account ? <RevokeCertificate /> : <Navigate to="/login" />} />
            <Route path="/verify" element={<VerifyCertificate />} />
            <Route path="/my-certificates" element={account ? <MyCertificates /> : <Navigate to="/login" />} />
            <Route path="/manage-roles" element={account ? <ManageRoles /> : <Navigate to="/login" />} />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EthereumProvider>
        <AppContent />
      </EthereumProvider>
    </ThemeProvider>
  );
}

export default App;