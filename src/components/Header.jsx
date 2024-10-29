import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  return (
    <nav className="border-b bg-card shadow-sm">
      <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">π</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Unit Circle Practice
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
} 