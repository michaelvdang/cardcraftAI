'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../../firebase"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcardSets, setFlashcardSets] = useState([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      setIsLoading(true)
      try {
        {/* get document with user id */}
        const docRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          {/* get document ids from flashcardSets collection */}
          const colRef = collection(docRef, 'flashcardSets')
          const colSnap = await getDocs(colRef)
          const sets = []
          colSnap.forEach((doc) => {
            sets.push({name: doc.id})
          })
          setFlashcardSets(sets)
        }
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
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
          Flashcard Sets
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
        
        
      {flashcardSets.length === 0 ? (
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
            <Box>You have no flashcard sets.</Box>
          ) 
      ) : (
        <Typography variant="body1" gutterBottom>
          You have {flashcardSets.length} flashcard sets.
        </Typography>
      )}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcardSets.map((set, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(set.name)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {set.name}
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