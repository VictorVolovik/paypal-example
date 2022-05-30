import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import type {
  PayPalScriptOptions,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
} from "@paypal/paypal-js/types";

const ButtonWrapper = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = (
    data: Record<string, unknown>,
    actions: CreateOrderActions
  ) => {
    const order = {
      purchase_units: [
        {
          amount: {
            value: "10",
          },
        },
      ],
    };

    return actions.order.create(order);
  };

  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    return actions!.order!.capture().then((details) => {
      const name = details.payer.name?.given_name;
      console.log(`Transaction completed by ${name}`);
    });
  };

  return (
    <>
      {isPending ? <span>loading...</span> : null}
      <PayPalButtons
        style={{ layout: "horizontal", tagline: false }}
        createOrder={createOrder}
        onApprove={handleApprove}
      />
    </>
  );
};

const Payment = () => {
  const initialOptions: PayPalScriptOptions = {
    "client-id": globalThis.window?.ENV.PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  return (
    <div>
      <h2>Payment example</h2>

      <h3>Pay 10 USD</h3>

      <PayPalScriptProvider options={initialOptions}>
        <ButtonWrapper />
      </PayPalScriptProvider>
    </div>
  );
};

export default Payment;
