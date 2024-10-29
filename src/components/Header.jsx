import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">π</span>
          </div>
          <div className="flex items-baseline">
            <h1 className="text-2xl font-bold text-foreground">
              Unit Circle Practice
            </h1>
            <span className="text-sm text-muted-foreground ml-0.5">.tago.works</span>
          </div>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
} 