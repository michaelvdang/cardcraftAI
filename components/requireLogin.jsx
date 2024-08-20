import React from 'react'
import { Box, Button } from '@mui/material'
import { SignedIn, SignedOut } from '@clerk/nextjs';

const RequireLogin = () => {
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -30 }}
    >
      <Box>
        You must be logged in to view flashcards.
      </Box>
      <Box mt={2}>
        <SignedOut>
          <Button sx={{backgroundColor: 'black', color: 'white', marginRight: 2, border: '2px solid black', ":hover": {backgroundColor: 'white', color: 'black'} }} color="inherit" href="/sign-in">Login</Button>
        </SignedOut>
      </Box>
    </Box>
  )
}

export default RequireLogin