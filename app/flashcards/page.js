'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      setIsLoading(true)
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        const collections = docSnap.data().flashcardSets || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
      // setIsLoading(false)
    }
    getFlashcards()
  }, [user])

  return (
    <Container maxWidth="md">
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
          Flashcards
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
        </Box>
      </Box>
        
        
      {flashcards.length === 0 ? (
        isLoading ? (
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'center',
                // alignItems: 'center',
                height: '100vh', // Full viewport height to center vertically
              }}>
              Loading...
             </Box>
          ) : (
            <Box>You have no flashcards.</Box>
          ) 
      ) : (
        <Typography variant="body1" gutterBottom>
          You have {flashcards.length} flashcards.
        </Typography>
      )}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {flashcard.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

    </Container>
  )
}