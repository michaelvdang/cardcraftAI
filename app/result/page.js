'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Button } from '@mui/material'

export default function ResultPage() {
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
    <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
      {/* Header with Nav Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        textAlign="center"
        mt={4}
        mb={4}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Result
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            height: '100%',
          }}
        >
          <Button
            variant="contained"
            onClick={() => router.push('/')}
          >
            Home
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/generate')}
          >
            Generate
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/flashcards')}
          >
            Flashcards
          </Button>
        </Box>
      </Box>

      {/* Session Result */}
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4">Thank you for your purchase!</Typography>
          <Box sx={{mt: 2}}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1">
              We have received your payment. You will receive an email with the
              order details shortly.
            </Typography>
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