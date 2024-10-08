'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import { db } from "../../../firebase"
import RequireLogin from "@/components/requireLogin"
import { useUserSubscription } from "@/utils/useUserSubscription"
import { PublicFlashcardType } from "@/types"

export default function Flashcard() {
  const requireLogin = false;
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState<PublicFlashcardType[]>([])
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const subscriptionTier = useUserSubscription(user?.id);
  const [setAttributes, setSetAttributes] = useState({})
  const [flashcardSetName, setFlashcardSetName] = useState('')
  const [showRequireLoginDialog, setShowRequireLoginDialog] = useState(true)

  const handleRequireLoginDialogClose = () => {
    setShowRequireLoginDialog(false)
  }

  const handleRequireLoginDialogOpen = () => {
    setShowRequireLoginDialog(true)
  }
  
  const router = useRouter()
  // const params = useParams(); // read path params
  // const setId = params.id

  const setId = useSearchParams().get('setId'); // is publicId here

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false)
      console.log('useEffect user: ', user)
    }
  }, [isLoaded, user])

  // get flashcards from public collection 
  useEffect(() => {
    async function getFlashcards() {
      if (!setId) throw new Error('No setId')

      const docRef = doc(db, 'public', setId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        router.push('/public')
        return
      }
      const data = docSnap.data()
      setFlashcards(data.flashcards)
      setFlashcardSetName(data.setId)
    } 
    getFlashcards()
  }, [setId, user])

  const handleCardClick = (index: number) => {
    setFlipped(flashcards.map((_, i) => i === index ? !flipped[i] : false))
  }

  const handleSaveClick = () => {
    // // save card to user profile
    // if (!user) {
      
    // }
  }

  {/* TODO: save card to user profile
    save button will add the card set id to a field in the user profile
    user flashcards page will fetch the flashcards from the field in the public collection
    add an option to clone card set to make it private
    
    
  */}

  // if (showLoginDialog) {
  //   return <ConfirmDeleteModal onSubmit={() => setShowLoginDialog(false)} />
  //   // return <RequireLogin />
  // }
  
  return (
    <>
    <Container maxWidth="lg" sx={{ minHeight: '100vh', paddingTop: {xs: '50px', md: '60px'}, }}>

        <>
        <Box
          sx={{ display: 'flex',  justifyContent: 'center', flexDirection: { xs: 'column', md: 'row'}, position: 'relative' }}
        >
          {/* Page Title and Subtitle */}
          <Box sx={{textAlign: 'center', mt: 4}}>
            <Typography variant="h2" component="h1" gutterBottom>
              {flashcardSetName}
            </Typography>
          </Box>
          {/* {setAttributes?.isPublic ? (
            <Box
              sx={{ alignSelf: 'center', position: { xs: 'relative', md: 'absolute'}, right: { md: 0}, }}
            >
              <Button
                variant="contained"
                className="primary-button"
                // color="error"
                // onClick={handleUnpublish}
              >
                unsave
              </Button>
            </Box>
          ) : (
            <Box
              sx={{ alignSelf: 'center', position: { xs: 'relative', md: 'absolute'}, right: { md: 0}, }}
            >
              <Button
                variant="contained"
                className="primary-button"
                // color="error"
                // onClick={handleSaveClick}
              >
                save
              </Button>
            </Box>
          )} */}
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
        </>
    </Container>
    </>
  )
}