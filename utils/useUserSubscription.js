import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from '../firebase'; // Adjust the import based on your Firebase setup

export const useUserSubscription = (userId) => {
  const [subscriptionTier, setSubscriptionTier] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSubscriptionTier(data.subscriptions[-1].subscriptionTier);
        console.log('Hook Subscription tier:', data.subscriptions[-1].subscriptionTier);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return subscriptionTier;
};