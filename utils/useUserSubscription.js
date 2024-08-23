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
        console.log('useUserSubscription data: ', data);
        const lastIndex = data.subscriptions.length - 1;
        setSubscriptionTier(data.subscriptions[lastIndex].subscriptionTier);
        console.log('useUserSubscription Subscription tier:', data.subscriptions[lastIndex].subscriptionTier);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return subscriptionTier;
};