'use client'
import Image from "next/image";
import styles from "./page.module.css";

import { Inter } from "next/font/google";
import { AppBar, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import { getStripe } from "../utils/get-stripe";
import { SignedIn, SignedOut, UserButton, SignInButton, SignInWithMetamaskButton, useUser, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";

export default function Home() {
  const { user } = useUser()
  const { getToken, userId } = useAuth()

  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' })

    const userCredentials = await signInWithCustomToken(auth, token || '')
    // The userCredentials.user object can call the methods of
    // the Firebase platform as an authenticated user.
    console.log('User:', userCredentials.user)
  }

  useEffect(() => {
    if (!user) return
    console.log('signing into firebase with clerk')
    signIntoFirebaseWithClerk()
  }, [user])
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }
  
  return (
    <>

    {/* App Bar */}
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{flexGrow: 1}}>
          Flashcard SaaS
        </Typography>
        <SignedOut>
          <SignInButton />
          <SignInWithMetamaskButton />
          <Button color="inherit" href="/sign-in">Login</Button>
          <Button color="inherit" href="/sign-up">Sign Up</Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </Toolbar>
    </AppBar>

    {/* Hero */}
    <Box sx={{textAlign: 'center', my: 4}}>
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to Flashcard SaaS
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        The easiest way to create flashcards from your text.
      </Typography>
      <Button variant="contained" color="primary" sx={{mt: 2, mr: 2}} href="/generate">
        Get Started
      </Button>
      <Button variant="outlined" color="primary" sx={{mt: 2}}>
        Learn More
      </Button>
    </Box>

    {/* Features */}
    <Box sx={{my: 6}}>
      <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
      <Grid container spacing={4}>
        {/* Feature items */}
      </Grid>
    </Box>

    {/* Pricing section */}
    <Box sx={{my: 6, textAlign: 'center'}}>
      <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
      <Grid container spacing={4} justifyContent="center">
        {/* Pricing plans */}
      </Grid>
    </Box>
    </>
  );
}
