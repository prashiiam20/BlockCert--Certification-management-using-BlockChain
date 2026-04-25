import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { EthereumContext } from '../context/EthereumContext';
import { ethers } from 'ethers';
import axios from 'axios';
import { chacha20poly1305 } from '@noble/ciphers/chacha.js';
import { zlibSync } from 'fflate';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedIcon from '@mui/icons-material/Verified';
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt';
import { BarChart } from '@mui/x-charts/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PublicIcon from '@mui/icons-material/Public';
import LinkIcon from '@mui/icons-material/Link';
import BrandedQR from '../components/BrandedQR';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ─── Sub-component: PreviewCard (Sticky Draft) ──────────────────────────────
function PreviewCard({ data, file }) {
  return (
    <Card elevation={4} sx={{
      position: 'sticky',
      top: 100,
      borderRadius: '24px',
      border: '2px solid #E5E1D1',
      background: '#FCFBF7',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 2, background: '#8B1D1D', color: '#ffffff', textAlign: 'center' }}>
        <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '2px' }}>DRAFT PREVIEW</Typography>
      </Box>
      <CardContent sx={{ p: 4, textAlign: 'center' }}>
        <SchoolIcon sx={{ fontSize: 48, color: '#8B1D1D', mb: 2 }} />
        <Typography variant="h6" fontWeight={800} color="#1A0D0D" sx={{ mb: 1 }}>
          {data.studentName || 'Recipient Name'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 3 }}>
          {data.studentAddress ? `${data.studentAddress.slice(0, 10)}...${data.studentAddress.slice(-8)}` : '0x...'}
        </Typography>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Grid container spacing={2} sx={{ textAlign: 'left' }}>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>DEGREE</Typography>
            <Typography variant="body2" fontWeight={700}>{data.degree || '—'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>GPA / GRADE</Typography>
            <Typography variant="body2" fontWeight={700}>{data.gpa || '—'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary" fontWeight={800}>SECURE ATTACHMENT</Typography>
            <Typography variant="body2" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {file ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#2E5225' }} /> : null}
              {file ? file.name : 'No file selected'}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid #E5E1D1' }}>
          <Typography variant="caption" sx={{ color: '#A13D3D', fontWeight: 800 }}>
            CRYPTO STANDARD: CHACHA20-POLY1305
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

const steps = ['Identity', 'Academic Details', 'Secure Packaging'];

export default function IssueCertificate() {
  const { contract, account } = useContext(EthereumContext);
  const [activeStep, setActiveStep] = useState(0);
  const [stats, setStats] = useState({ totalIssued: 0, chartData: [] });
  const [loadingVolume, setLoadingVolume] = useState(true);

  // ─── Fetch Issuance Stats (Monthly Grid) ──────────────────────────────────
  const fetchStats = useCallback(async () => {
    if (!contract || !account) return;
    try {
      setLoadingVolume(true);
      const filter = contract.filters.CertificateIssued();
      const events = await contract.queryFilter(filter, 0, 'latest');

      const myEvents = events.filter(e => e.args.institution.toLowerCase() === account.toLowerCase());

      // Monthly Grouping (Last 6 Months)
      const monthlyCounts = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        monthlyCounts[monthKey] = 0;
      }

      const myEventsWithTime = await Promise.all(
        myEvents.map(async (e) => {
          const block = await e.getBlock();
          return { timestamp: block.timestamp };
        })
      );

      myEventsWithTime.forEach(e => {
        const d = new Date(e.timestamp * 1000);
        const monthKey = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        if (monthlyCounts.hasOwnProperty(monthKey)) {
          monthlyCounts[monthKey]++;
        }
      });

      const formattedChartData = Object.keys(monthlyCounts).map(label => ({
        month: label,
        count: monthlyCounts[label]
      }));

      setStats({
        totalIssued: myEvents.length,
        chartData: formattedChartData
      });
    } catch (err) {
      console.error('Error fetching issuance stats:', err);
    } finally {
      setLoadingVolume(false);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const [formData, setFormData] = useState({
    studentAddress: '',
    studentName: '',
    degree: '',
    gpa: '',
    expiryYears: '0' // 0 = Lifetime
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isStepValid = () => {
    if (activeStep === 0) return ethers.utils.isAddress(formData.studentAddress) && formData.studentName;
    if (activeStep === 1) return formData.degree && formData.gpa;
    if (activeStep === 2) return selectedFile;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (!selectedFile) throw new Error("Please select a document.");

      // 1. Preparation & Compression
      const arrayBuffer = await selectedFile.arrayBuffer();
      const rawUint8 = new Uint8Array(arrayBuffer);
      const compressedData = zlibSync(rawUint8);

      // 2. Cryptographic Key Generation (Institutional Registry Vault model)
      // The Registrar (Issuer) provides the master signature for all students.
      // This ensures the Institution (the Registrar) can always regenerate a student's key on demand.
      const derivationMessage = `[AcadVault Registry] Master Recovery Key for Student: ${formData.studentAddress.toLowerCase()}`;
      const signature = await contract.signer.signMessage(derivationMessage);
      const keyHash = ethers.utils.keccak256(signature);
      const key = ethers.utils.arrayify(keyHash);
      const hexDecryptionKey = keyHash.startsWith('0x') ? keyHash.substring(2) : keyHash;

      const nonce = new Uint8Array(12);
      window.crypto.getRandomValues(nonce);

      // 3. AEAD Encryption (ChaCha20-Poly1305)
      const chacha = chacha20poly1305(key, nonce);
      const ciphertext = chacha.encrypt(compressedData);

      // 4. Protocol Versioning Header (BCV2 Magic Marker)
      // We prepend [66, 67, 86, 50] to identify this as a "Vault-Enabled" record
      const magicMarker = new Uint8Array([66, 67, 86, 50]);
      const finalPayload = new Uint8Array(magicMarker.length + 12 + ciphertext.length);
      finalPayload.set(magicMarker, 0);
      finalPayload.set(nonce, magicMarker.length);
      finalPayload.set(ciphertext, magicMarker.length + 12);

      const encryptedBlob = new Blob([finalPayload], { type: 'application/octet-stream' });
      const encryptedFile = new File([encryptedBlob], `${selectedFile.name}.encrypted`, { type: 'application/octet-stream' });

      // 5. IPFS Anchoring
      const pinataData = new FormData();
      pinataData.append('file', encryptedFile);

      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", pinataData, {
        headers: { 'Authorization': `Bearer ${process.env.REACT_APP_PINATA_JWT}` }
      });

      const generatedCID = res.data.IpfsHash;

      // 5. Blockchain Registration (With Metadata Header)
      const certHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(formData.studentAddress + generatedCID + Date.now())
      );

      const expiryDate = formData.expiryYears === '0'
        ? 0
        : Math.floor(Date.now() / 1000) + (parseInt(formData.expiryYears) * 365 * 24 * 60 * 60);

      const tx = await contract.issueCertificate(
        generatedCID,
        certHash,
        formData.studentAddress,
        expiryDate
      );

      // ── Optimistic UI: Show success immediately after broadcast ──
      // The transaction is now in the mempool. Show the user instant feedback
      // while the blockchain confirms it in the background (~12-15s on Sepolia).
      setLoading(false);
      setResult({
        certId: ethers.utils.keccak256(
          ethers.utils.defaultAbiCoder.encode(
            ['bytes32', 'address', 'uint256'],
            [certHash, formData.studentAddress, Math.floor(Date.now() / 1000)]
          )
        ),
        txHash: tx.hash,
        gasUsed: 'Confirming…',
        decryptionKey: hexDecryptionKey,
        isVaultBacked: true,
        confirming: true
      });

      // Background confirmation — updates gasUsed silently
      tx.wait().then((receipt) => {
        const eventSignature = "CertificateIssued(bytes32,address,address)";
        const eventTopic = ethers.utils.id(eventSignature);

        let certId;
        try {
          const log = receipt.logs.find(l => l.topics[0].toLowerCase() === eventTopic.toLowerCase());
          if (log) {
            certId = log.topics[1];
          } else {
            const event = receipt.events?.find(e => e.event === 'CertificateIssued');
            certId = event ? event.args.certId : receipt.logs[0].topics[1];
          }
        } catch (logErr) {
          console.error("Log Parsing Error:", logErr);
          certId = receipt.logs[0].topics[1];
        }

        setResult(prev => ({
          ...prev,
          certId: certId || prev.certId,
          gasUsed: receipt.gasUsed.toString(),
          confirming: false
        }));
      }).catch(err => {
        console.error("Confirmation error:", err);
        setResult(prev => ({ ...prev, gasUsed: 'Confirmation failed', confirming: false }));
      });

      return; // Skip the finally block's setLoading(false)
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  if (result) {
    const shareableUrl = `${window.location.protocol}//${window.location.host}/verify?id=${result.certId}#key=${result.decryptionKey}`;

    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Fade in={true}>
          <Box>
            {/* ─── Success Banner ──────────────────────────────── */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 2, mb: 2.5,
              p: 2.5, borderRadius: '16px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '1px solid #86efac',
            }}>
              <Avatar sx={{ bgcolor: '#166534', color: '#fff', width: 52, height: 52 }}>
                <VerifiedIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={800} color="#166534" sx={{ lineHeight: 1.2 }}>
                  Issuance Successful
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                  Record anchored immutably on-chain  •  Gas Used: {result.gasUsed}
                </Typography>
              </Box>
              <Chip label="VAULT-SECURED" size="small" icon={<SecurityIcon style={{ color: '#166534', fontSize: 14 }} />}
                sx={{ bgcolor: '#fff', color: '#166534', fontWeight: 800, border: '2px solid #166534' }} />
            </Box>

            {/* ─── Main Content: Left + Right (Flexbox) ────────── */}
            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>

              {/* ── LEFT COLUMN ────────────────────────────────── */}
              <Box sx={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>

                {/* Decryption Key */}
                <Card elevation={0} sx={{ p: 2, borderRadius: '14px', background: '#1A0D0D', color: '#fff' }}>
                  <Typography sx={{ color: '#A13D3D', fontWeight: 800, letterSpacing: '0.5px', fontSize: '0.7rem', textTransform: 'uppercase' }}>
                    🔒 Master Decryption Key — Do Not Share
                  </Typography>
                  <Typography sx={{
                    mt: 0.8, fontFamily: 'monospace', fontSize: '0.73rem',
                    fontWeight: 600, wordBreak: 'break-all', lineHeight: 1.5, color: '#E5E1D1',
                  }}>
                    {result.decryptionKey}
                  </Typography>
                  <Button size="small" startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                    onClick={() => handleCopy(result.decryptionKey)}
                    sx={{ mt: 0.5, color: '#A13D3D', fontWeight: 700, fontSize: '0.75rem', p: 0.5 }}
                  >
                    {copied ? 'COPIED ✓' : 'COPY KEY'}
                  </Button>
                </Card>

                {/* On-Chain Record */}
                <Card elevation={0} sx={{ p: 2, borderRadius: '14px' }}>
                  <Typography sx={{ color: 'primary.main', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.5 }}>
                    On-Chain Record
                  </Typography>
                  {[
                    { label: 'Certificate ID', value: result.certId },
                    { label: 'Transaction Hash', value: result.txHash },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ mb: 1.2 }}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                        {label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#FCFBF7', borderRadius: '8px', px: 1.2, py: 0.6, border: '1px solid #E5E1D1' }}>
                        <Typography sx={{
                          fontFamily: 'monospace', fontSize: '0.7rem', fontWeight: 600, color: '#1A0D0D',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                        }}>
                          {value}
                        </Typography>
                        <Button size="small" onClick={() => handleCopy(value)}
                          sx={{ minWidth: 0, p: 0.3, color: 'text.secondary', flexShrink: 0 }}>
                          <ContentCopyIcon sx={{ fontSize: 13 }} />
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1.5 }} />

                  {/* Shareable Link */}
                  <Box sx={{ p: 1.5, bgcolor: '#FCFBF7', borderRadius: '10px', border: '1px solid #E5E1D1' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <PublicIcon sx={{ fontSize: 15, color: 'primary.main' }} />
                        <Typography sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'primary.main', textTransform: 'uppercase' }}>
                          One-Tap Shareable Link
                        </Typography>
                      </Box>
                      <Button size="small" variant="contained" startIcon={<LinkIcon sx={{ fontSize: 13 }} />}
                        onClick={() => handleCopy(shareableUrl)}
                        sx={{ fontWeight: 700, fontSize: '0.68rem', py: 0.3, px: 1, borderRadius: '8px', whiteSpace: 'nowrap' }}
                      >
                        {copied ? 'COPIED ✓' : 'COPY LINK'}
                      </Button>
                    </Box>
                    <Typography sx={{
                      fontFamily: 'monospace', fontSize: '0.6rem', color: '#6B5858',
                      wordBreak: 'break-all', lineHeight: 1.4, mt: 0.8,
                    }}>
                      {shareableUrl.length > 100 ? shareableUrl.slice(0, 100) + '...' : shareableUrl}
                    </Typography>
                  </Box>
                </Card>
              </Box>

              {/* ── RIGHT COLUMN: QR ──────────────────────────── */}
              <Box sx={{ flex: '0 0 285px', mt: 1.5 }}>
                <Card elevation={0} sx={{
                  p: 2.5, borderRadius: '16px', textAlign: 'center',
                  border: '2px solid #8B1D1D', position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  {/* Chip sits on top border — mt:1.5 on parent gives it room */}
                  <Chip
                    label="SHARE WITH STUDENT"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                      fontWeight: 800, borderRadius: '6px', fontSize: '0.65rem',
                      whiteSpace: 'nowrap',
                    }}
                  />

                  <OfflineBoltIcon sx={{ color: '#8B1D1D', fontSize: 24, mb: 0.3 }} />
                  <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#1A0D0D', lineHeight: 1.2 }}>
                    Universal Verification Token
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontSize: '0.67rem' }}>
                    Scan for instant verification with embedded key
                  </Typography>

                  <BrandedQR certId={result.certId} decryptionKey={result.decryptionKey} size={170} />

                  <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={`ID: ${result.certId.slice(0, 10)}…`} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 22 }} />
                    <Chip label="ZK Fragment" color="secondary" size="small" sx={{ fontSize: '0.6rem', height: 22 }} />
                  </Box>

                  <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block', fontStyle: 'italic', fontSize: '0.6rem' }}>
                    Key in URL fragment — never sent to server
                  </Typography>

                  <Divider sx={{ my: 1.5, width: '100%' }} />

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => window.location.reload()}
                    startIcon={<AssessmentIcon sx={{ fontSize: 15 }} />}
                    sx={{ fontWeight: 700, fontSize: '0.72rem', borderRadius: '10px', px: 2, py: 0.7 }}
                  >
                    Issue Another
                  </Button>
                </Card>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* ── Always side-by-side flex layout ─────────────────── */}
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

        {/* ── LEFT: Header + Stepper + Form ───────────────────── */}
        <Box sx={{ flex: '1 1 0', minWidth: 0 }}>
          {/* Header row */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-1px', color: '#1A0D0D' }}>
                Issuance Portal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Academic Registry & Secure Cryptographic Deployment
              </Typography>
            </Box>
            <Box sx={{
              p: 1.5, bgcolor: '#FCFBF7', borderRadius: '14px',
              border: '1px solid #E5E1D1', display: 'flex', alignItems: 'center', gap: 1.5,
            }}>
              <Avatar sx={{ bgcolor: '#8B1D1D', width: 40, height: 40 }}>
                <AssessmentIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#A13D3D', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>
                  Total Volume
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1A0D0D', lineHeight: 1 }}>
                  {loadingVolume ? '…' : stats.totalIssued}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E5E1D1', background: '#ffffff' }}>
            {activeStep === 0 && (
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <PersonIcon color="primary" />
                    <Typography variant="h6" fontWeight={800}>Participant Identity</Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>STUDENT FULL NAME</Typography>
                  <TextField
                    fullWidth
                    placeholder="e.g., John Doe"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    sx={{ mb: 3 }}
                  />
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>ETHEREUM WALLET ADDRESS</Typography>
                  <TextField
                    fullWidth
                    placeholder="0x..."
                    value={formData.studentAddress}
                    onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
                    error={formData.studentAddress && !ethers.utils.isAddress(formData.studentAddress)}
                    helperText={formData.studentAddress && !ethers.utils.isAddress(formData.studentAddress) ? "Invalid Address" : ""}
                  />
                </Box>
              </Fade>
            )}

            {activeStep === 1 && (
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <AssignmentIcon color="primary" />
                    <Typography variant="h6" fontWeight={800}>Academic Details</Typography>
                  </Box>
                  <Grid container spacing={2.5}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>DEGREE PROGRAM</Typography>
                      <TextField fullWidth placeholder="Bachelor of Technology in CS"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>GPA / GRADE</Typography>
                      <TextField fullWidth placeholder="e.g., 9.8 / 10"
                        value={formData.gpa}
                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>EXPIRY (YEARS)</Typography>
                      <TextField fullWidth type="number" placeholder="0 for Lifetime"
                        value={formData.expiryYears}
                        onChange={(e) => setFormData({ ...formData, expiryYears: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            )}

            {activeStep === 2 && (
              <Fade in={true}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6" fontWeight={800}>Secure Packaging</Typography>
                  </Box>
                  <Box sx={{
                    p: 4, border: '2px dashed #D1CBB1', borderRadius: '16px',
                    textAlign: 'center', mb: 3,
                    bgcolor: selectedFile ? '#fdf2f2' : '#FCFBF7',
                    cursor: 'pointer', '&:hover': { borderColor: '#8B1D1D' }
                  }} component="label">
                    <input type="file" hidden onChange={(e) => setSelectedFile(e.target.files[0])} />
                    <CloudUploadIcon sx={{ fontSize: 42, color: '#D1CBB1', mb: 1.5 }} />
                    <Typography variant="body1" fontWeight={700}>
                      {selectedFile ? selectedFile.name : 'Select Final Document'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">PDF or Image Format</Typography>
                  </Box>
                  <List sx={{ bgcolor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <ListItem>
                      <ListItemIcon><VerifiedIcon sx={{ color: '#2E5225' }} /></ListItemIcon>
                      <ListItemText primary="Client-Side ZLib Compression" secondary="Active" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon sx={{ color: '#2E5225' }} /></ListItemIcon>
                      <ListItemText primary="ChaCha20-Poly1305 (256-bit)" secondary="Ready" />
                    </ListItem>
                  </List>
                </Box>
              </Fade>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button disabled={activeStep === 0 || loading} onClick={handleBack}>Back</Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" onClick={handleSubmit}
                  disabled={!isStepValid() || loading}
                  sx={{ fontWeight: 800, px: 5 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm & Deploy'}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}
                  disabled={!isStepValid()}
                  sx={{ fontWeight: 800, px: 5 }}>
                  Continue
                </Button>
              )}
            </Box>
          </Paper>

          {/* Moved: Institutional Issuance Trends */}
          <Card elevation={0} sx={{ border: '1px solid #E5E1D1', borderRadius: '20px', mt: 3, background: '#FCFBF7' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ mb: 2, fontWeight: 800, color: '#8B1D1D', display: 'flex', alignItems: 'center', gap: 1, fontSize: '1rem' }}>
                <AssessmentIcon sx={{ fontSize: 20 }} /> Institutional Issuance Trends
              </Typography>
              {loadingVolume ? (
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 200, width: '100%' }}>
                  <BarChart
                    dataset={stats.chartData}
                    xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'count', color: '#8B1D1D', label: 'Certificates' }]}
                    height={200}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* ── RIGHT: Preview — fixed width, always visible ── */}
        <Box sx={{ flex: '0 0 360px', position: 'sticky', top: 80 }}>
          <PreviewCard data={formData} file={selectedFile} />
          {error && <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{error}</Alert>}
        </Box>

      </Box>
    </Container>
  );
}
