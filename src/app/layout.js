import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ThemeToggle } from "@/components/theme-toggle";

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
    "ASTC rule",
    "special angles",
    "radian conversion",
    "quadrant rules",
    "common angle values", 
    "trig ratios",
    "precalculus",
    "math study guide",
    "trigonometric functions",
    "math visualization",
    "interactive math",
    "angle measures",
    "unit circle degrees",
    "unit circle radians",
    "math education",
    "trig circle",
    "trigonometry calculator",
    "unit circle practice",
    "learn trigonometry",
    "trig practice problems",
    "trigonometry angles",
    "math help",
    "math tutor",
    "geometry",
    "calculus prep",
    "math exercises",
    "trig identities",
    "angle conversion",
    "math reference",
    "math practice tool",
    "trigonometry tutorial",
    "math study aid",
    "trig angle calculator",
    "math learning resources",
    "interactive trigonometry",
    "math practice problems",
    "trigonometry study guide",
    "math concepts",
    "angle measurement",
    "math visualization tool"
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t py-4 px-6">
            <div className="container mx-auto flex justify-between items-center text-sm text-muted-foreground">
              <div>
                Developed with <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block bottom-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> by <a href="https://tago.works"
                  className="hover:text-foreground transition-all duration-200 opacity-80 hover:opacity-100 hover:underline decoration-2 underline-offset-4" 
                  target="_blank" 
                  rel="noopener noreferrer">tago</a>
              </div>
              <div className="space-x-6 flex items-center">
                <ThemeToggle />
                <a href="https://github.com/t-a-g-o/filltheunitcircle" 
                  className="hover:text-foreground transition-all duration-200 opacity-80 hover:opacity-100 hover:underline decoration-2 underline-offset-4" 
                  target="_blank" 
                  rel="noopener noreferrer">GitHub</a>
                <span>|</span>
                <a href="https://github.com/t-a-g-o/filltheunitcircle/issues" 
                  className="hover:text-foreground transition-all duration-200 opacity-80 hover:opacity-100 hover:underline decoration-2 underline-offset-4" 
                  target="_blank" 
                  rel="noopener noreferrer">Report Issues</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
