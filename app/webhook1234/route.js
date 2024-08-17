import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
// import { OrderTable, db } from "@/lib/drizzleOrm";
import { headers } from "next/headers";
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

  switch (event.type) {
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      // Then define and call a function to handle the event charge.succeeded
      // update customer subscription type in Firestore
      console.log('charge succeeded', chargeSucceeded)


      
      
      break;
    case 'charge.updated':
      const chargeUpdated = event.data.object;
      // Then define and call a function to handle the event charge.updated
      break;
    case 'customer.subscription.created':
      const customerSubscriptionCreated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.created
      break;
    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      // Then define and call a function to handle the event customer.subscription.updated
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