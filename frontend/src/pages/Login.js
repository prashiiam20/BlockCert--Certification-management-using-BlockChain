import React, { useContext, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import { EthereumContext } from '../context/EthereumContext';


export default function Login() {
  const { account, connectWallet } = useContext(EthereumContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (account) navigate('/');
  }, [account, navigate]);

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 } }} className="animate-fade-in-up">
      <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E1D1', display: 'flex', flexWrap: 'wrap', minHeight: 480 }}>
        
        {/* ─── Left: Brand Panel ───────────────────────────────── */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '0 0 38%' },
            background: 'linear-gradient(160deg, #6B1616 0%, #8B1D1D 60%, #A13D3D 100%)',
            p: { xs: 5, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {/* Brand */}
          <Box sx={{ mb: 6 }}>
            <Typography sx={{ fontWeight: 900, fontSize: '3rem', color: '#ffffff', letterSpacing: '-1.5px', lineHeight: 1 }}>
              AcadVault
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', mt: 1, letterSpacing: '0px' }}>
              Academic Credential Registry
            </Typography>
          </Box>

          {/* Features */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {[
              { icon: SecurityIcon, title: 'On-Chain Verification' },
              { icon: FingerprintIcon, title: 'Role-Based Authority' },
              { icon: AccountBalanceWalletIcon, title: 'Web3 Native Identity' },
            ].map(({ icon: Icon, title }) => (
              <Box key={title} sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon sx={{ fontSize: 22, color: '#ffffff' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem', letterSpacing: '0px' }}>
                  {title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── Right: Sign In Panel ──────────────────────────── */}
        <Box
          sx={{
            flex: { xs: '1 1 100%', md: '1 1 0' },
            p: { xs: 5, md: 6 },
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            {/* Icon */}
            <Box sx={{
              width: 64, height: 64, borderRadius: '16px',
              background: '#FFF5F5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mx: 'auto', mb: 3,
            }}>
              <SchoolIcon sx={{ color: '#1A0D0D', fontSize: 32 }} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, mb: 1.5, color: '#1A0D0D', letterSpacing: '-1px' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ color: '#4B3F3F', mb: 5, lineHeight: 1.6, px: 2 }}>
              Connect your institutional wallet to access the decentralized credential registry.
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<AccountBalanceWalletIcon sx={{ fontSize: '1.4rem !important' }} />}
              onClick={connectWallet}
              fullWidth
              sx={{ 
                py: 2, 
                bgcolor: '#8B1D1D',
                color: '#ffffff',
                fontSize: '1.05rem', 
                fontWeight: 800, 
                borderRadius: '12px',
                textTransform: 'none',
                boxShadow: '0 8px 24px rgba(139, 29, 29, 0.2)',
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: '#6B1616',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(139, 29, 29, 0.3)',
                }
              }}
            >
              Sign In with MetaMask
            </Button>

            <Typography variant="caption" sx={{ display: 'block', mt: 5, color: '#8B1D1D', opacity: 0.8, lineHeight: 1.6, px: 3, fontWeight: 600 }}>
              Secured by the Ethereum Blockchain & Institutional Registry Standards.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ─── Extra Content Put Below ────────────────────────── */}
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
        <Typography variant="caption" sx={{ mb: 2, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Platform Standards
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
          {[
            'EIP-191 Signing',
            'ChaCha20-Poly1305',
            'IPFS Storage',
            'Solidity 0.8.20',
            'RBAC On-Chain',
          ].map((badge) => (
            <Box key={badge} sx={{
              px: 2, py: 0.5, borderRadius: '20px', border: '1px solid #c0c0c0',
            }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#666' }}>
                {badge}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
