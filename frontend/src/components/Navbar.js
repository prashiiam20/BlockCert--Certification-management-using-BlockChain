import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { EthereumContext } from '../context/EthereumContext';
import { NETWORKS, ROLES, ROLE_NAMES } from '../config/contracts';

export default function Navbar() {
  const { account, network, userRole, disconnectWallet, switchNetwork } = useContext(EthereumContext);

  return (
    <AppBar position="fixed" sx={{ 
      background: '#ffffff', 
      borderBottom: '1px solid #E5E1D1',
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{ py: 1, px: { xs: 2, md: 4 }, maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1, fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.5px', display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#8B1D1D', fontSize: '24px', marginRight: '4px' }}>🎓</span> 
          <span style={{ color: '#8B1D1D' }}>Block</span><span style={{ color: '#1A0D0D' }}>Cert</span>
        </Typography>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center', mr: 2 }}>
          {account && <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/">Dashboard</Button>}
          
          {/* INSTITUTION ONLY */}
          {userRole === ROLES.INSTITUTION && (
            <>
              <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/issue">Issue</Button>
              <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/revoke">Revoke</Button>
              <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/batch-issue">Batch</Button>
            </>
          )}

          {/* PUBLIC OR ANY ROLE */}
          <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/verify">Verify</Button>
          
          {/* LOGGED IN ROLES EXCLUDING RECRUITERS  */}
          {account && userRole !== ROLES.NONE && (
            <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/my-certificates">My Certificates</Button>
          )}

          {/* ADMIN / REGULATORY ONLY */}
          {(userRole === ROLES.GOVERNMENT || userRole === ROLES.REGULATORY) && (
            <Button sx={{ color: '#4B3F3F', fontWeight: 600, '&:hover': { color: '#8B1D1D', background: '#FCFBF7' } }} component={Link} to="/manage-roles">Manage Roles</Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>

          {account && (
            <>
              <Select
                value={network}
                onChange={(e) => switchNetwork(e.target.value)}
                size="small"
                sx={{ 
                  color: '#1A0D0D', 
                  backgroundColor: '#FCFBF7',
                  fontWeight: 600,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E1D1' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B1D1D' }
                }}
              >
                {Object.keys(NETWORKS).map((key) => (
                  <MenuItem key={key} value={key}>
                    {NETWORKS[key].name}
                  </MenuItem>
                ))}
              </Select>

              <Chip
                label={ROLE_NAMES[userRole]}
                sx={{ background: '#f0fdf4', color: '#166534', border: '1px solid #bbfcce', fontWeight: 700 }}
                size="medium"
              />

              <Chip
                icon={<AccountBalanceWalletIcon style={{ color: '#8B1D1D' }} />}
                label={`${account.slice(0, 6)}...${account.slice(-4)}`}
                sx={{ background: '#FCFBF7', color: '#1A0D0D', border: '1px solid #E5E1D1', fontWeight: 700 }}
              />

              <Button
                variant="outlined"
                size="small"
                onClick={disconnectWallet}
                sx={{ ml: 1, borderColor: '#E5E1D1', color: '#ef4444', '&:hover': { borderColor: '#ef4444', background: '#fef2f2' } }}
              >
                Disconnect
              </Button>
            </>
          )}

          {!account && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AccountBalanceWalletIcon />}
              component={Link}
              to="/login"
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}