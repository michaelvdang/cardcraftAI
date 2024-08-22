'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, writeBatch, deleteDoc } from "firebase/firestore"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { usesetIdParams } from "next/navigation"
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "@/components/header"
import { SignedOut } from "@clerk/nextjs"
import { db } from "../../../firebase"
import RequireLogin from "@/components/requireLogin"
import ConfirmDeleteModal from "@/components/confirmDeleteDialog"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  // const params = useParams(); // read path params
  // const setId = params.id

  const setId = useSearchParams().get('setId');

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false)
      console.log('useEffect user: ', user)
    }
  }, [isLoaded, user])

  useEffect(() => {
    async function getFlashcard() {
      if (!setId || !user) return

      const colRef = collection(db, 'users', user.id, 'flashcardSets', setId, 'flashcards')
      const colSnap = await getDocs(colRef)
      const flashcards = []
      colSnap.forEach((doc) => {
        flashcards.push({id: doc.id, ...doc.data()})
      })
      setFlashcards(flashcards)
      // for (let i = 0; i < flashcards.length; i++) {
      //   setFlipped((prev) => ({
      //     ...prev,
      //     [i]: false,
      //   }))
      // }
      
      // // when flashcards was stored as an array in a document field
      // const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId)
      // const docSnap = await getDoc(docRef)
      
      // if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      //   const flashcards = [...docSnap.data().flashcards ]
      //   setFlashcards(flashcards)
      //   for (let i = 0; i < flashcards.length; i++) {
      //     setFlipped((prev) => ({
      //       ...prev,
      //       [i]: false,
      //     }))
      //   }
      // }
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

  const deleteDocument = useCallback(async () => {
    try {
      const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId)
      await deleteDoc(docRef)
    }
    catch (error) {
      console.error("Error deleting document: ", error)
    }
  }, [user, setId]);

  const handleDelete = useCallback(async () => {
    // Add your delete logic here
    const result = await deleteDocument();
    router.push('/flashcards')
    console.log("Item deleted");
    console.log("setId: ", setId);
  }, [deleteDocument, setId]);
  
  return (
    <>
    <Container maxWidth="lg" sx={{ minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>

        <>
        {/* Page Title and Subtitle */}
        <Box sx={{textAlign: 'center', my: 4}}>
          <Typography variant="h2" component="h1" gutterBottom>
            {setId}
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
          // Display flashcards
            flashcards.length === 0 ? (
              <Box
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -20 }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  No flashcards found
                </Typography>
              </Box>
            ) : (
            <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className="flashcard-card">
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
                                // backgroundColor: '#fff', // Front side background color
                                padding: '16px', // Optional: Adds padding inside the box
                              }}
                              className="flashcard-front"
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
                                // backgroundColor: '#333333', // Back side background color
                                // color: '#fff', // Back side text color
                                padding: '16px', // Optional: Adds padding inside the box
                                // boxSizing: 'border-box', // Ensures padding doesn't affect box size
                              }}
                              className="flashcard-back"
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
        )
        )}
        {flashcards.length > 0 && (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', m: 10 }}
          >
            <ConfirmDeleteModal onSubmit={handleDelete} />
          </Box>
        )}
        </>
    </Container>
    </>
  )
}