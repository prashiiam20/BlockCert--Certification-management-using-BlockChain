import React, { useContext, useEffect } from 'react';
import { Container, Paper, Typography, Button, Box, Grid } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { useNavigate } from 'react-router-dom';
import { EthereumContext } from '../context/EthereumContext';

export default function Login() {
  const { account, connectWallet } = useContext(EthereumContext);
  const navigate = useNavigate();

  // If already logged in, instantly route to Dashboard
  useEffect(() => {
    if (account) {
      navigate('/');
    }
  }, [account, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 10 } }} className="animate-fade-in-up">
      <Paper elevation={1} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Grid container sx={{ minHeight: '520px' }}>
          {/* Left Branding/Info Panel */}
          <Grid item xs={12} md={6} sx={{ 
            background: 'linear-gradient(135deg, #6B1616 0%, #8B1D1D 100%)', 
            p: 6, 
            color: 'white', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center' 
          }}>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: '#ffffff', letterSpacing: '-1.5px' }}>
              BlockCert
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 6, fontWeight: 400, color: '#fca5a5' }}>
              Academic Credential Registry
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                  <SecurityIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>On-Chain Verification</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                  <FingerprintIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>Role-Based Authority</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box sx={{ p: 1, borderRadius: '10px', background: 'rgba(255,255,255,0.1)' }}>
                  <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#ffffff' }}>Web3 Native Identity</Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right Login Panel */}
          <Grid item xs={12} md={6} sx={{ p: { xs: 4, md: 8 }, background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '14px', 
              background: '#fef2f2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mb: 3,
              fontSize: '28px'
            }}>
              🎓
            </Box>
            
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: '#1A0D0D' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B3F3F', mb: 6, maxWidth: '380px' }}>
              Connect your institutional wallet to access the decentralized credential registry.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<AccountBalanceWalletIcon />}
              onClick={connectWallet}
              sx={{ py: 2, px: 5, width: '100%', maxWidth: '320px', fontSize: '1rem', fontWeight: 700 }}
            >
              Sign In with MetaMask
            </Button>
            
            <Typography variant="caption" sx={{ color: '#A13D3D', mt: 4, display: 'block', maxWidth: '300px' }}>
              Secured by the Ethereum Blockchain & Institutional Registry Standards.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
