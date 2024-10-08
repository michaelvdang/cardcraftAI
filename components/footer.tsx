'use client'
import React from 'react'
import { AppBar, Box, Grid, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const Footer = () => {
  const path = usePathname();

  // if (path === '/generate') return null;
  return (
  <Box
    // height='100px'
    // backgroundColor='white'
    // mt={'auto'}
    // sx={{height: '100px', backgroundColor: 'white', mt: 'auto'}}
  >
    <Box
      // height={{xs: '50px', md: '200px'}}
      padding={5}
      color={'white'}
      sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000bb', backdropFilter: 'blur(25px)'}}
    >
      <Box
        maxWidth='xl'
        width={'100%'}
        sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', 
        }}
      >
        <Grid container spacing={5} justifyContent="center">

          {/* Useful Links */}
          <Grid item xs={12} sm={4} sx={{ alignItems: {xs: 'center', sm: 'flex-start'}, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="inherit" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/#features" color="inherit">
                Features
              </Link>
              <Link href="/#pricing" color="inherit">
                Pricing
              </Link>
              {/* <Link href="#" color="inherit">
                FAQ
              </Link>
              <Link href="#" color="inherit">
                Blog
              </Link> */}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} sm={4} sx={{ alignItems: {xs: 'center', sm: 'flex-start'}, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="inherit" gutterBottom>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="https://linkedin.com/in/michael-v-dang" color="inherit">LinkedIn</Link>
              <Link href="mailto:michaeldangv@gmail.com" color="inherit">Email</Link>
              <Link href="https://github.com/michaelvdang/" color="inherit">Github</Link>
            </Box>
          </Grid>

          {/* Company Information */}
          <Grid item xs={12} sm={4} sx={{ alignItems: {xs: 'center', sm: 'flex-start'}, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="h6" color="inherit" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="inherit" textAlign={{xs: 'center', sm: 'left'}}>
              Our mission is to make learning fun and effective through interactive flashcards.
            </Typography>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ marginTop: '40px', textAlign: 'center' }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} CardCraft AI. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
  )
}

export default Footer