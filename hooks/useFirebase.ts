import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react"
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/firebase";

export default function useFirebase() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken, userId } = useAuth()
  const [hasFirebaseUser, setHasFirebaseUser] = useState(false)
  
  useEffect(() => {
    const signIn = async () => {
      const token = await getToken({ template: 'integration_firebase' })
      
      const userCredentials = await signInWithCustomToken(auth, token || '')
      setHasFirebaseUser(true)
    }
    if (isLoaded && isSignedIn) {
      signIn()
      setHasFirebaseUser(true)
    }
    else {
      setHasFirebaseUser(false)
    }
  }, [isLoaded, isSignedIn, user])

  return hasFirebaseUser;
}