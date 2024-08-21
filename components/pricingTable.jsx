import React from 'react'
import { Box, Typography, Grid, Button } from '@mui/material'
import { useUser } from '@clerk/nextjs'
import { getStripe } from '@/utils/get-stripe'

const PricingTable = () => {
  const { user } = useUser()

  const handlePurchasePro = async () => {
    if (!user) {
      alert('Please sign in to purchase a plan')
      return
    }
    const pro_price_id = 'price_1PoGZcC3afAR2U7cASsbbCQc'
    const checkoutSession = await fetch('/api/checkout-sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
      body: JSON.stringify({ priceId: pro_price_id }),
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
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>Pricing</Typography>
        <Grid container justifyContent="center" pt="24px" gap={3}>
          
          <Grid item xs={12} lg={3} 
            className='pricing-card'
            // sx={{borderRadius: '8px',":hover": {backgroundColor: '#fafafa' }}}
          >
            <Box sx={{ p: 3, textAlign: 'center' }}>
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
                    border: '1px solid #a2a2a2', // Matching border color
                    '&:hover': {
                      backgroundColor: '#5a6268', // Slightly darker gray for hover effect
                    },
                    '&:disabled': {
                      backgroundColor: '#a2a2a2', // Maintain same color when disabled
                      color: '#ffffff',           // White text color when disabled
                    }
                  }}
                  disabled
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

          <Grid item xs={12} lg={3} className='pricing-card card-highlight'
            // sx={{ border: '2px solid black', borderRadius: '8px', ":hover": {backgroundColor: '#fafafa'}, }}
          >
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Pro (Test Mode)
              </Typography>
              <Typography variant="h6" color="textTertiary" gutterBottom>
                $9.99 / month
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
              >
                <Button 
                  variant="contained" 
                  color="primary" 
                  className='primary-button'
                  // sx={{
                  //   justifySelf: 'center', 
                  //   backgroundColor: 'black' , 
                  //   ":hover": {backgroundColor: '#c2c2c2'},
                  // }}
                  onClick={handlePurchasePro}
                  // onClick={handleProPlanClick}
                  // onClick={() => {router.push('/checkout?plan=pro')}}
                >
                  Free (Test Mode)
                </Button>
              </Box>
              <Typography variant="body1">
                - All features in Free Plan<br/>
                - Access to other your own flashcard sets<br/>
                - Enhanced storage and management tools<br/>
                - Priority customer support
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} lg={3} className='pricing-card'
            // sx={{ borderRadius: '8px', ":hover": {backgroundColor: '#fafafa'}, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
          >
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5" component="h3" gutterBottom>Ultimate</Typography>
              <Typography variant="h6" color="textTertiary" gutterBottom>
                Custom Pricing
              </Typography>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 2 }}
              >
                <Button variant="contained" 
                  // sx={{justifySelf: 'center', backgroundColor: 'black', ":hover": {backgroundColor: '#c2c2c2'}}}
                  className='primary-button'
                >
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
  )
}

export default PricingTable