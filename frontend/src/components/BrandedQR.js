import React, { useRef } from 'react';
import { Box, Button } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

/**
 * Universal Branded QR Component
 * @param {string} certId - The blockchain certificate ID
 * @param {number} size - Pixel size of the QR
 */
export default function BrandedQR({ certId, decryptionKey, size = 180 }) {
  const qrRef = useRef();
  
  // Generate the deep-link based on the current domain
  let verifyUrl = `${window.location.protocol}//${window.location.host}/verify?id=${certId}`;
  if (decryptionKey) {
    verifyUrl += `#key=${decryptionKey}`;
  }

  const downloadQR = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = size * 2; // High res
      canvas.height = size * 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `AcadVault_QR_${certId.slice(0, 8)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <Box ref={qrRef} sx={{ position: 'relative', display: 'inline-block' }}>
        <Box 
          sx={{ 
            p: 1.5, 
            background: '#ffffff', 
            display: 'inline-block', 
            borderRadius: '16px', 
            border: '2px solid #8B1D1D',
            boxShadow: '0 8px 24px rgba(139, 29, 0, 0.08)'
          }}
        >
          <QRCodeSVG
            value={verifyUrl}
            size={size}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: "https://cdn-icons-png.flaticon.com/512/3233/3233514.png",
              height: size * 0.22,
              width: size * 0.22,
              excavate: true,
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 1.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
          onClick={downloadQR}
          sx={{ fontWeight: 800, borderRadius: '8px', fontSize: '0.7rem', px: 1.5 }}
        >
          PNG
        </Button>
        <Button 
          size="small" 
          variant="outlined"
          color="secondary"
          startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
          onClick={copyLink}
          sx={{ fontWeight: 800, borderRadius: '8px', fontSize: '0.7rem', px: 1.5 }}
        >
          Link
        </Button>
      </Box>
    </Box>
  );
}
