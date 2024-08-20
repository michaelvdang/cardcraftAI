'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material'
import { useUser } from '@clerk/nextjs'
import Header from '@/components/header'

export default function ResultPage() {
  const { user } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

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
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <CircularProgress />
        <Typography variant="h6" sx={{mt: 2}}>
          Loading...
        </Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    )
  }

  if (!session) {
    return <p>No session found</p>
  }

  return (
    <>
    <Container maxWidth="xl" sx={{textAlign: 'center', mt: 4, height:"100vh"}}>
      {/* Page Title and Subtitle */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Purchase Result
        </Typography>
      </Box>

      {/* Session Result */}
      {session.payment_status === 'paid' ? (
        <>
          <Box
            sx={{ 
              mt: -16,
              height: '100vh', // Make the Box take up the full viewport height
              display: 'flex', // Use flexbox for centering
              flexDirection: 'column', // Stack the children vertically
              justifyContent: 'center', // Center vertically
              alignItems: 'center', // Center horizontally
            }}
          >
            <Typography variant="h4">Thank you for your purchase{user && (', ' + user?.firstName)}!</Typography>
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