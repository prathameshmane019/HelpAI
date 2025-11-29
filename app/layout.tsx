import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HelpAI - Intelligent Customer Support Automation",
    template: "%s | HelpAI"
  },
  description: "Transform your customer support with HelpAI's intelligent automation. AI-powered helpdesk that resolves tickets instantly, understands context, and empowers your team with real-time insights.",
  keywords: [
    "AI helpdesk",
    "customer support automation",
    "AI chatbot",
    "ticket management",
    "customer service AI",
    "help desk software",
    "automated support",
    "AI customer service",
    "intelligent automation",
    "support ticket system"
  ],
  authors: [{ name: "HelpAI Team" }],
  creator: "HelpAI",
  publisher: "HelpAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://helpai.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HelpAI - Intelligent Customer Support Automation",
    description: "AI-powered helpdesk that resolves tickets instantly, understands context, and automates workflows. Transform your support operations today.",
    url: "https://helpai.com",
    siteName: "HelpAI",
    images: [
      {
        url: "/og-image.png", // Create this image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: "HelpAI - Intelligent Customer Support",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HelpAI - Intelligent Customer Support Automation",
    description: "Transform your customer support with AI-powered automation. Instant resolutions, context understanding, and real-time insights.",
    images: ["/twitter-image.png"], // Create this image (1200x600px recommended)
    creator: "@helpai", // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="canonical" href="https://helpai.com" />
        
        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "HelpAI",
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "250"
              },
              "description": "AI-powered customer support automation platform that resolves tickets instantly and empowers support teams.",
              "operatingSystem": "Web",
              "softwareVersion": "1.0",
              "provider": {
                "@type": "Organization",
                "name": "HelpAI",
                "url": "https://helpai.com"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}