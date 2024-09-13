'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { collection, doc, getDoc, getDocs, writeBatch, deleteDoc, serverTimestamp, addDoc } from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from "../../../firebase"
import RequireLogin from "@/components/requireLogin"
import ConfirmDeleteModal from "@/components/confirmDeleteDialog"
import { useUserSubscription } from "@/utils/useUserSubscription"
import { FlashcardSetType, FlashcardType } from "@/types"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState<FlashcardType[]>([])
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSetType | null>(null)
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const subscriptionTier = useUserSubscription(user?.id);
  const [setAttributes, setSetAttributes] = useState({})
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModalOpen = () => {
    setShowDeleteModal(true);
  };
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  }
  const router = useRouter()
  const setId = useSearchParams().get('setId');

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false)
      console.log('useEffect user: ', user)
    }
  }, [isLoaded, user])

  useEffect(() => {
    async function getFlashcards() {
      if (!setId || !user) return

      const docRef = doc(db, 'users', user.id, 'flashcardSets', setId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        router.push('/flashcards')
        return
      }

      // get flashcards set attributes
      const setAttributes = docSnap.data()
      setSetAttributes(setAttributes); // isPublic and publicId
      const flashcardSet: FlashcardSetType | undefined = {
        setId: setId,
        isPublic: setAttributes.isPublic,
        publicId: setAttributes.publicId,
        createdAt: setAttributes.createdAt,
        flashcards: [],
      }

      // get flashcards content
      const colRef = collection(db, 'users', user.id, 'flashcardSets', setId, 'flashcards')
      const colSnap = await getDocs(colRef)
      const flashcards: FlashcardType[] = []
      colSnap.forEach((doc) => {
        const data = doc.data()
        flashcards.push({
          cardId: doc.id,
          front: data.front,
          back: data.back,
          createdAt: data.createdAt,
        })
        flashcardSet.flashcards.push({
          cardId: doc.id,
          front: data.front,
          back: data.back,
          createdAt: data.createdAt,
        })
      })
      setFlashcards(flashcards)
      setFlashcardSet(flashcardSet)

    }
    getFlashcards()
  }, [setId, user])

  const handleCardClick = (index: number) => {
    setFlipped(flashcards.map((_, i) => i === index ? !flipped[i] : false))
  }

  // const handleCardClick = (index: number) => {
  //   for (let i = 0; i < flashcards.length; i++) {
  //     setFlipped((prev) => ({
  //       ...prev,
  //       [i]: i == index ? !prev[index] : false,
  //     }))
  //   }
  // }

  // const deleteItem = async (index) => {
  //   const newFlashcards = [...flashcards]
  //   newFlashcards.splice(index, 1)
  //   setFlashcards(newFlashcards)
  //   const docRef = doc(collection(doc(collection(db, 'users'), user.id), 'flashcardSets'), setId)
  //   const batch = writeBatch(db)
  //   batch.update(docRef, {flashcards: newFlashcards})
  //   await batch.commit()
  // }

  const deleteDocument = useCallback(async () => {
    try {
      if (!user || !setId) throw new Error('User or set ID not found')

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

  const handlePublish = async () => {
    try {
      if (!user || !setId || !flashcardSet) throw new Error('User or set ID or flashcard set not found')
      // put the set in the public collection with random id, and fields authorId, createdAt, and flashcards array
      // cannot batch because we need the publicId
      console.log('break1')
      const publicDocRef = await addDoc(collection(db, 'public'), {
        authorId: user.id,
        createdAt: serverTimestamp(),
        flashcards,
        setId: setId
      });
      console.log('break2')
      
      const batch = writeBatch(db)

      // mark as public in user's document
      const docRef = doc(db, 'users', user.id, 'flashcardSets', setId)
      batch.update(docRef, {isPublic: true, publicId: publicDocRef.id})
      await batch.commit()
      
      // update UI state to reflect changes
      setSetAttributes({isPublic: true, publicId: publicDocRef.id})
      setFlashcardSet({ ...flashcardSet, publicId: publicDocRef.id, isPublic: true })
      // setIsPublic(true)
    }
    catch (error) {
      console.error("Error publishing document: ", error)
    }
  }

  const handleUnpublish = async () => {
    if (!user || !setId || !flashcardSet || !flashcardSet.publicId) throw new Error('User or set ID or public ID not found')
    console.log('unpublishing: ', flashcardSet?.publicId)
    // console.log('unpublishing: ', setAttributes?.publicId)
    const batch = writeBatch(db)
    // delete the set from the public collection
    const publicDocRef = doc(db, 'public', flashcardSet?.publicId)
    batch.delete(publicDocRef)
    
    // unmark as public in user's document
    const docRef = doc(db, 'users', user.id, 'flashcardSets', setId)
    batch.update(docRef, {isPublic: false, publicId: null})
    await batch.commit()

    // update UI state to reflect changes
    setSetAttributes({isPublic: false, publicId: null})
    setFlashcardSet({ ...flashcardSet, publicId: publicDocRef.id, isPublic: false })
    // setIsPublic(false)
  }
  
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
              {setId}
            </Typography>
          </Box>
          {flashcardSet?.isPublic ? (
            <Box
              sx={{ alignSelf: 'center', position: { xs: 'relative', md: 'absolute'}, right: { md: 0}, }}
            >
              <Button
                variant="contained"
                className="primary-button"
                // color="error"
                onClick={handleUnpublish}
              >
                unpublish
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
                onClick={handlePublish}
              >
                publish
              </Button>
            </Box>
          )}
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

            <Button 
              sx={{ 
                color: 'red', 
                borderColor: 'red', 
                backgroundColor: 'white',
                ":hover": {backgroundColor: '#fff3f3'}
              }} 
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteModalOpen}>
              Delete
            </Button>
            {/* Confirm delete modal */}
            <ConfirmDeleteModal open={showDeleteModal} onSubmit={handleDelete} onClose={handleDeleteModalClose}/>
          </Box>
        )}
        </>
    </Container>
    </>
  )
}