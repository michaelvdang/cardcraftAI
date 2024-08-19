import React from 'react'
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <>
    <AppBar position="static" sx={{backgroundColor: 'black'}}>
      <Toolbar>
        <Typography variant="h6" sx={{flexGrow: 1}}>
          Flashcard SaaS
        </Typography>
        <Button sx={{ border: '2px solid white', ":hover": {backgroundColor: '#777777'}, marginRight: 2}}  color="inherit" href="/sign-up">Sign Up</Button>
      </Toolbar>
    </AppBar>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{textAlign: 'center', my: 4}}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>
      <SignIn />
    </Box>
    </>
  )
}