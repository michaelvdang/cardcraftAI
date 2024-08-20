'use client'
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { SignedOut, useUser } from "@clerk/nextjs";
import Header from "@/components/header"
import Link from "next/link"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcardSets, setFlashcardSets] = useState([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsLoading(false)
    }
  }, [user])
  
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
    console.log("flashcards useeffect user: ", user)
    getFlashcards()
  }, [user])

  return (
    <>
    <Container maxWidth="xl" sx={{minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>
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
          (flashcardSets.length === 0) && (
            isLoading ? (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -20 }}
                >
                  Loading...
                </Box>
              ) : (
                <Box>You have no flashcards.</Box>
              ) 
          )
        )
      )}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcardSets.map((set, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <Link href={`/flashcards/view?setId=${set.name}`}>
                <CardActionArea>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {set.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>

      </Container>
    
    </>
  )
}