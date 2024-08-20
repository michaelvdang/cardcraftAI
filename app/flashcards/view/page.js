'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { usesetIdParams } from "next/navigation"
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "@/components/header"
import { SignedOut } from "@clerk/nextjs"
import { db } from "../../../firebase"


export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  // const params = useParams(); // read path params
  // const setId = params.id

  const setId = useSearchParams().get('setId');
  console.log("setId: ", setId)

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
    async function getFlashcard() {
      if (!setId || !user) return
      
      const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const flashcards = [...docSnap.data().flashcards ]
        setFlashcards(flashcards)
        for (let i = 0; i < flashcards.length; i++) {
          setFlipped((prev) => ({
            ...prev,
            [i]: false,
          }))
        }
      }
    }
    getFlashcard()
  }, [setId, user])

  const handleCardClick = (index) => {
    for (let i = 0; i < flashcards.length; i++) {
      setFlipped((prev) => ({
        ...prev,
        [i]: i == index ? !prev[index] : false,
      }))
    }
  }

  const deleteItem = async (index) => {
    const newFlashcards = [...flashcards]
    newFlashcards.splice(index, 1)
    setFlashcards(newFlashcards)
    const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId)
    const batch = writeBatch(db)
    batch.update(docRef, {flashcards: newFlashcards})
    await batch.commit()
  }
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    deleteItem();
    console.log("Item deleted");
    setOpen(false);
  };
  
  return (
    <>
    <Container maxWidth="lg" sx={{ minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>

        <>
        {/* Page Title and Subtitle */}
        <Box sx={{textAlign: 'center', my: 4}}>
          <Typography variant="h2" component="h1" gutterBottom>
            Flashcards
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
            <Box
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -20 }}
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
          ) : (
          <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea  onClick={() => handleCardClick(index)}>
                    <CardContent sx={{padding: 0}}>
                      <Box
                        sx={{
                          perspective: '1000px', // Perspective to create a 3D effect
                          height: '200px',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            textAlign: 'center',
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)', // Flip based on state
                          }}
                        >
                          {/* Front side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#fff', // Front side background color
                              padding: '16px', // Optional: Adds padding inside the box
                            }}
                          >
                            <Typography 
                              variant="h5" 
                              component="div"
                              sx={{
                                wordWrap: 'break-word', // Wraps long words onto the next line
                                overflowWrap: 'break-word', // Ensures overflow text is wrapped
                                textAlign: 'center', // Optional: Center align the text
                                width: '100%', // Ensures text takes up full width of the container
                              }}
                            >
                              {flashcard.front}
                            </Typography>
                          </Box>

                          {/* Back side */}
                          <Box
                            sx={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)', // Start back side rotated
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#333333', // Back side background color
                              padding: '16px', // Optional: Adds padding inside the box
                              // boxSizing: 'border-box', // Ensures padding doesn't affect box size
                              color: '#fff', // Back side text color
                            }}
                          >
                            <Typography 
                              variant="h5" 
                              component="div" 
                              sx={{
                                wordWrap: 'break-word', // Wraps long words onto the next line
                                overflowWrap: 'break-word', // Ensures overflow text is wrapped
                                textAlign: 'center', // Optional: Center align the text
                                width: '100%', // Ensures text takes up full width of the container
                              }}
                            >
                              {flashcard.back}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
        )}
        {flashcards.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
            marginBottom={5}
          >
            <Button 
              sx={{ 
                color: 'red', 
                borderColor: 'red', 
                backgroundColor: 'white',
                ":hover": {backgroundColor: '#fff3f3'}
              }} 
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleClickOpen}>
              Delete
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="confirm-delete-title"
              sx={{
                '& .MuiBackdrop-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
              }}
              PaperProps={{
                sx: {
                  minWidth: 300,
                },
              }}
              disableScrollLock={false}
            >
              <DialogTitle
               sx={{
                 backgroundColor: '#000000bb',
                 color: 'white',
               }}
               id="confirm-delete-title">
                Confirm Delete
              </DialogTitle>
              <DialogContent
                sx={{
                  padding: 2,
                  backgroundColor: 'white',
                  color: 'black',
                }}
              >
                <Typography
                  sx={{
                    padding: 2, 
                  }}
                  variant="h6">
                  Are you sure you want to delete this card set? This action cannot be undone.
                </Typography>
              </DialogContent>
              <DialogActions
                sx={{
                  padding: 2,
                  backgroundColor: 'white',
                  color: 'white',
                  justifyContent: 'center',
                }}
              >
                <Button
                  sx={{ 
                    color: 'black', 
                    backgroundColor: 'white',
                    ":hover": {backgroundColor: '#f8f8f8'}
                  }}  
                  onClick={handleClose} 
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  sx={{ 
                    color: 'white', 
                    backgroundColor: 'red',
                    ":hover": {backgroundColor: '#ff000099'}
                  }}  
                  onClick={handleClose} 
                  variant="contained"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        </>
    </Container>
    </>
  )
}