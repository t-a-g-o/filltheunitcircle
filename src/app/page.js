import { Card, CardContent } from "@/components/ui/card";
import UnitCircle from '@/components/UnitCircle';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto p-8">
        <div className="space-y-8">
          {/* Introduction Card */}
          <Card className="border-2 shadow-md">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold mb-4 text-center">
                Understanding the Unit Circle
              </h1>
              <p className="text-muted-foreground mb-6">
                The unit circle is a fundamental concept in trigonometry and mathematics. It&apos;s a circle with a radius of 1 unit, centered at the origin (0,0) of a coordinate plane. This simple but powerful tool helps us:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Visualize trigonometric functions (sine, cosine, tangent)</li>
                <li>Understand angle measurements in both degrees and radians</li>
                <li>Find coordinates and trigonometric values for any angle</li>
                <li>See the relationships between different angles and their trig values</li>
              </ul>
            </CardContent>
          </Card>

          {/* Interactive Unit Circle Card */}
          <Card className="overflow-hidden border-2 shadow-md">
            <UnitCircle />
          </Card>
          <Toaster />
          
          {/* Practice & Reference Section */}
          <Card className="border-2 shadow-md">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Learn & Practice
              </h2>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
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
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access our comprehensive reference guide
                  </p>
                  <Link href="/reference">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-sm">
                      View Tips & Reference
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Project Card */}
          <Card className="border-2 shadow-md bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                By Students, For Students
              </h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="text-center mb-4">
                  This interactive unit circle tool was created by a student who wanted to make trigonometry more approachable and intuitive.

                  The project continues to evolve based on student needs and suggestions. Every feature was carefully designed to help others understand and master the unit circle, from interactive practice to comprehensive reference materials.
                </p>
                <p className="text-center text-sm italic">
                  No ads, no paywalls - just a simple desire to help other students master the unit circle.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
