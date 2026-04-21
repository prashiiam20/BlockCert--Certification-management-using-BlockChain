import React, { useState, useContext } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import GppBadIcon from '@mui/icons-material/GppBad';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { EthereumContext } from '../context/EthereumContext';
import { NETWORKS } from '../config/contracts';

export default function RevokeCertificate() {
  const { contract, network } = useContext(EthereumContext);
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState('');

  const isValidId = certId.startsWith('0x') && certId.length === 66;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!isValidId) {
        throw new Error('Invalid Certificate ID format — must be a 66-character hex string starting with 0x.');
      }
      const tx = await contract.revokeCertificate(certId);
      const receipt = await tx.wait();
      setResult({ certId, txHash: tx.hash, gasUsed: receipt.gasUsed.toString() });
      setCertId('');
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const viewOnExplorer = (hash) => {
    const explorer = NETWORKS[network]?.blockExplorer;
    if (explorer) window.open(`${explorer}/tx/${hash}`, '_blank');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* ─── Page Header ──────────────────────────────────────── */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }} className="animate-fade-in-up">
        <Box sx={{
          width: 48, height: 48, borderRadius: '12px',
          background: '#FFF5F5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(139,29,29,0.15)',
          boxShadow: '0 4px 12px rgba(139,29,29,0.05)'
        }}>
          <GppBadIcon sx={{ color: '#8B1D1D', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#1A0D0D', lineHeight: 1.1 }}>
            Revocation Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
            Credential Invalidation Protocol
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4} alignItems="flex-start">
        {/* ─── Left: Action Panel ───────────────────────────────── */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: '20px', border: '1px solid #E5E1D1', background: '#ffffff' }} className="animate-fade-in-up">
            
            {/* Danger Zone Banner */}
            <Box sx={{
              display: 'flex', gap: 2, alignItems: 'flex-start',
              p: 3, borderRadius: '12px',
              background: '#FFF0F0', border: '1px solid #FFCACA', mb: 5,
            }}>
              <WarningAmberIcon sx={{ color: '#D32F2F', fontSize: 28, mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#B71C1C', fontWeight: 800, mb: 0.5, letterSpacing: '-0.2px' }}>
                  Danger Zone: Irreversible Action
                </Typography>
                <Typography variant="body2" sx={{ color: '#C62828', lineHeight: 1.6 }}>
                  Revoking a certificate permanently invalidates it on the Ethereum registry.
                  Once this transaction is confirmed on-chain, the credential will instantly fail all future verification checks across the globe. This cannot be undone.
                </Typography>
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 800, color: '#1A0D0D' }}>
                TARGET CERTIFICATE ID
              </Typography>
              <TextField
                fullWidth
                value={certId}
                onChange={(e) => { setCertId(e.target.value); setError(null); }}
                placeholder="0x..."
                error={certId.length > 0 && !isValidId}
                helperText={
                  certId.length > 0 && !isValidId
                    ? 'Must be a 66-character hex string starting with 0x'
                    : certId.length > 0 && isValidId
                    ? '✓ Valid certificate ID format detected'
                    : 'Enter the 0x-prefixed certificate ID from the issuance record'
                }
                sx={{
                  mb: 4,
                  '& .MuiOutlinedInput-root': { borderRadius: '12px' },
                  '& .MuiFormHelperText-root': {
                    color: certId.length > 0 && isValidId ? '#2E5225' : undefined,
                    fontWeight: certId.length > 0 && isValidId ? 600 : 400,
                  },
                }}
                inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.95rem', padding: '16px' } }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || !isValidId}
                sx={{
                  py: 1.75,
                  fontWeight: 800,
                  fontSize: '1rem',
                  letterSpacing: '0.5px',
                  backgroundColor: '#8B1D1D',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(139,29,29,0.2)',
                  transition: 'all 0.2s',
                  '&:hover': { backgroundColor: '#6B1616', transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(139,29,29,0.3)' },
                  '&:disabled': { backgroundColor: '#F5ECEC', color: '#BCAAAA', boxShadow: 'none', transform: 'none' },
                }}
              >
                {loading
                  ? <><CircularProgress size={20} color="inherit" sx={{ mr: 1.5 }} /> Committing to Blockchain…</>
                  : 'Permanently Revoke Credential'
                }
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 4, borderRadius: '10px' }}>{error}</Alert>
            )}
          </Paper>
        </Grid>

        {/* ─── Right: Info + Result ─────────────────────────────── */}
        <Grid item xs={12} md={5}>
          {/* Protocol Info Card */}
          <Card elevation={0} sx={{ mb: 3, background: '#FCFBF7', border: '1px solid #E5E1D1', borderRadius: '20px' }} className="animate-fade-in-up stagger-1">
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#1A0D0D', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontSize: '1.1rem', letterSpacing: '-0.3px' }}>
                Protocol Specifications
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Authorization', value: 'Issuing institution only' },
                  { label: 'On-Chain Mutation', value: 'cert.revoked = true' },
                  { label: 'Network Consensus', value: 'Returns INVALID immediately' },
                  { label: 'Reversibility Status', value: 'Permanent / Immutable' },
                  { label: 'Data Retention', value: 'Metadata persists securely' },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#666', fontWeight: 600 }}>{label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#8B1D1D', bgcolor: '#F5ECEC', px: 1.5, py: 0.5, borderRadius: '6px' }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Success Result Card */}
          {result && (
            <Card elevation={0} sx={{ border: '2px solid #2E5225', background: '#F5FDF7', borderRadius: '20px' }} className="animate-fade-in">
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircleOutlineIcon sx={{ color: '#2E5225', fontSize: 26 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E5225', letterSpacing: '-0.5px' }}>
                      Status Updated
                    </Typography>
                  </Box>
                  <Chip label="REVOKED" size="small" sx={{ backgroundColor: '#2E5225', color: '#fff', fontWeight: 800, px: 1 }} />
                </Box>

                <Typography variant="body2" sx={{ color: '#4B3F3F', mb: 3, lineHeight: 1.6 }}>
                  The certificate has been successfully marked as revoked on the smart contract. It will now consistently fail verification checks.
                </Typography>

                <Box sx={{ background: '#ffffff', border: '1px solid rgba(46,82,37,0.2)', borderRadius: '12px', p: 2, mb: 3 }}>
                  {[
                    { label: 'Target ID', value: result.certId },
                    { label: 'Network Tx', value: result.txHash },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ mb: label === 'Target ID' ? 2 : 0 }}>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>{label}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#1A0D0D', fontWeight: 600, flex: 1, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {value}
                        </Typography>
                        <Button size="small" onClick={() => copy(value, label)} sx={{ minWidth: 0, p: 0.5, color: copied === label ? '#2E5225' : '#888' }}>
                          <ContentCopyIcon sx={{ fontSize: 16 }} />
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<OpenInNewIcon sx={{ fontSize: 18 }} />}
                  onClick={() => viewOnExplorer(result.txHash)}
                  sx={{ py: 1.5, fontWeight: 700, fontSize: '0.9rem', bgcolor: '#2E5225', borderRadius: '10px', textTransform: 'none', '&:hover': { bgcolor: '#1e3817' } }}
                >
                  Verify Transaction on Explorer
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
