import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
// import { OrderTable, db } from "@/lib/drizzleOrm";
import { headers } from "next/headers";
import admin from "@/firebaseAdmin";
import { getDocs, query, where } from "firebase/firestore";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_TEST, {
  apiVersion: "2022-11-15",
});

export async function POST(request) {
  const body = await request.text();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_TEST;
  const sig = headers().get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }
  console.log('event', event.type)

  switch (event.type) {
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      // Then define and call a function to handle the event charge.succeeded
      // update customer subscription type in Firestore
      console.log('charge succeeded', chargeSucceeded.paid)
      break;
    case 'charge.updated':
      const chargeUpdated = event.data.object;
      // Then define and call a function to handle the event charge.updated
      break;
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      break;
    // case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      console.log('checkout session completed', checkoutSessionCompleted)

      // get session id
      const { id: sessionId } = checkoutSessionCompleted

      // get session object to get the purchased products
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {expand: ['line_items']})
      // get purchased products
      console.log('checkoutSession.line_items.data: ', checkoutSession.line_items.data)
      
      break;

    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated

      // console.log('customer subscription updated', customerSubscriptionUpdated)

      // retrieve product to get its name
      const product = await stripe.products.retrieve(customerSubscriptionUpdated.items.data[0].price.product)

      console.log('product: ', product)

      const availableSubscriptionTiers = {
        'myproduct': 'myproduct',
        'Starter': 'starter',
        'Pro (but Free)': 'pro',
        'Ultimate': 'ultimate',
      }
      const subscriptionTier = availableSubscriptionTiers[product.name]

      // console.log('customerSubscriptionUpdated.items.data', customerSubscriptionUpdated.items.data)

      // fields needed:
      {/* 

        eventId - event.id
        customerId - customerSubscriptionUpdated.customer
        productId - customerSubscriptionUpdated.items.data[0].price.product
        subscriptionId - customerSubscriptionUpdated.id
        subscriptionTier - customerSubscriptionUpdated.items.data[0].price.nickname
        current_period_start - customerSubscriptionUpdated.current_period_start
        current_period_end - customerSubscriptionUpdated.current_period_end
        cancel_at_period_end - customerSubscriptionUpdated.cancel_at_period_end
         */}
      console.log('eventId: ', event.id)
      console.log('customerId: ', customerSubscriptionUpdated.customer)
      console.log('productId: ', customerSubscriptionUpdated.items.data[0].price.product)
      console.log('subscriptionId: ', customerSubscriptionUpdated.id)
      console.log('subscriptionTier: ', customerSubscriptionUpdated.items.data[0].price.nickname)
      console.log('current_period_start: ', customerSubscriptionUpdated.current_period_start)
      console.log('current_period_end: ', customerSubscriptionUpdated.current_period_end)
      console.log('cancel_at_period_end: ', customerSubscriptionUpdated.cancel_at_period_end)
      
      // update customer subscription type in Firestore
      const customerId = customerSubscriptionUpdated.customer;
      // find customer in firestore with this customerId
      const usersRef = admin.firestore().collection('users')
      
      // PROD: use customer id from event
      // const targetCustomerId = customerId;
      // TESTING: use customer id that's already in firestore
      const targetCustomerId = 'cus_QhtgJYqBcHzazS'
      
      const querySnapshot = await usersRef.where('stripe_customer_id', '==', targetCustomerId).get();

      // update customer subscription type in Firestore
      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return;
      }
      else {
        querySnapshot.forEach((doc) => {
          // console.log('customer', doc.id, '=>', doc.data());
          const user = doc.data();
          const eventId = event.id
          const subscriptionId = customerSubscriptionUpdated.id
          const current_period_start = customerSubscriptionUpdated.current_period_start
          const current_period_end = customerSubscriptionUpdated.current_period_end
          const cancel_at_period_end = customerSubscriptionUpdated.cancel_at_period_end
          const subscription = {
            eventId, 
            customerId,
            productId: customerSubscriptionUpdated.items.data[0].price.product,
            subscriptionId,
            subscriptionTier,
            current_period_start,
            current_period_end,
            cancel_at_period_end
          }
          if (!user.subscriptions) {
            user.subscriptions = []
          }
          user.subscriptions = [...user.subscriptions, subscription]
          usersRef.doc(doc.id).set(user)
        });
      }
      
      break;
    case 'invoice.created':
      const invoiceCreated = event.data.object;
      // Then define and call a function to handle the event invoice.created
      break;
    case 'invoice.finalized':
      const invoiceFinalized = event.data.object;
      // Then define and call a function to handle the event invoice.finalized
      break;
    case 'invoice.paid':
      const invoicePaid = event.data.object;
      // Then define and call a function to handle the event invoice.paid
      break;
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event invoice.payment_succeeded
      break;
    case 'payment_intent.created':
      const paymentIntentCreated = event.data.object;
      // Then define and call a function to handle the event payment_intent.created
      break;
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response("RESPONSE EXECUTE", {
    status: 200,
  });
}


// get test function

export async function GET() {
  return NextResponse.json({
    message: 'Hello, World!',
  })
}