import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: '#ffffff', 
        borderTop: '1px solid #E5E1D1',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 6 }}>
          
          {/* Brand & About */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{
                width: 36, height: 36, borderRadius: '8px',
                background: '#8B1D1D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SchoolIcon sx={{ color: '#ffffff', fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1A0D0D', letterSpacing: '-0.5px' }}>
                AcadVault
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#4B3F3F', lineHeight: 1.7, mb: 3, maxWidth: '90%' }}>
              A decentralized academic credential registry providing immutable, cryptographically verifiable, and privacy-preserving degree issuance for modern educational institutions.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#4B3F3F', '&:hover': { color: '#8B1D1D', bgcolor: '#F5ECEC' } }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#4B3F3F', '&:hover': { color: '#8B1D1D', bgcolor: '#F5ECEC' } }}>
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: '#4B3F3F', '&:hover': { color: '#8B1D1D', bgcolor: '#F5ECEC' } }}>
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A0D0D', mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['Dashboard', 'Issuance Portal', 'Revocation Hub'].map((text) => (
                <Link key={text} href="#" underline="none" sx={{ color: '#4B3F3F', fontSize: '0.85rem', '&:hover': { color: '#8B1D1D' }, transition: 'color 0.2s' }}>
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A0D0D', mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Research & Docs
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['IEEE Research Paper', 'Smart Contract Audits', 'API Documentation', 'Open Source Node Viewer'].map((text) => (
                <Link key={text} href="#" underline="none" sx={{ color: '#4B3F3F', fontSize: '0.85rem', '&:hover': { color: '#8B1D1D' }, transition: 'color 0.2s' }}>
                  {text}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1A0D0D', mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Institutional Contact
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MailOutlineIcon sx={{ color: '#8B1D1D', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#4B3F3F', fontWeight: 600 }}>
                  registrar@acadvault.edu
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#4B3F3F', lineHeight: 1.6 }}>
                Office of the Global Academic Registrar, Web3 Deployment Division.
              </Typography>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ mb: 3 }} />

        {/* Legal Bottom Bar */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: '#888' }}>
            © {new Date().getFullYear()} AcadVault Protocol. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" underline="none" sx={{ color: '#888', fontSize: '0.75rem', '&:hover': { color: '#4B3F3F' } }}>
              Privacy Policy
            </Link>
            <Link href="#" underline="none" sx={{ color: '#888', fontSize: '0.75rem', '&:hover': { color: '#4B3F3F' } }}>
              Terms of Service
            </Link>
            <Link href="#" underline="none" sx={{ color: '#888', fontSize: '0.75rem', '&:hover': { color: '#4B3F3F' } }}>
              Cookie Settings
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
