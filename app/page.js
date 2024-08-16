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
import { useRouter } from "next/navigation";
import Pricing from "@/components/pricing";

export default function Home() {
  const { user } = useUser()
  const { getToken, userId } = useAuth()
  const router = useRouter();

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
    const checkoutSession = await fetch('/api/checkout-sessions', {
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

  const handleProPlanClick = () => {
    // router.push('https://buy.stripe.com/28o8yO9G5bY8cBW288');
    router.push('https://buy.stripe.com/test_aEU7sHbTAba7eJO4gg');
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
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" component="h2" gutterBottom>Features</Typography>
      <Grid container spacing={4}>
        {/* Feature 1: Content Input */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Content Input
            </Typography>
            <Typography variant="body1">
              Enter your content, and our platform will automatically generate a set of flashcards for you. Whether it's for studying, revision, or learning new topics, the generated flashcards are optimized for your needs.
            </Typography>
          </Box>
        </Grid>

        {/* Feature 2: Cloud Firestore Storage */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Cloud Storage
            </Typography>
            <Typography variant="body1">
              All your flashcard sets are securely stored in Cloud Firestore, ensuring that your learning materials are always accessible, no matter the device you're using.
            </Typography>
          </Box>
        </Grid>

        {/* Feature 3: Pro User Access */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Pro User Access
            </Typography>
            <Typography variant="body1">
              As a Pro user, you'll have access to flashcard sets created by other free users. Expand your learning resources and discover new content by browsing shared flashcard sets.
            </Typography>
          </Box>
        </Grid>

        {/* Feature 4: Automatic Flashcard Generation */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, borderRadius: '8px', height: '100%' }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Automatic Flashcard Generation
            </Typography>
            <Typography variant="body1">
              Save time with our automatic flashcard generation feature. Just input your content, and the platform will create effective flashcards tailored to your learning goals.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>

    {/* Pricing section */}
    {/* <Box
      sx={{
        my: 6,
        width: 500,
        backgroundColor: 'white'
        // display: 'flex',
        // flexDirection: 'column',
        // alignItems: 'center',
      }}
    >
      <Pricing />
    </Box> */}
    <Box sx={{ my: 6, textAlign: 'center' }}>
      <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
      <Grid container spacing={4} justifyContent="center">
        
        <Grid item xs={12} lg={4}>
          <Box sx={{ p: 3, borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h5" component="h3" gutterBottom>Starter</Typography>
            <Typography variant="h6" color="textTertiary" gutterBottom>
              $0 / month
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#6c757d',  // Light gray color for visibility on dark background
                  color: '#ffffff',            // White text color for contrast
                  border: '1px solid #6c757d', // Matching border color
                  '&:hover': {
                    backgroundColor: '#5a6268', // Slightly darker gray for hover effect
                  },
                  '&:disabled': {
                    backgroundColor: '#6c757d', // Maintain same color when disabled
                    color: '#ffffff',           // White text color when disabled
                  }
                }}
                disabled
                onClick={() => {router.push('/checkout?plan=free')}}
              >
                Current
              </Button>
            </Box>
            <Typography variant="body1">
              - Create and save flashcards<br/>
              - Access basic flashcard features<br/>
              - Limited storage for flashcard sets
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ p: 3, borderRadius: '8px', textAlign: 'center', border: '2px solid #00796b' }}>
            <Typography variant="h5" component="h3" gutterBottom>Pro</Typography>
            <Typography variant="h6" color="textTertiary" gutterBottom>
              $9.99 / month
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
            >
              <Button 
                variant="contained" 
                color="primary" 
                sx={{
                  justifySelf: 'center',
                }}
                onClick={handleProPlanClick}
                // onClick={() => {router.push('/checkout?plan=pro')}}
              >
                Choose Pro
              </Button>
            </Box>
            <Typography variant="body1">
              - All features in Free Plan<br/>
              - Access to other users' flashcard sets<br/>
              - Enhanced storage and management tools<br/>
              - Priority customer support
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ p: 3, borderRadius: '8px', textAlign: 'center' }}>
            <Typography variant="h5" component="h3" gutterBottom>Ultimate</Typography>
            <Typography variant="h6" color="textTertiary" gutterBottom>
              Custom Pricing
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
            >
              <Button variant="contained" color="primary">
                Contact Sales
              </Button>
            </Box>
            <Typography variant="body1">
              - All features in Pro Plan<br/>
              - Custom flashcard solutions for teams<br/>
              - Advanced analytics and reporting<br/>
              - Dedicated account manager<br/>
              - Tailored integrations and custom development
            </Typography>
          </Box>
        </Grid>

      </Grid>
    </Box>
    </>
  );
}
