import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import VerifiedIcon from '@mui/icons-material/Verified';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import { EthereumContext } from '../context/EthereumContext';
import { ROLES, NETWORKS } from '../config/contracts';

export default function Dashboard() {
  const { account, network, userRole, contract } = useContext(EthereumContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ 
    totalIssued: 0, 
    myRecent: [], 
    globalRecent: []
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [activityTab, setActivityTab] = useState(0); // 0: My, 1: Global

  const fetchStats = useCallback(async () => {
    if (!contract || !account) return;
    try {
      setLoadingStats(true);
      
      const filter = contract.filters.CertificateIssued();
      const events = await contract.queryFilter(filter, 0, 'latest');
      
      const mapEvent = (e) => ({
        id: e.args.certificateId,
        student: e.args.student,
        institution: e.args.institution,
        txHash: e.transactionHash
      });

      const myEvents = events.filter(e => e.args.institution.toLowerCase() === account.toLowerCase());
      
      setStats({
        totalIssued: events.length,
        myRecent: [...myEvents].reverse().slice(0, 5).map(mapEvent),
        globalRecent: [...events].reverse().slice(0, 5).map(mapEvent)
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const viewOnExplorer = (hash) => {
    const explorer = NETWORKS[network]?.blockExplorer;
    if (explorer) window.open(`${explorer}/tx/${hash}`, '_blank');
  };

  const activeLogs = activityTab === 0 ? stats.myRecent : stats.globalRecent;

  return (
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Box sx={{ mb: 5 }} className="animate-fade-in-up">
        <Typography variant="h3" sx={{ mb: 0.75 }}>
          Registry Intelligence
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Real-time analytics and global auditing for the Official Academic Registry.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column: Account & Volume */}
        <Grid item xs={12} md={4} className="animate-fade-in-up stagger-1">
          <Card elevation={0} sx={{ borderRadius: '20px', mb: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 1 }}>
                Total Lifetime Issuance
              </Typography>
              <Typography variant="h2" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1 }}>
                {stats.totalIssued}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                Institutional Records on Blockchain
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ borderRadius: '20px', mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main' }}>
                <AccountBalanceWalletIcon />
                Node Identity
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 0.5 }}>Registry Wallet</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.78rem' }}>{account}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 0.5 }}>Network</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{network}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="overline" sx={{ color: 'primary.light', display: 'block', mb: 0.5 }}>Status</Typography>
                    <Chip label="ONLINE" size="small" color="success" />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Actions & Global Log */}
        <Grid item xs={12} md={8} className="animate-fade-in-up stagger-2">
          <Card elevation={0} sx={{ borderRadius: '20px', mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VerifiedIcon sx={{ color: 'secondary.main' }} />
                Administrative Services
              </Typography>
              <Grid container spacing={2}>
                {userRole === ROLES.INSTITUTION && (
                  <Grid item xs={12} sm={6}>
                    <Button variant="contained" startIcon={<SchoolIcon />} onClick={() => navigate('/issue')} fullWidth size="large" sx={{ py: 2 }}>
                      New Issuance
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" startIcon={<VerifiedIcon />} onClick={() => navigate('/verify')} fullWidth size="large" sx={{ py: 2 }}>
                    Universal Verifier
                  </Button>
                </Grid>
                {(userRole === ROLES.GOVERNMENT || userRole === ROLES.REGULATORY) && (
                  <Grid item xs={12} sm={6}>
                    <Button variant="contained" startIcon={<GroupIcon />} onClick={() => navigate('/manage-roles')} fullWidth size="large" sx={{ py: 2 }}>
                      Registry Oversight
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Paper elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E5E1D1', overflow: 'hidden' }}>
            <Box sx={{ px: 3, pt: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon sx={{ color: 'primary.main' }} />
                Protocol Activity
              </Typography>
              <Tabs value={activityTab} onChange={(_, v) => setActivityTab(v)}>
                <Tab label="My Records" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Global Registry" icon={<PublicIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            <Box sx={{ p: 2 }}>
              {loadingStats ? (
                <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>RECORD ID</TableCell>
                        <TableCell>{activityTab === 0 ? 'STUDENT' : 'ISSUER'}</TableCell>
                        <TableCell align="right">AUDIT</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeLogs.length === 0 ? (
                        <TableRow><TableCell colSpan={3} align="center" sx={{ py: 6, color: '#94a3b8', fontWeight: 600 }}>No matching records found in the registry.</TableCell></TableRow>
                      ) : (
                        activeLogs.map((row, i) => (
                          <TableRow key={i} sx={{ '&:hover': { background: '#f8fafc' } }}>
                            <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: '#1A0D0D', wordBreak: 'break-all', maxWidth: 200 }}>{row.id}</TableCell>
                            <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                {activityTab === 0 ? row.student.slice(0, 10) : row.institution.slice(0, 10)}...
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => viewOnExplorer(row.txHash)} sx={{ color: '#8B1D1D' }}>
                                <OpenInNewIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}