import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Unit Circle Practice",
  description: "Master the unit circle with our interactive practice tool. Features comprehensive references, study tips, and exercises for trigonometry students. Learn sine, cosine, and tangent values effortlessly.",
  keywords: [
    "unit circle",
    "trigonometry practice",
    "trig values",
    "sine cosine tangent",
    "math practice",
    "trigonometry reference",
    "unit circle calculator",
    "math learning tool",
  ],
  authors: [{ name: "tagoWorks" }],
  openGraph: {
    title: "Unit Circle Practice | Interactive Trigonometry Learning Tool",
    description: "Master the unit circle with our interactive practice tool. Features comprehensive references, study tips, and exercises for trigonometry.",
    type: "website",
    locale: "en_US",
    siteName: "Unit Circle Practice",
  },
  twitter: {
    title: "Unit Circle Practice | Interactive Trigonometry Learning Tool",
    description: "Master the unit circle with our interactive practice tool. Features comprehensive references, study tips, and exercises for trigonometry.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
