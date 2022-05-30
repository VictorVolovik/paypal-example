import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

declare global {
  interface Window {
    ENV: Record<string, string>;
  }
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "PayPal example",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async () => {
  return json({
    ENV: {
      PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
      PAYPAL_MONTHLY_PLAN_ID: process.env.PAYPAL_MONTHLY_PLAN_ID,
      PAYPAL_YEARLY_PLAN_ID: process.env.PAYPAL_YEARLY_PLAN_ID,
    },
  });
};

export default function App() {
  const { ENV } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
