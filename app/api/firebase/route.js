import { NextResponse } from 'next/server'
import admin from '../../../firebaseAdmin'

export async function GET() {
  // somehow get userId from 
  const userId = '123' // firebase userId, not stripe customer_id
  const userRef = admin.firestore().doc(`users/${userId}`);
  const newTier = subscription.items.data[0].plan.nickname.toLowerCase(); // Assuming tier is stored as plan nickname
  await userRef.update({ subscriptionTier: 'Pro' });

  
  
  return NextResponse.json({
    message: 'Hello, World!',
  })
}