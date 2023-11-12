// import type { ActionArgs, ActionFunction } from "@remix-run/node";
// import { json } from "@remix-run/node";

// import Stripe from "stripe";

// export const action: ActionFunction = async ({ request }: ActionArgs) => {
//   const data = await request.text();
//   const signature = request.headers.get("stripe-signature");

//   const secretKey = process.env.STRIPE_SECRET_KEY;
//   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

//   if (!secretKey || !webhookSecret) {
//     return json({ error: "Missing Stripe Config" }, { status: 500 });
//   }

//   const stripe = new Stripe(secretKey, {
//     apiVersion: "2023-08-16",
//   });

//   if (!signature) {
//     return json({ error: "Missing Signature" }, { status: 400 });
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(data, signature, webhookSecret);
//   } catch (err) {
//     return json(
//       { error: "Webhook signature verification failed" },
//       { status: 400 }
//     );
//   }

//   if (!event) return json({ error: "Missing Event" }, { status: 400 });

//   // Handle the checkout.session.completed event
//   if (event.type === "checkout.session.completed") {
//     // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
//     const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
//       event.data.object.id,
//       {
//         expand: ["line_items"],
//       }
//     );

//     if (sessionWithLineItems.payment_status === "paid") {
//       // Fulfill the purchase.
//     }
//   }

//   return json({ received: true });
// };
