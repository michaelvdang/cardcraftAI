'use client'

import { useEffect, useState } from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import {db} from '../../firebase'
import { doc, getDoc, collection, writeBatch } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { SignedOut } from '@clerk/nextjs'

export default function Generate() {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)
  const router = useRouter();

  useEffect(() => {
    console.log("issaved: ", isSaved)
  }, [isSaved])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Firebase auth user: ', user)
      } else {
        console.log('No user: ', user)
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    console.log('Clerk user: ', user)
    if (user === null) {
      alert('Please sign in to save flashcards.')
      return
    }
  
    try {
      console.log("user.id: ", user.id)
      const userDocRef = doc(collection(db, 'users'), user.id)
      const userDocSnap = await getDoc(userDocRef)
  
      const batch = writeBatch(db)

      if (!userDocSnap.exists()) {
        // If the user document doesn't exist, create it without the flashcardSets field
        batch.set(userDocRef, {}); // Creates an empty user document
      }
  
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
      const setDocSnap = await getDoc(setDocRef)
      if (setDocSnap.exists()) {
        const updatedFlashcards = [...(setDocSnap.data().flashcards || []), ...flashcards]
        const isPublic = setDocSnap.data().isPublic; // || false
        batch.set(setDocRef, { isPublic, flashcards: updatedFlashcards })
      } else {
        batch.set(setDocRef, { isPublic: false, flashcards })
      }

      console.log('setname: ', setName)
      console.log('flashcards: ', {flashcards})
  
      await batch.commit()
  
      setIsSaved(true)
      alert('Flashcards saved successfully!')
      handleCloseDialog()
      setSetName('')
      router.push('/flashcard?id=' + setName)
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }
  
  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards. Please try again.')
    }
  }

  return (
    <>
    <Container maxWidth="xl" sx={{minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>
      {/* Page Title and Subtitle */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
      </Box>
      
      {!user ? (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -20 }}
        >
          <Box>
            You must be logged in to view flashcard sets.
          </Box>
          <Box mt={2}>
            <SignedOut>
              <Button sx={{backgroundColor: 'black', color: 'white', marginRight: 2, border: '2px solid black', ":hover": {backgroundColor: 'white', color: 'black'} }} color="inherit" href="/sign-in">Login</Button>
              <Button sx={{ border: '2px solid black', ":hover": {backgroundColor: '#f5f5f5'}, marginRight: 2}}  color="inherit" href="/sign-up">Sign Up</Button>
            </SignedOut>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ height: '100vh', width: '80%', margin: 'auto' }}
        >
          <Box sx={{ my: 4 }}>
            <TextField
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Enter text here"
              helperText={`${text.length}/500`} // Display character count
              inputProps={{ maxLength: 500 }} // Limit to 500 characters
              sx={{
                mb: 2,
                backgroundColor: '#c5c5c5',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white', // Set background color for the input,
                  '& fieldset': {
                    borderColor: 'gray', // Default border color
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black', // Border color when focused
                  },
                },
                '& .MuiOutlinedInput-input': {
                  resize: 'vertical', // Allow resizing in both directions
                  overflow: 'auto', // To manage overflow when resizing
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'gray', // Default placeholder color
                },
                '& .MuiInputBase-input:focus::placeholder': {
                  color: 'black', // Placeholder color when focused
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'black', // Label color when focused
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                ":hover": { backgroundColor: '#c2c2c2' },
                backgroundColor: 'black'
              }}
              onClick={handleSubmit}
              fullWidth
            >
              Generate Flashcards
            </Button>
          </Box>
        </Box>
      )}
        

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Generated Flashcards
          </Typography>
          <Grid container spacing={2}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Front:</Typography>
                    <Typography>{flashcard.front}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                    <Typography>{flashcard.back}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {flashcards.length > 0 && (
        isSaved ? (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Box>Saved</Box>
        </Box>
        ) : (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Save Flashcards
          </Button>
        </Box>
        )
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  )
}