import Script from "next/script";

export default function MidtransSnapScript() {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction =
    process.env.MIDTRANS_IS_PRODUCTION === "true" ||
    process.env.NEXT_PUBLIC_MIDTRANS_ENV === "production";

  if (!clientKey) {
    return null;
  }

  return (
    <Script
      id="midtrans-snap"
      src={
        isProduction
          ? "https://app.midtrans.com/snap/snap.js"
          : "https://app.sandbox.midtrans.com/snap/snap.js"
      }
      data-client-key={clientKey}
      strategy="afterInteractive"
    />
  );
}
