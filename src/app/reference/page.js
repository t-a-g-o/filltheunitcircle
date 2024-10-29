/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Header from '@/components/Header';
import { motion } from 'framer-motion';

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
    "-2.617993877991494": "-5/6",
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
const ReferenceCircle = ({ showTips }) => {
  const [quadrantPosition, setQuadrantPosition] = useState({ x: 0, y: 0 });
  const [trigPosition, setTrigPosition] = useState({ x: 0, y: 0 });
  const [coordPosition, setCoordPosition] = useState({ x: 0, y: 0 });
  const [radianPosition, setRadianPosition] = useState({ x: 0, y: 0 });

  // Helper function to ensure consistent number formatting
  const formatPosition = (num) => Number(num.toFixed(4));
  
  // Helper function to calculate position on circle
  const getPositionOnCircle = (angle, radius = 50) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: formatPosition(50 + (radius * Math.cos(radians))),
      y: formatPosition(50 - (radius * Math.sin(radians)))
    };
  };

  return (
    
    <div className="w-full max-w-[1000px] h-[1000px] mx-auto p-16 relative">
      <div className="w-full h-full relative border-2 border-gray-200 dark:border-gray-700 rounded-full">
        {/* Tips Overlay */}
        {showTips ? (
          <>
            {/* Quadrant Labels */}
            <div className="absolute top-[25%] left-[25%] text-lg font-semibold text-blue-600">x-1</div>
            <div className="absolute bottom-[25%] left-[25%] text-lg font-semibold text-blue-600">x+1</div>
            <div className="absolute bottom-[25%] right-[25%] text-lg font-semibold text-blue-600">2x-1</div>
            
            {/* Update Quadrant Formulas Box to be draggable */}
            <motion.div 
              drag
              dragMomentum={false}
              dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
              className="absolute top-3 right-[-35%] bg-white/90 dark:bg-gray-950/90 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm cursor-move"
              style={{ x: radianPosition.x, y: radianPosition.y }}
              onDragEnd={(event, info) => {
                setRadianPosition({
                  x: radianPosition.x + info.offset.x,
                  y: radianPosition.y + info.offset.y
                });
              }}
            >
              <div className="text-sm space-y-2">
                <div className="font-semibold border-b pb-1">Quick Radian Method:</div>
                <div>If angle in Q1 is n/x, other quadrants are:</div>
                <div className="pl-2 space-y-1">
                  <div>
                    <span className="font-medium text-blue-600">Q2:</span> (x-n)/x
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Q3:</span> (x+n)/x
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Q4:</span> (2x-n)/x
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Common angles at their actual positions on circle */}
            {[30, 45, 60].map(angle => {
              const pos = getPositionOnCircle(angle, 50);
              const labelPos = getPositionOnCircle(angle, 62);
              return (
                <div key={angle}>
                  <div 
                    className="absolute w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-950"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                  <div 
                    className="absolute text-sm font-medium whitespace-nowrap bg-white/90 dark:bg-gray-950/90 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm"
                    style={{
                      left: `${labelPos.x}%`,
                      top: `${labelPos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {angle}° ({formatValue((angle * Math.PI) / 180)})
                  </div>
                </div>
              );
            })}

            {/* Cardinal Points with Values */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-sm font-medium">
              <div>90° (π/2)</div>
              <div className="text-gray-600">sin = 1, cos = 0</div>
              <div className="text-gray-600">tan = undefined</div>
            </div>
            <div className="absolute right-0 top-1/2 translate-x-6 -translate-y-1/2 text-sm font-medium">
              <div>0° (0)</div>
              <div className="text-gray-600">sin = 0, cos = 1</div>
              <div className="text-gray-600">tan = 0</div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-sm font-medium">
              <div>270° (3π/2)</div>
              <div className="text-gray-600">sin = -1, cos = 0</div>
              <div className="text-gray-600">tan = undefined</div>
            </div>
            <div className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 text-sm font-medium">
              <div>180° (π)</div>
              <div className="text-gray-600">sin = 0, cos = -1</div>
              <div className="text-gray-600">tan = 0</div>
            </div>

            {/* Update Tips Box to be draggable */}
            <motion.div 
              drag
              dragMomentum={false}
              dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
              className="absolute top-4 left-4 bg-white/90 dark:bg-gray-950/90 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm cursor-move"
              style={{ x: trigPosition.x, y: trigPosition.y }}
              onDragEnd={(event, info) => {
                setTrigPosition({
                  x: trigPosition.x + info.offset.x,
                  y: trigPosition.y + info.offset.y
                });
              }}
            >
              <div className="text-sm space-y-2">
                <div className="font-semibold border-b pb-1">Trigonometric Functions:</div>
                <div>
                  <span className="font-medium text-blue-600">sin θ</span> = y-coordinate (opposite/hypotenuse)
                </div>
                <div>
                  <span className="font-medium text-green-600">cos θ</span> = x-coordinate (adjacent/hypotenuse)
                </div>
                <div>
                  <span className="font-medium text-purple-600">tan θ</span> = sin θ/cos θ (opposite/adjacent)
                </div>
              </div>
            </motion.div>

            {/* Update Coordinate Tips to be draggable */}
            <motion.div 
              drag
              dragMomentum={false}
              dragConstraints={{ left: -400, right: 400, top: -300, bottom: 300 }}
              className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-950/90 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm cursor-move"
              style={{ x: coordPosition.x, y: coordPosition.y }}
              onDragEnd={(event, info) => {
                setCoordPosition({
                  x: coordPosition.x + info.offset.x,
                  y: coordPosition.y + info.offset.y
                });
              }}
            >
              <div className="text-sm space-y-1">
                <div className="font-semibold">Coordinates Tips:</div>
                <div>• (cos θ, sin θ)</div>
                <div>• x² + y² = 1</div>
                <div>• tan = y/x</div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Original circle content */}
            {commonAngles.map((angle, index) => {
              const point = getPointPosition(angle);
              const values = getCorrectAnswers(angle);
              const radius = 50;
              
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
                  {/* Radius Line with Angle Label */}
                  <div 
                    className="absolute top-1/2 left-1/2 origin-left h-[1px] bg-gray-300/40 dark:bg-gray-600/40 hover:bg-blue-400/40 dark:hover:bg-blue-400/40 transition-colors duration-200"
                    style={{
                      width: '50%',
                      transform: `rotate(${-angle}deg)`,
                      zIndex: 1
                    }}
                  >
                    <div 
                      className="absolute text-xs font-medium bg-white/90 dark:bg-gray-950/90 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm"
                      style={{
                        left: '25%',
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${angle > 90 && angle < 270 ? 180 : 0}deg)
                        `,
                        color: 'rgb(37 99 235)', // blue-600
                        minWidth: '28px',
                        textAlign: 'center',
                        zIndex: 10
                      }}
                    >
                      <div className="flex gap-1">
                        <span>{angle}°</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {formatValue(values.radians)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Point */}
                  <div 
                    className="absolute"
                    style={{
                      left: `${exactX}%`,
                      top: `${exactY}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 20,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 ring-2 ring-white dark:ring-gray-950 shadow-md" />
                  </div>

                  {/* Combined Info Box */}
                  <div 
                    className="absolute text-[0.7rem] leading-tight whitespace-nowrap"
                    style={{
                      left: `${trigLabelX}%`,
                      top: `${trigLabelY}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 15,
                    }}
                  >
                    <div className="flex flex-col items-start bg-white/90 dark:bg-gray-950/90 rounded-md px-2 py-1 border border-gray-200 dark:border-gray-800 shadow-sm">
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
                            {angle === 90 || angle === 270 ? 'undefined' : formatValue(values.tangent)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Always show axes */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300/50" />
        <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gray-300/50" />
      </div>
    </div>
  );
};

// Main component
export default function ReferencePage() {
  const [showVisual, setShowVisual] = useState(true);
  const [showTips, setShowTips] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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

        {/* Visual Reference */}
        {showVisual && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-4 px-4">
                <Switch
                  id="show-tips"
                  checked={showTips}
                  onCheckedChange={setShowTips}
                />
                <Label htmlFor="show-tips">Show Unit Circle Tips</Label>
              </div>
              <ReferenceCircle showTips={showTips} />
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
    </div>
  );
} 