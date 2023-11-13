import {
  AddressElement,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { FormEvent } from "react";
import { useState } from "react";
import "../../styles/stripe.css";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "https://jewelrybygeorgia.com",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || null);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Contact</h2>
        <LinkAuthenticationElement />
      </div>
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Payment</h2>
        <PaymentElement />
      </div>
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Shipping Address</h2>
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["us"],
          }}
        />
      </div>
      <button disabled={isLoading || !stripe || !elements} id="stripe-submit">
        <span id="button-text">
          {isLoading ? (
            <div className="stripe-spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
