'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../firebase"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [isFlipped, setIsFlipped] = useState(false)

  const router = useRouter()

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    console.log('flipped: ', flipped)
  }, [flipped])

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      
      const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), search)
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
  }, [search, user])

  const handleCardClick = (index) => {
    for (let i = 0; i < flashcards.length; i++) {
      setFlipped((prev) => ({
        ...prev,
        [i]: i == index ? !prev[index] : false,
      }))
    }
  }
  
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
            onClick={() => router.push('/flashcards')}
          >
            Flashcards
          </Button>
          <Button
            variant="contained"
            onClick={() => router.push('/generate')}
          >
            Generate
          </Button>
        </Box>
      </Box>
        
      <Grid container spacing={3} sx={{ mt: 4, mb: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: '1000px', // Perspective to create a 3D effect
                      width: '300px',
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
                        }}
                      >
                        <Typography variant="h5" component="div">
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
                          backgroundColor: '#d0d0d0', // Back side background color
                        }}
                      >
                        <Typography variant="h5" component="div">
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
    </Container>
  )
}