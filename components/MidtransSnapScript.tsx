import Script from "next/script";

const MIDTRANS_SNAP_URL = "https://app.midtrans.com/snap/snap.js";

export default function MidtransSnapScript() {
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  if (!clientKey) {
    return null;
  }

  return (
    <Script
      id="midtrans-snap"
      src={MIDTRANS_SNAP_URL}
      data-client-key={clientKey}
      strategy="afterInteractive"
    />
  );
}
