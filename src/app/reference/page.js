'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const commonAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

// Helper functions
const getPointPosition = (degrees) => {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: Number(Math.cos(radians).toFixed(4)),
    y: Number(Math.sin(radians).toFixed(4))
  };
};

const getCorrectAnswers = (angle) => {
  const radians = (angle * Math.PI) / 180;
  const sin = Number(Math.sin(radians).toFixed(4));
  const cos = Number(Math.cos(radians).toFixed(4));
  
  const specialRadians = {
    0: 0,
    30: Math.PI/6,
    45: Math.PI/4,
    60: Math.PI/3,
    90: Math.PI/2,
    120: 2*Math.PI/3,
    135: 3*Math.PI/4,
    150: 5*Math.PI/6,
    180: Math.PI,
    210: 7*Math.PI/6,
    225: 5*Math.PI/4,
    240: 4*Math.PI/3,
    270: 3*Math.PI/2,
    300: 5*Math.PI/3,
    315: 7*Math.PI/4,
    330: 11*Math.PI/6,
    360: 2*Math.PI
  };
  
  return {
    coordinates: { 
      x: cos,
      y: sin 
    },
    radians: specialRadians[angle] || radians,
    sine: sin,
    cosine: cos,
    tangent: Number((sin / cos).toFixed(4))
  };
};

const formatValue = (value) => {
  const specialValues = {
    0: "0",
    1: "1",
    "-1": "-1",
    0.5: "½",
    "-0.5": "-½",
    0.8660254037844386: "√3/2",
    "-0.8660254037844386": "-√3/2",
    0.8660254: "√3/2",
    "-0.8660254": "-√3/2",
    0.7071067811865476: "√2/2",
    "-0.7071067811865476": "-√2/2",
    0.7071068: "√2/2",
    "-0.7071068": "-√2/2",
    1.7320508075688772: "√3",
    "-1.7320508075688772": "-√3",
    1.7320508: "√3",
    
    "-1.7320508": "-√3",
    3.141592653589793: "π",
    1.5707963267948966: "π/2",
    "-1.5707963267948966": "-π/2",
    4.71238898038469: "3π/2",
    4.7123889803847: "3π/2",
    0.5235987755982989: "π/6",
    "-0.5235987755982989": "-π/6",
    1.0471975511965976: "π/3",
    "-1.0471975511965976": "-π/3",
    2.0943951023931953: "2π/3",
    "-2.0943951023931953": "-2π/3",
    2.356194490192345: "3π/4",
    "-2.356194490192345": "-3π/4",
    2.617993877991494: "5π/6",
    "-2.617993877991494": "-5π/6",
    3.665191429188092: "7π/6",
    3.6651914291881: "7π/6",
  };

  if (specialValues.hasOwnProperty(value)) {
    return specialValues[value];
  }

  if (Math.abs(value) < 10) {
    const piFractions = [
      { val: Math.PI/6, str: "π/6" },
      { val: Math.PI/4, str: "π/4" },
      { val: Math.PI/3, str: "π/3" },
      { val: Math.PI/2, str: "π/2" },
      { val: 2*Math.PI/3, str: "2π/3" },
      { val: 3*Math.PI/4, str: "3π/4" },
      { val: 5*Math.PI/6, str: "5π/6" },
      { val: Math.PI, str: "π" },
      { val: 5*Math.PI/4, str: "5π/4" },
      { val: 4*Math.PI/3, str: "4π/3" },
      { val: 3*Math.PI/2, str: "3π/2" },
      { val: 5*Math.PI/3, str: "5π/3" },
      { val: 7*Math.PI/4, str: "7π/4" },
      { val: 11*Math.PI/6, str: "11π/6" },
      { val: 2*Math.PI, str: "2π" },
    ];

    for (let fraction of piFractions) {
      if (Math.abs(value - fraction.val) < 0.0001) {
        return fraction.str;
      }
      if (Math.abs(value + fraction.val) < 0.0001) {
        return "-" + fraction.str;
      }
    }
  }

  const sqrtValues = [
    { val: Math.sqrt(2), str: "√2" },
    { val: Math.sqrt(3), str: "√3" },
    { val: Math.sqrt(2)/2, str: "√2/2" },
    { val: Math.sqrt(3)/2, str: "√3/2" },
    { val: Math.sqrt(3)/3, str: "√3/3" },
  ];

  for (let sqrt of sqrtValues) {
    if (Math.abs(value - sqrt.val) < 0.0001) {
      return sqrt.str;
    }
    if (Math.abs(value + sqrt.val) < 0.0001) {
      return "-" + sqrt.str;
    }
  }

  return value.toFixed(4);
};

