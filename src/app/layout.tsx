import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LocationModal from "@/components/ui/LocationModal";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import ChatWidget from "@/components/ChatWidget";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Harun Store - Premium Online Shopping",
    template: "%s | Harun Store"
  },
  description: "Shop premium electronics, fashion, home & living products at Harun Store. Fast delivery, secure payments, and 24/7 customer support. Best deals and offers!",
  keywords: ["online shopping", "electronics", "fashion", "home decor", "best deals", "free delivery", "harun store"],
  authors: [{ name: "Harun Store" }],
  creator: "Harun Store",
  publisher: "Harun Store",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://harunstore.com",
    siteName: "Harun Store",
    title: "Harun Store - Premium Online Shopping",
    description: "Shop premium electronics, fashion, home & living products. Best deals and fast delivery!",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Harun Store Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harun Store - Premium Online Shopping",
    description: "Shop premium products with fast delivery and best deals!",
    images: ["/logo.png"],
    creator: "@harunstore",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Harun Store",
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f1f3f6] dark:bg-[#121212]`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LocationModal />
            {children}
            <ChatWidget />
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
