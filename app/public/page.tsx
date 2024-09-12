'use client'
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { SignedOut, useUser } from "@clerk/nextjs";
import Header from "@/components/header"
import Link from "next/link"
import RequireLogin from "@/components/requireLogin"
import { useUserSubscription } from "@/utils/useUserSubscription"
import { FlashcardSet } from "@/types"

export default function Flashcard() {
  const requireLogin = false;
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const subscriptionTier = useUserSubscription(user?.id);
  // const [subscriptionTier, setSubscriptionTier] = useState(null)
  console.log('flashcards page subscription tier: ', subscriptionTier)
  
  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false)
    }
  }, [isLoaded, user])

  
  useEffect(() => {
    async function getFlashcards() {
      // if (!user) return
      setIsLoading(true)
      try {
        {/* get document with user id */}
        const colRef = collection(db, 'public')
        const colSnap = await getDocs(colRef)
        const sets : FlashcardSet[] = []
        colSnap.forEach((doc) => {
          sets.push({name: doc.data().setId, id: doc.id})
          // sets.push({name: doc.id})
        })
        setFlashcardSets(sets)
      } catch (error) {
        console.log(error)
      }
      setIsLoading(false)
    }
    console.log("public page useeffect user: ", user)
    getFlashcards()
  }, [user])

  return (
    <>
    <Container maxWidth="xl" sx={{minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>
      {/* Page Title and Subtitle */}
      <Box sx={{textAlign: 'center', my: 4}}>
        <Typography variant="h2" component="h1" gutterBottom>
          Public Flashcards
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
        requireLogin && !user ? (
          <RequireLogin />
        ) : (
          (flashcardSets.length === 0) && (
            isLoading ? (
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: -40 }}
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
            <Card className="flashcard-set" variant="outlined">
              <Link href={`/public/view?setId=${set.id}`}>
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