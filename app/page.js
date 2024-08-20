'use client'
import { AppBar, Toolbar, Typography, Button, Box, Grid, useTheme, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, Container } from "@mui/material";
import { SignedIn, SignedOut, UserButton, SignInButton, SignInWithMetamaskButton, useUser, useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";
import { usePathname, useRouter } from "next/navigation";
import PricingTable from "@/components/pricingTable";
import Header from "@/components/header";

export default function Home() {
  const path = usePathname()

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const { user } = useUser()
  const { getToken, userId } = useAuth()
  const router = useRouter();

  const signIntoFirebaseWithClerk = async () => {
    const token = await getToken({ template: 'integration_firebase' })

    const userCredentials = await signInWithCustomToken(auth, token || '')
    // The userCredentials.user object can call the methods of
    // the Firebase platform as an authenticated user.
    console.log('Home page User:', userCredentials.user)
  }

  useEffect(() => {
    if (!user) return
    console.log('signing into firebase with clerk')
    signIntoFirebaseWithClerk()
  }, [user])
  
  return (
    <>
    <Container  maxWidth="xl" sx={{minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'} }}>



      {/* Hero */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          The easiest way to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{mt: 2, mr: 2, backgroundColor: 'black', ":hover": {backgroundColor: '#c2c2c2'}}} href="/generate">
          Create
        </Button>
        <Button variant="outlined" color="primary" sx={{mt: 2, color: 'black', borderColor: 'black', ":hover": {borderColor: 'black'}}} href="/flashcards">
          View Flashcards
        </Button>
        <Box id="features" height="30px"/>
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
                Enter your content, and our platform will automatically generate a set of flashcards for you. Whether it is for studying, revision, or learning new topics, the generated flashcards are optimized for your needs.
              </Typography>
            </Box>
          </Grid>

          {/* Feature 2: Cloud Firestore Storage */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, borderRadius: '8px', height: '100%'}}>
              <Typography variant="h5" component="h3" gutterBottom>
                Cloud Storage
              </Typography>
              <Typography variant="body1">
                All your flashcard sets are securely stored in Cloud Firestore, ensuring that your learning materials are always accessible, no matter the device you are using.
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
                As a Pro user, you will have access to flashcard sets created by other free users. Expand your learning resources and discover new content by browsing shared flashcard sets.
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
        <Box id="pricing" height="30px"/>
      </Box>

      {/* Pricing section */}

      {/* <Box
        sx={{
          my: 6,
        }}
      >
        <StripePricingTable />
      </Box> */}
      <PricingTable />
    </Container>
    </>
  );
}
