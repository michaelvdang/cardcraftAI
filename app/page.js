'use client'
import Image from 'next/image';
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
      <Box sx={{
        textAlign: 'center', 
        my: 4,
        backgroundImage: 'url(/assets/cube.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        minHeight: '400px',
        maxHeight: '600px',
        paddingTop: '46.25%', // 16:9 aspect ratio (height / width * 100)
        position: 'relative', // Make it relative for absolute positioning of content
        // height: '60vh',
        // height: '400px', // Adjust the height as needed
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // color: 'white', // Text color that contrasts with the background
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Typography sx={{backdropFilter: 'blur(2px)', color: 'white', padding: 2, boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.4)', textShadow: '3px 2px 10px rgba(0, 0, 0, 0.7)', fontSize: {xs: '3rem', sm: '4rem', md: '6rem'}}} variant="h2" component="h1" gutterBottom>
            CardCraft AI
          </Typography>
          <Typography sx={{color: 'white', padding: 2, textShadow: '0 0 12px rgba(0, 0, 0, 0.9)'}} variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          {/* CTA */}
          <Box sx={{ mt: { xs: 2, md: 4}, display: 'flex', justifyContent: 'center' }}>
            {user ? (
              <Button 
                className='cta-button'
                size='large'
                variant="contained"
                href='/generate'
              >
                Create
              </Button>
            ) : (
              <Button
                className='cta-button'
                size='large'
                variant="contained"
                // sx={{
                //   ":hover": { backgroundColor: '#000000', color: 'white' },
                //   color: 'black',
                //   backgroundColor: 'white',
                //   border: '2px solid black',
                // }}
                onClick={() => router.push('/sign-in')}
              >
                Log in
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    <Container  maxWidth="xl" sx={{minHeight: '100vh', }}>
      {/* Hero */}
        <Box id="features" height="30px"/>

      
      {/* Features */}
      <Box sx={{ my: 6 }}>
        <Typography textAlign={'center'} variant="h4" component="h2" gutterBottom>Features</Typography>
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