// Move ReferenceCircle outside the main component
const ReferenceCircle = () => {
  // Helper function to ensure consistent number formatting
  const formatPosition = (num) => Number(num.toFixed(4));
  
  return (
    <div className="w-full max-w-[1000px] h-[1000px] mx-auto p-16 relative">
      <div className="w-full h-full relative border-2 border-gray-200 dark:border-gray-700 rounded-full">
        {/* Axes */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300" />
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gray-300" />
        
        {commonAngles.map((angle, index) => {
          const point = getPointPosition(angle);
          const values = getCorrectAnswers(angle);
          const radius = 47;
          
          // Format positions consistently
          const exactX = formatPosition(50 + (radius * values.cosine));
          const exactY = formatPosition(50 - (radius * values.sine));

          const angleLabelRadius = 25;
          const labelOffsetDegrees = 2;
          const labelAngle = angle + labelOffsetDegrees;
          
          // Format label positions consistently
          const angleLabelX = formatPosition(50 + (angleLabelRadius * Math.cos((labelAngle * Math.PI) / 180)));
          const angleLabelY = formatPosition(50 - (angleLabelRadius * Math.sin((labelAngle * Math.PI) / 180)));

          const coordLabelRadius = radius + 3;
          const coordRadians = (angle * Math.PI) / 180;
          const coordLabelX = formatPosition(50 + (coordLabelRadius * Math.cos(coordRadians)));
          const coordLabelY = formatPosition(50 - (coordLabelRadius * Math.sin(coordRadians)));

          const trigLabelRadius = radius + 8;
          const trigLabelX = formatPosition(50 + (trigLabelRadius * Math.cos(coordRadians)));
          const trigLabelY = formatPosition(50 - (trigLabelRadius * Math.sin(coordRadians)));

          // Format rotation consistently
          const rotation = formatPosition(angle > 90 && angle < 270 ? 180 - labelAngle : -labelAngle);

          return (
            <div key={angle}>
              {/* Radius Line */}
              <div 
                className="absolute top-1/2 left-1/2 origin-left h-[1px] bg-gray-300 dark:bg-gray-600"
                style={{
                  width: '47%',
                  transform: `rotate(${-angle}deg)`,
                }}
              />

              {/* Point */}
              <div 
                className="absolute"
                style={{
                  left: `${exactX}%`,
                  top: `${exactY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 ring-1 ring-white dark:ring-gray-950" />
              </div>

              {/* Combined Info Box */}
              <div 
                className="absolute text-[0.7rem] leading-tight whitespace-nowrap"
                style={{
                  left: `${trigLabelX}%`,
                  top: `${trigLabelY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
              >
                <div className="flex flex-col items-start bg-white/90 dark:bg-gray-950/90 rounded-md px-2 py-1 border border-gray-200 dark:border-gray-800 shadow-sm">
                  {/* Angle */}
                  <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 w-full pb-1 mb-1">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{angle}°</span>
                    <span className="text-gray-500 dark:text-gray-400">({formatValue(values.radians)})</span>
                  </div>
                  
                  {/* Coordinates */}
                  <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 w-full pb-1 mb-1">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">Point:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      ({formatValue(values.coordinates.x)}, {formatValue(values.coordinates.y)})
                    </span>
                  </div>
                  
                  {/* Trig Values */}
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-blue-600 dark:text-blue-400 w-8">sin:</span>
                      <span className="text-gray-700 dark:text-gray-300">{formatValue(values.sine)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-green-600 dark:text-green-400 w-8">cos:</span>
                      <span className="text-gray-700 dark:text-gray-300">{formatValue(values.cosine)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 w-8">tan:</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {angle === 90 || angle === 270 ? '∞' : formatValue(values.tangent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main component
export default function ReferencePage() {
  const [showVisual, setShowVisual] = useState(true);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold mb-6">Unit Circle Reference</h1>
      
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding the Unit Circle</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            The unit circle is a circle with a radius of 1 unit, centered at the origin (0,0) of a coordinate plane. 
            It's a fundamental tool in trigonometry that helps us understand the relationships between angles and their 
            trigonometric functions.
          </p>
        </CardContent>
      </Card>

      {/* Key Concepts */}
      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Coordinates (x, y)</h3>
            <p className="text-gray-700 dark:text-gray-300">
              • The x-coordinate represents the cosine of the angle<br />
              • The y-coordinate represents the sine of the angle<br />
              • For any point on the unit circle: x² + y² = 1
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Radians vs Degrees</h3>
            <p className="text-gray-700 dark:text-gray-300">
              • Full circle: 360° = 2π radians<br />
              • Half circle: 180° = π radians<br />
              • Quarter circle: 90° = π/2 radians<br />
              • To convert: radians = degrees × (π/180)
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Special Triangles</h3>
            <p className="text-gray-700 dark:text-gray-300">
              • 30-60-90 triangle: sides ratio 1 : √3 : 2<br />
              • 45-45-90 triangle: sides ratio 1 : 1 : √2
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visual Toggle */}
      <div className="flex items-center gap-2">
        <Label htmlFor="showVisual">Show Visual Reference</Label>
        <Switch
          id="showVisual"
          checked={showVisual}
          onCheckedChange={setShowVisual}
        />
      </div>

      {/* Visual Reference */}
      {showVisual && (
        <Card>
          <CardContent className="p-4">
            <ReferenceCircle />
          </CardContent>
        </Card>
      )}

      {/* Reference Table */}
      <Card>
        <CardHeader>
          <CardTitle>Common Angles Reference Table</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2">Angle (degrees)</th>
                <th className="p-2">Radians</th>
                <th className="p-2">Coordinates (x, y)</th>
                <th className="p-2">Sine</th>
                <th className="p-2">Cosine</th>
                <th className="p-2">Tangent</th>
              </tr>
            </thead>
            <tbody>
              {commonAngles.map(angle => {
                const values = getCorrectAnswers(angle);
                return (
                  <tr key={angle} className="border-b">
                    <td className="p-2 text-center">{angle}°</td>
                    <td className="p-2 text-center">{formatValue(values.radians)}</td>
                    <td className="p-2 text-center">
                      ({formatValue(values.coordinates.x)}, {formatValue(values.coordinates.y)})
                    </td>
                    <td className="p-2 text-center">{formatValue(values.sine)}</td>
                    <td className="p-2 text-center">{formatValue(values.cosine)}</td>
                    <td className="p-2 text-center">
                      {angle === 90 || angle === 270 ? 'undefined' : formatValue(values.tangent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Tips and Tricks */}
      <Card>
        <CardHeader>
          <CardTitle>Tips and Tricks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Memorization Patterns</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Values repeat every 90° with alternating signs</li>
              <li>Sine and cosine values are never greater than 1 or less than -1</li>
              <li>Sine values in quadrant I match cosine values in quadrant II</li>
              <li>The signs follow the ASTC rule (All, Sine, Tangent, Cosine)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 