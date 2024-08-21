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
import { doc, getDoc, collection, writeBatch, deleteDoc, getDocs } from 'firebase/firestore'
import { useUser } from '@clerk/nextjs'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import { SignedOut } from '@clerk/nextjs'
import RequireLogin from '@/components/requireLogin'
import Footer from '@/components/footer'
import AppendOverwriteDialog from '@/components/appendOverwriteDialog'

export default function Generate() {
  const { user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [isSaved, setIsSaved] = useState(false)
  const [setName, setSetName] = useState('')
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const handleOpenSaveDialog = () => setSaveDialogOpen(true)
  const handleCloseSaveDialog = () => setSaveDialogOpen(false)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingCards, setIsCreatingCards] = useState(false)
  const [snap, setSnap] = useState(null);
  const [appendDialogOpen, setAppendDialogOpen] = useState(false)
  const handleOpenAppendDialog = () => setAppendDialogOpen(true)
  const handleCloseAppendDialog = () => setAppendDialogOpen(false)
  
  useEffect(() => {
    if (user) {
      setIsLoading(false)
    }
    else {
      setTimeout(() => {
        setIsLoading(false)
      }, 3000);
    }
  }, [user])

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
      console.log('break point 1')
      if (setDocSnap.exists()) {
        console.log('Set already exists')
        // add logic for confirming the user wants to append to list
        setSnap(setDocSnap)
        setAppendDialogOpen(true);
        await batch.commit()
      } else {
        // flashcards collection does not exists with this setId, create a new flashcards collection
        console.log('Set does not exist')
        batch.set(setDocRef, {})
        batch.set(setDocRef, { isPublic: false, createdAt: Date.now() })
        console.log('created new empty set')

        addCardsToSet(batch);
      }
    } catch (error) {
      console.error('Error saving flashcards:', error)
      alert('An error occurred while saving flashcards. Please try again.')
    }
  }

  const handleOverwrite = async () => {
    // overwrite
    setSaveDialogOpen(false);

    
    // delete existing flashcards in the 'flashcards' collection with the flashcard set named setName
    console.log("break 1")
    const setDocRef = doc(db, 'users', user.id, 'flashcardSets', setName)
    const colRef = collection(setDocRef, 'flashcards')
    const querySnapshot = await getDocs(colRef)
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref)
    })
    await deleteDoc(setDocRef)
    

    
    const batch = writeBatch(db)
    
    console.log('batch added: deleted document from flashcards collection')
    // create a new flashcard set named setName
    // add flashcards to new flashcard set
    batch.set(setDocRef, {})
    batch.set(setDocRef, { isPublic: false, createdAt: Date.now() })
    console.log('created new empty set')

    addCardsToSet(batch)

    alert('Flashcards Overwritten successfully!')
    // router.push('/flashcards/view?setId=' + setName)
  }

  const handleAppend = async () => {
    // append to list
    setAppendDialogOpen(false);
    
    const batch = writeBatch(db)

    addCardsToSet(batch)    

    alert('Flashcards appended successfully!')
    // router.push('/flashcards/view?setId=' + setName)
  }

  const addCardsToSet = async (batch) => {
    flashcards.forEach((flashcard) => {
      const flashcardRef = doc(collection(db, 'users', user.id, 'flashcardSets', setName, 'flashcards'))
      batch.set(flashcardRef, {...flashcard, createdAt: Date.now()})
      console.log('added document to flashcards collection')
    })

    await batch.commit()
    console.log('Changes committed');

    // setIsSaved(true)
    handleCloseSaveDialog()
    setSetName('')
  }
  
  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
  
    try {
      setIsCreatingCards(true)
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
  
      const data = await response.json()
      setFlashcards(data)
      setIsCreatingCards(false)
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
      
      {isLoading ? (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -20 }}
        >
          <Box>
            Loading...
          </Box>
        </Box>
        ) : (
        !user ? (
          <RequireLogin />
        ) : (
          <Box 
            sx={{ width: '80%', margin: 'auto' }}
          >
            <Box className="input-container" sx={{ my: 4 }}>
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
                // sx={{
                //   mb: 2,
                //   backgroundColor: '#c5c5c5',
                //   '& .MuiOutlinedInput-root': {
                //     backgroundColor: 'white', // Set background color for the input,
                //     '& fieldset': {
                //       borderColor: 'gray', // Default border color
                //     },
                //     '&:hover fieldset': {
                //       borderColor: 'black', // Border color on hover
                //     },
                //     '&.Mui-focused fieldset': {
                //       borderColor: 'black', // Border color when focused
                //     },
                //   },
                //   '& .MuiOutlinedInput-input': {
                //     resize: 'vertical', // Allow resizing in both directions
                //     overflow: 'auto', // To manage overflow when resizing
                //   },
                //   '& .MuiInputBase-input::placeholder': {
                //     color: 'gray', // Default placeholder color
                //   },
                //   '& .MuiInputBase-input:focus::placeholder': {
                //     color: 'black', // Placeholder color when focused
                //   },
                //   '& .MuiInputLabel-root.Mui-focused': {
                //     color: 'black', // Label color when focused
                //   },
                // }}
              />
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <Button
                className='primary-button'
                variant="contained"
                color="primary"
                sx={{
                  alignSelf: 'center',
                }}
                onClick={handleSubmit}
                // fullWidth
              >
                Generate Flashcards
              </Button>
            </Box>
            {isCreatingCards && (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 10 }}
              >
                Creating Flashcards...
              </Box>
            )}
            {/* Generated Flashcards */}
            {flashcards.length > 0 && (
              <Box marginTop={6}>
                <Typography textAlign={'center'} variant="h3" component="h2" gutterBottom>
                  Generated Flashcards
                </Typography>
                <Grid container spacing={2}>
                  {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card className='flashcard-set'>
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
                  <Box>Flashcards saved</Box>
                </Box>
              ) : (
                <Box sx={{ p: 8, display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    className='primary-button'
                    // sx={{backgroundColor: 'black', color: 'white', marginRight: 2, border: '2px solid black', ":hover": {backgroundColor: 'white', color: 'black'} }} 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenSaveDialog}>
                    Save Flashcards
                  </Button>
                </Box>
              )
            )}
          </Box>
        )
      )}

      
      {/* Save flashcards dialog  */}
      <Dialog open={saveDialogOpen} onClose={handleCloseSaveDialog}>
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
          <Button sx={{ color: 'black'}} onClick={handleCloseSaveDialog}>Cancel</Button>
          <Button sx={{ color: 'black'}} onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Append or overwrite dialog  */}
      <AppendOverwriteDialog
        open={appendDialogOpen}
        onClose={handleCloseAppendDialog}
        onClickAppend={handleAppend}
        onClickOverwrite={handleOverwrite}
      />
        
      {/* <Dialog open={appendDialogOpen} onClose={handleCloseAppendDialog}>
        <DialogTitle>Flashcard Set Exists</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A flashcard set with this name already exists. Do you want to append to the existing set?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAppendDialog} color="primary">
            No
          </Button>
          <Button onClick={handleAppend} color="primary">
            Append
          </Button>
          <Button onClick={handleOverwrite} color="primary">
            Overwrite
          </Button>
        </DialogActions>
      </Dialog> */}
    </Container>
    </>
  )
}