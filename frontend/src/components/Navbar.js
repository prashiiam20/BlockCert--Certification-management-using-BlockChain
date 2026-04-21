import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Select,
  MenuItem,
  Chip,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';
import { EthereumContext } from '../context/EthereumContext';
import { NETWORKS, ROLES, ROLE_NAMES } from '../config/contracts';

function NavLink({ to, children }) {
  const { pathname } = useLocation();
  const isActive = pathname === to || (to !== '/' && pathname.startsWith(to));

  return (
    <Button
      component={Link}
      to={to}
      disableRipple={false}
      sx={{
        px: 1.5,
        py: 0.75,
        fontSize: '0.875rem',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'primary.main' : 'text.secondary',
        borderRadius: '8px',
        position: 'relative',
        letterSpacing: '0.1px',
        backgroundColor: isActive ? 'rgba(139,29,29,0.06)' : 'transparent',
        '&:hover': {
          color: 'primary.main',
          backgroundColor: 'rgba(139,29,29,0.06)',
        },
        transition: 'all 0.15s ease',
        // Active underline
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: '50%',
          transform: isActive ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
          width: '70%',
          height: '2px',
          borderRadius: '2px',
          backgroundColor: 'primary.main',
          transition: 'transform 0.2s ease',
        },
      }}
    >
      {children}
    </Button>
  );
}

export default function Navbar() {
  const { account, network, userRole, disconnectWallet, switchNetwork } = useContext(EthereumContext);

  const roleColor = {
    [ROLES.GOVERNMENT]:  { bg: '#EFF6FF', color: '#1D4ED8', border: 'rgba(37,99,235,0.25)' },
    [ROLES.REGULATORY]:  { bg: '#F5F3FF', color: '#7C3AED', border: 'rgba(124,58,237,0.25)' },
    [ROLES.INSTITUTION]: { bg: '#ECFDF5', color: '#065F46', border: 'rgba(6,95,70,0.25)' },
    [ROLES.STUDENT]:     { bg: '#FFFBEB', color: '#92400E', border: 'rgba(217,119,6,0.25)' },
    [ROLES.RECRUITER]:   { bg: '#FFF7ED', color: '#9A3412', border: 'rgba(154,52,18,0.25)' },
  }[userRole] || { bg: '#F5F2E8', color: '#4B3F3F', border: '#E5E1D1' };

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          py: 0.75,
          px: { xs: 2, md: 4 },
          maxWidth: '1440px',
          margin: '0 auto',
          width: '100%',
          gap: 1,
          minHeight: { xs: 56, md: 60 },
        }}
      >
        {/* ─── Brand ───────────────────────────────────────────────────── */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            fontSize: '1.125rem',
          }}
        >
          <SchoolIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Box component="span">
            <Box component="span" sx={{ color: 'primary.main' }}>Acad</Box>
            <Box component="span" sx={{ color: 'text.primary' }}>Vault</Box>
          </Box>
        </Typography>

        {/* ─── Nav Links ───────────────────────────────────────────────── */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: 0.25,
            mr: 2,
          }}
        >
          {account && <NavLink to="/">Dashboard</NavLink>}

          {userRole === ROLES.INSTITUTION && (
            <>
              <NavLink to="/issue">Issue</NavLink>
              <NavLink to="/revoke">Revoke</NavLink>
            </>
          )}

          <NavLink to="/verify">Verify</NavLink>

          {account && userRole !== ROLES.NONE && (
            <NavLink to="/my-certificates">My Certificates</NavLink>
          )}

          {(userRole === ROLES.GOVERNMENT || userRole === ROLES.REGULATORY) && (
            <NavLink to="/manage-roles">Manage Roles</NavLink>
          )}
        </Box>

        {/* ─── Right Controls ──────────────────────────────────────────── */}
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {account && (
            <>
              {/* Network Selector */}
              <Select
                value={network}
                onChange={(e) => switchNetwork(e.target.value)}
                size="small"
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: '#F5F2E8',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: '#E5E1D1' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8B1D1D' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8B1D1D' },
                  '.MuiSelect-select': { py: 0.75, px: 1.5 },
                }}
              >
                {Object.keys(NETWORKS).map((key) => (
                  <MenuItem key={key} value={key} sx={{ fontSize: '0.82rem', fontWeight: 500 }}>
                    {NETWORKS[key].name}
                  </MenuItem>
                ))}
              </Select>

              {/* Role Badge */}
              <Chip
                label={ROLE_NAMES[userRole]}
                size="small"
                sx={{
                  backgroundColor: roleColor.bg,
                  color: roleColor.color,
                  border: `1px solid ${roleColor.border}`,
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  height: 28,
                  letterSpacing: '0.2px',
                }}
              />

              <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center' }} />

              {/* Wallet Address */}
              <Chip
                icon={<AccountBalanceWalletIcon style={{ color: '#8B1D1D', fontSize: 16 }} />}
                label={`${account.slice(0, 6)}…${account.slice(-4)}`}
                size="small"
                sx={{
                  backgroundColor: '#FCFBF7',
                  color: '#1A0D0D',
                  border: '1px solid #E5E1D1',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  height: 28,
                }}
              />

              {/* Disconnect */}
              <Button
                size="small"
                onClick={disconnectWallet}
                sx={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#DC2626',
                  borderColor: 'rgba(220,38,38,0.3)',
                  border: '1.5px solid',
                  borderRadius: '8px',
                  px: 1.75,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#DC2626',
                    backgroundColor: '#FEF2F2',
                    transform: 'none',
                  },
                }}
              >
                Disconnect
              </Button>
            </>
          )}

          {!account && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AccountBalanceWalletIcon sx={{ fontSize: '16px !important' }} />}
              component={Link}
              to="/login"
              sx={{ px: 2, fontSize: '0.875rem' }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}