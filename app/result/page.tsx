'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Button, capitalize } from '@mui/material'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/header'
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useUserSubscription } from '@/utils/useUserSubscription'
import Stripe from 'stripe'

export default function ResultPage() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  const subscriptionTier = useUserSubscription(user?.id) || '';

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return
      try {
        setLoading(true)
        const res = await fetch(`/api/checkout-sessions?session_id=${session_id}`)
        const sessionData = await res.json()
        if (res.ok) {
          console.log('sessionData: ', sessionData)
          setSession(sessionData)
        } else {
          setError(sessionData.error)
        }
      } catch (err) {
        setError('An error occurred while retrieving the session.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheckoutSession()
  }, [session_id])
  
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 10}}>
        <CircularProgress />
        <Typography variant="h6" sx={{mt: 2}}>
          Loading...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', pt: 10, height: '75vh'}}>
        <Typography variant="h6" color="error">
          Oops! Something went wrong while processing your payment.
        </Typography>
        <Typography variant="h6" sx={{mt: 2}}>
          Error message: {error}
        </Typography>
      </Container>
    )
  }

  if (!session) {
    return <p>No session found</p>
  }

  return (
    <>
    <Container maxWidth="xl" sx={{textAlign: 'center', mt: 4, height:"100vh", paddingTop: {xs: '50px', md: '60px'},}}>
      {/* Page Title and Subtitle */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Purchase Result
        </Typography>
      </Box>

      {/* Wait for maximum 10 seconds while firestore gets updated with new subscription, don't show result until then  */}

      {/* Session Result */}
      {!error && session?.payment_status === 'paid' ? (
        <>
          <Box

          >
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'green', m: { xs: 2, sm: 4, md: 6, lg: 8} }} />
            {/* <DoneAllIcon sx={{ fontSize: 100, color: 'green' }} /> */}
          </Box>

          {/* Thank you message */}
          <Box
            sx={{ 
              // mt: -16,
              // height: '100vh', // Make the Box take up the full viewport height
              display: 'flex', // Use flexbox for centering
              flexDirection: 'column', // Stack the children vertically
              justifyContent: 'center', // Center vertically
              alignItems: 'center', // Center horizontally
            }}
          >
            <Typography mb={2} variant="h4">Thank you for your purchase{user && (', ' + user?.firstName)}!</Typography>
            <Typography mb={2} variant="h5">You are now a {capitalize(subscriptionTier)} member!</Typography>
            <Box sx={{mt: 2}}>
              {/* <Typography variant="h6">Session ID: {session_id}</Typography> */}
              <Typography variant="body1">
                We have received your payment. You will receive an email with the
                order details shortly.
              </Typography>
            </Box>
          </Box>
          </>
      ) : (
        <>
          <Typography variant="h4">Payment failed</Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="body1">
              Your payment was not successful. Please try again.
            </Typography>
          </Box>
        </>
      )}
    </Container>
    </>
  )
}