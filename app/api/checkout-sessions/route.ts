import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import admin from '../../../firebaseAdmin'

// const formatAmountForStripe = (amount, currency) => {
//   return Math.round(amount * 100)
//  }

const STRIPE_SECRET_KEY_TEST = process.env.STRIPE_SECRET_KEY_TEST || ''

const stripe = new Stripe(STRIPE_SECRET_KEY_TEST, {
  apiVersion: '2024-06-20',
  // apiVersion: '2022-11-15',
})

// Create checkout session, called when user clicks on a purchase button
export async function POST(req: Request) {
  const body = await req.json()
  const { priceId, email, userId } = body

  try {
    // Link firestore userId to stripe customer_id

    // check if user exists in firestore
    const userRef = admin.firestore().doc(`users/${userId}`);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      // create user in firestore if it doesn't exist
      await userRef.set({ });
    }

    // check if user has stripe_customer_id in firestore
    let stripe_customer_id = null;
    const user = await userRef.get();
    if (!user || !user.data() || !user.data()?.stripe_customer_id) {
      // Create customer in Stripe and get customer id if it doesn't exist
      const customer = await stripe.customers.create({
        email: email,
      })

      stripe_customer_id = customer.id

      // save customer id as attribute of user in firestore
      await userRef.update({ stripe_customer_id: customer.id });
    }
    else {
      // get stripe customer id from firestore
      stripe_customer_id = user.data()?.stripe_customer_id;
      // customer = await stripe.customers.retrieve(stripe_customer_id); // what to do with this customer?
    }
    
    // Create checkout session
    const params: Stripe.Checkout.SessionCreateParams = {
      customer: stripe_customer_id, // to pre-populate customer details such as email
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          // price_data: {
          //   currency: 'usd',
          //   product_data: {
          //     name: 'Pro subscription',
          //   },
          //   unit_amount: formatAmountForStripe(10, 'usd'), // $10.00
          //   recurring: {
          //     interval: 'month',
          //     interval_count: 1,
          //   },
          // },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get(
        'Referer',
      )}result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get(
        'Referer',
      )}result?session_id={CHECKOUT_SESSION_ID}`,
    }
    
    const checkoutSession = await stripe.checkout.sessions.create(params)
    
    return NextResponse.json(checkoutSession, {
      status: 200,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    })
  }
}

// Get checkout session
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const session_id = searchParams.get('session_id')

  try {
    if (!session_id) {
      throw new Error('Session ID is required')
    }

    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(session_id)

    return NextResponse.json(checkoutSession)
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error)
    return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  }
}

