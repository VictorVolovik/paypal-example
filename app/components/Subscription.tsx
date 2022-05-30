import React from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import type {
  PayPalScriptOptions,
  CreateSubscriptionActions,
} from "@paypal/paypal-js/types";

type SubscriptionCycle = "monthly" | "yearly";

const ButtonWrapper = () => {
  const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
  const [subscriptionCycle, setSubscriptionCycle] =
    React.useState<SubscriptionCycle>("monthly");

  /**
   *
   * do we need to realod the whole PayPal SDK to generate new button & show some spinner
   * or can we continue using forceReRender
   * @see https://paypal.github.io/react-paypal-js/?path=/docs/example-paypalbuttons--default
   */
  // React.useEffect(() => {
  //   dispatch({
  //     type: "resetOptions",
  //     value: {
  //       ...options,
  //     },
  //   });
  // }, [subscriptionCycle]);

  const createSubscription = async (
    data: Record<string, unknown>,
    actions: CreateSubscriptionActions
  ) => {
    return actions.subscription
      .create({
        plan_id:
          subscriptionCycle === "monthly"
            ? globalThis.window?.ENV.PAYPAL_MONTHLY_PLAN_ID
            : globalThis.window?.ENV.PAYPAL_YEARLY_PLAN_ID,
      })
      .then((orderId) => {
        // Your code here after create the order
        return orderId;
      });
  };

  return (
    <>
      <div style={{ margin: "20px 0" }}>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={subscriptionCycle === "monthly"}
            onChange={() => setSubscriptionCycle("monthly")}
          />
          Monthly
        </label>

        <label>
          <input
            type="radio"
            value="yearly"
            checked={subscriptionCycle === "yearly"}
            onChange={() => setSubscriptionCycle("yearly")}
          />
          Yearly
        </label>
      </div>

      {isPending ? <span>loading...</span> : null}
      <PayPalButtons
        forceReRender={[subscriptionCycle]}
        createSubscription={createSubscription}
        style={{
          label: "paypal",
          color: "blue",
        }}
      />
    </>
  );
};

const Subscription = () => {
  const initialOptions: PayPalScriptOptions = {
    "client-id": globalThis.window?.ENV.PAYPAL_CLIENT_ID,
    currency: "USD",
    components: "buttons",
    intent: "subscription",
    vault: true,
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <ButtonWrapper />
    </PayPalScriptProvider>
  );
};

export default Subscription;
