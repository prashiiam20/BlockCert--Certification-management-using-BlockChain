import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import ShieldIcon from '@mui/icons-material/Shield';

/**
 * Universal Managed Certificate Viewer
 * Separates "Viewing" from "Downloading" for professional document management.
 */
export default function CertificateViewer({ open, onClose, certData, metadata }) {
  if (!certData) return null;

  const formatDate = (dateInput) => {
    if (!dateInput) return '—';
    try {
        let timestampVal;
        
        // Handle Ethers BigNumber
        if (dateInput && typeof dateInput === 'object' && dateInput._isBigNumber) {
            timestampVal = dateInput.toNumber();
        } else if (typeof dateInput === 'string' && dateInput.startsWith('0x')) {
            // Hex string fallback
            timestampVal = parseInt(dateInput, 16);
        } else {
            timestampVal = Number(dateInput);
        }

        if (isNaN(timestampVal) || timestampVal === 0) return 'Pending...';
        
        // If timestamp is in seconds (10 digits), convert to ms
        let finalMs = timestampVal;
        if (timestampVal.toString().length <= 10) finalMs *= 1000;
        
        return new Date(finalMs).toLocaleDateString(undefined, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (e) {
        console.error('Date parsing error:', e, dateInput);
        return 'Not Available';
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>BlockCert - Document Receipt</title>
          <style>
            body { font-family: sans-serif; padding: 40px; text-align: center; }
            .frame { border: 20px solid #f1f5f9; padding: 40px; }
            img, iframe { max-width: 100%; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="frame">
            <h2>OFFICIAL BLOCKCERT CREDENTIAL</h2>
            <p>ID: ${metadata.id}</p>
            ${certData.type.startsWith('image/') 
              ? `<img src="${certData.url}" />` 
              : `<iframe src="${certData.url}" width="100%" height="600px"></iframe>`}
            <p>Issued by: ${metadata.institution}</p>
          </div>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = certData.url;
    link.download = `BlockCert_${metadata.id.slice(0, 8)}.${certData.type.split('/')[1] || 'asset'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: '24px' } }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ShieldIcon sx={{ color: '#8B1010' }} />
          <Box>
            <Typography variant="h6" fontWeight={800}>Protocol Managed Viewer</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Secured Asset Preview • ID: {metadata.id.slice(0, 16)}...</Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </Box>
      <Divider />
      
      <DialogContent sx={{ p: 4, background: '#ffffff', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: '900px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          {certData.type.startsWith('image/') ? (
            <img src={certData.url} alt="Certificate Asset" style={{ width: '100%', height: 'auto', display: 'block' }} />
          ) : (
            <iframe src={certData.url} title="Certificate Preview" width="100%" height="600px" style={{ border: 'none' }} />
          )}
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center', width: '100%' }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px' }}>
                Registry Verification Data
            </Typography>
            <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 1 }}>
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>ISSUER</Typography>
                    <Typography variant="subtitle2" fontWeight={700}>{metadata.institution.slice(0, 12)}...</Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ display: 'block', color: '#64748b' }}>ISSUE DATE</Typography>
                    <Typography variant="subtitle2" fontWeight={700}>{formatDate(metadata.date)}</Typography>
                </Box>
            </Stack>
        </Box>
      </DialogContent>
      
      <Divider />
      <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', justifyContent: 'space-between' }}>
        <Button startIcon={<PrintIcon />} onClick={handlePrint} sx={{ fontWeight: 800 }}>Print Receipt</Button>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="text" onClick={onClose} sx={{ fontWeight: 800, color: '#64748b' }}>Close Preview</Button>
            <Button 
                variant="contained" 
                startIcon={<DownloadForOfflineIcon />} 
                onClick={handleDownload}
                sx={{ fontWeight: 900, px: 4, borderRadius: '12px' }}
            >
                Download Official Asset
            </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
