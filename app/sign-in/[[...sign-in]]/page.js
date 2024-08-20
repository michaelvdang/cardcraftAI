'use client'
import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/header'

export default function SignInPage() {

  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  
  return (
    <>
    <Header />
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{textAlign: 'center', my: 4}}
    >
      {/* Page Title and Subtitle */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Sign In
        </Typography>
      </Box>
      <SignIn fallbackRedirectUrl={redirectTo} />
    </Box>
    </>
  )
}