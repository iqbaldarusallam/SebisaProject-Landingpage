import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Passion_One } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
});

const passionOne = Passion_One({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-passion",
});

export const metadata: Metadata = {
  title: "Sebisa Project | Digital Agency",
  description:
    "Digital agency untuk website, social media, branding, dan digital marketing bisnis",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${passionOne.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
