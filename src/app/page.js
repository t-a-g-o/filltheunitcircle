import { Card, CardContent } from "@/components/ui/card";
import UnitCircle from '@/components/UnitCircle';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          <Card className="overflow-hidden border-2 shadow-md">
            <UnitCircle />
          </Card>
          <Toaster />
          
          <Card className="border-2 shadow-md">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Practice & Learn
              </h2>
              <p className="text-center text-muted-foreground mb-6">
                Master the unit circle through interactive visualization and practice
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border">
                  <h3 className="font-medium mb-2">Trigonometric Values</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice sine and cosine values at different angles
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border">
                  <h3 className="font-medium mb-2">Angle Measurements</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn common angle measurements and their relationships
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border">
                  <h3 className="font-medium mb-2">Degree-Radian Conversion</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand the relationship between degrees and radians
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
