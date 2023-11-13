import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

import Container from "~/components/Container";
import CheckoutForm from "~/components/forms/CheckoutForm";
import { CartItems } from "~/components/shop/CartItems";
import { CartTotal } from "~/components/shop/CartTotal";
import Navbar from "~/components/shop/Navbar";
import { prisma } from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const cart = url.searchParams.getAll("id");
    const paymentIntentId = url.searchParams.get("paymentIntentId");

    const [featureProducts, categoryProducts] = await Promise.all([
      prisma.featureProduct.findMany({
        where: { id: { in: cart } },
        include: { media: true },
      }),
      prisma.categoryProduct.findMany({
        where: { id: { in: cart } },
        include: { media: true },
      }),
    ]);

    const data = [...featureProducts, ...categoryProducts];

    if (!data.length) {
      return redirect("/");
    }

    let paymentIntent;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
    });

    if (!paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: data.reduce((acc, curr) => acc + curr.price, 0) * 100,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
          items: JSON.stringify(data.map((item) => item.id)),
        },
        description: data.map((item) => item.title).join(", "),
      });
    } else {
      paymentIntent = await stripe.paymentIntents.update(paymentIntentId, {
        amount: data.reduce((acc, curr) => acc + curr.price, 0) * 100,
        metadata: {
          items: JSON.stringify(data.map((item) => item.id)),
        },
      });
    }

    if (!paymentIntent) {
      return redirect("/");
    }

    return json(
      {
        data,
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        paymentIntentId: paymentIntent.id,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.log(error);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};

const appearance = {
  theme: "stripe" as const,

  variables: {
    colorPrimary: "#8b5cf6",
    // colorBackground: "#e2e8f0",
    colorText: "#000000",
    colorDanger: "##f43f5e",
    fontFamily: "Playfair Display",
    // spacingUnit: "2px",
    // borderRadius: "4px",
    // See all possible variables below
  },
};

export default function Cart() {
  // @ts-expect-error remix is a mess
  const { clientSecret, publishableKey, paymentIntentId, data } =
    useLoaderData();
  const stripePromise = loadStripe(publishableKey);

  return (
    <main>
      <Navbar />
      <div className="h-24 w-full"></div>
      <Container>
        <div className="px-3 pb-10 md:px-0">
          <CartItems paymentIntentId={paymentIntentId} items={data} />
          <hr className="my-4" />
          <CartTotal items={data} />
          <hr className="my-4" />
          <Elements
            options={{ clientSecret, appearance }}
            stripe={stripePromise}
          >
            <CheckoutForm />
          </Elements>
        </div>
      </Container>
    </main>
  );
}
