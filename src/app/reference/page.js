/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { MathJax, MathJaxContext } from "better-react-mathjax";

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
    0.5: "1/2",
    "-0.5": "-1/2",
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

// Add this helper function near the top with other functions
const formatSpecialAngle = (degrees, radians) => {
  // Common angle values in degrees and their special representations
  const specialValues = {
    0: { rad: "0", sin: "0", cos: "1" },
    30: { rad: "π/6", sin: "1/2", cos: "√3/2" },
    45: { rad: "π/4", sin: "√2/2", cos: "√2/2" },
    60: { rad: "π/3", sin: "√3/2", cos: "1/2" },
    90: { rad: "π/2", sin: "1", cos: "0" },
    120: { rad: "2π/3", sin: "√3/2", cos: "-1/2" },
    135: { rad: "3π/4", sin: "√2/2", cos: "-√2/2" },
    150: { rad: "5π/6", sin: "1/2", cos: "-√3/2" },
    180: { rad: "π", sin: "0", cos: "-1" },
    210: { rad: "7π/6", sin: "-1/2", cos: "-√3/2" },
    225: { rad: "5π/4", sin: "-√2/2", cos: "-√2/2" },
    240: { rad: "4π/3", sin: "-√3/2", cos: "-1/2" },
    270: { rad: "3π/2", sin: "-1", cos: "0" },
    300: { rad: "5π/3", sin: "-√3/2", cos: "1/2" },
    315: { rad: "7π/4", sin: "-√2/2", cos: "√2/2" },
    330: { rad: "11π/6", sin: "-1/2", cos: "√3/2" },
    360: { rad: "2π", sin: "0", cos: "1" }
  };

  // Find the closest common angle
  const commonAngles = Object.keys(specialValues).map(Number);
  const closestAngle = commonAngles.reduce((prev, curr) => {
    return Math.abs(curr - degrees) < Math.abs(prev - degrees) ? curr : prev;
  });

  // If we're within 0.0001 of a common angle, return the special value
  if (Math.abs(closestAngle - degrees) < 0.0001) {
    return specialValues[closestAngle].rad;
  }

  // Otherwise return the numeric value
  return radians.toFixed(4);
};

// Move ReferenceCircle outside the main component
const ReferenceCircle = ({ showTips }) => {
  const [quadrantPosition, setQuadrantPosition] = useState({ x: 0, y: 0 });
  const [trigPosition, setTrigPosition] = useState({ x: 0, y: 0 });
  const [coordPosition, setCoordPosition] = useState({ x: 0, y: 0 });
  const [radianPosition, setRadianPosition] = useState({ x: 0, y: 0 });
  const [highlightedAngles, setHighlightedAngles] = useState({});
  const timeoutRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Add useEffect to handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleHighlight = (angle) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear all other highlights and set only the current angle
    setHighlightedAngles({ [angle]: true });
    
    // Store the new timeout ID
    timeoutRef.current = setTimeout(() => {
      setHighlightedAngles({});
      timeoutRef.current = null;
    }, 1500);
  };

  return (
    <MathJaxContext>
      <div className="w-full max-w-[1000px] h-[1000px] mx-auto p-16 relative">
        <div className="w-full h-full relative border-2 border-gray-200 dark:border-gray-700 rounded-full">
          {/* Tips Overlay */}
          {showTips ? (
            <>
              {/* Quadrant Labels with Radian Method */}
              <div className="absolute top-[25%] left-[25%] text-lg font-semibold">
                <div className="text-blue-600">Q2: (x-1)/x</div>
                <div className="text-xs text-gray-600 mt-1">If x=6: 5/6π</div>
              </div>
              <div className="absolute bottom-[25%] left-[25%] text-lg font-semibold">
                <div className="text-blue-600">Q3: (x+1)/x</div>
                <div className="text-xs text-gray-600 mt-1">If x=6: 7/6π</div>
              </div>
              <div className="absolute bottom-[25%] right-[25%] text-lg font-semibold">
                <div className="text-blue-600">Q4: (2x-1)/x</div>
                <div className="text-xs text-gray-600 mt-1">If x=6: 11/6π</div>
              </div>

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
                  <div className="font-semibold border-b pb-1">Quick-FindinRadian Method</div>
                  <div>For any angle π/x in Q1:</div>
                  <div className="pl-2 space-y-1">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-700 dark:text-gray-300">
                        Keep denominator x throughout all quadrants
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">Q2:</span> (x-1)/x
                        <span className="text-gray-500 ml-2">(subtract 1)</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">Q3:</span> (x+1)/x
                        <span className="text-gray-500 ml-2">(add 1)</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-600">Q4:</span> (2x-1)/x
                        <span className="text-gray-500 ml-2">(double x, subtract 1)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 border-t pt-1">
                    Example: Starting with π/6
                    <div className="pl-2 space-y-1">
                      <div>Q1: 1/6π = π/6</div>
                      <div>Q2: 5/6π (6-1=5)</div>
                      <div>Q3: 7/6π (6+1=7)</div>
                      <div>Q4: 11/6π (2x6-1=11)</div>
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
                      className={`absolute top-1/2 left-1/2 origin-left h-[1px] transition-colors duration-200 ${
                        highlightedAngles[angle]
                          ? 'bg-blue-500/60 dark:bg-blue-400/60' 
                          : 'bg-gray-300/40 dark:bg-gray-600/40 hover:bg-blue-400/40 dark:hover:bg-blue-400/40'
                      }`}
                      style={{
                        width: '50%',
                        transform: `rotate(${-angle}deg)`,
                        zIndex: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHighlight(angle)}
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
                          {isMounted && (
                            <>
                              <MathJax>{`$${angle}°$`}</MathJax>
                              <span className="text-gray-500 dark:text-gray-400">
                                <MathJax>{`$${formatValue(values.radians)}$`}</MathJax>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Triangle Line */}
                    <div 
                      className={`absolute transition-colors duration-200 ${
                        highlightedAngles[angle]
                          ? 'bg-blue-500/60 dark:bg-blue-400/60' 
                          : 'bg-gray-500/30'
                      }`}
                      style={{
                        left: `${exactX}%`,
                        top: `${exactY}%`,
                        width: '2px',
                        height: `${Math.abs(50 - exactY)}%`,
                        transform: 'translate(-50%, 0)',
                        transformOrigin: 'top',
                        top: exactY > 50 ? '50%' : `${exactY}%`,
                        zIndex: 1,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHighlight(angle)}
                    />

                    {/* Point */}
                    <div 
                      className="absolute"
                      style={{
                        left: `${exactX}%`,
                        top: `${exactY}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 20,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHighlight(angle)}
                    >
                      <div className={`w-2 h-2 rounded-full ring-2 ring-white dark:ring-gray-950 shadow-md transition-colors duration-200 ${
                        highlightedAngles[angle]
                          ? 'bg-blue-600 scale-150' 
                          : 'bg-blue-500 dark:bg-blue-400'
                      }`} />
                    </div>

                    {/* Combined Info Box */}
                    <div 
                      className="absolute text-[0.7rem] leading-tight whitespace-nowrap"
                      style={{
                        left: `${trigLabelX}%`,
                        top: `${trigLabelY}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 15,
                        cursor: 'pointer'
                      }}
                      onClick={() => handleHighlight(angle)}
                    >
                      <div className={`flex flex-col items-start rounded-md px-2 py-1 border shadow-sm transition-colors duration-200 ${
                        highlightedAngles[angle]
                          ? 'bg-blue-50/90 dark:bg-blue-950/90 border-blue-300 dark:border-blue-700' 
                          : 'bg-white/90 dark:bg-gray-950/90 border-gray-200 dark:border-gray-800'
                      }`}>
                        {/* Coordinates */}
                        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-gray-700 w-full pb-1 mb-1">
                          <span className="font-semibold text-gray-600 dark:text-gray-400">Point:</span>
                          <MathJax>{"$(" + formatValue(values.coordinates.x) + ", " + formatValue(values.coordinates.y) + ")$"}</MathJax>
                        </div>
                        
                        {/* Trig Values */}
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-blue-600 dark:text-blue-400 w-8">sin:</span>
                            <MathJax>{"$" + formatValue(values.sine) + "$"}</MathJax>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-green-600 dark:text-green-400 w-8">cos:</span>
                            <MathJax>{"$" + formatValue(values.cosine) + "$"}</MathJax>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-purple-600 dark:text-purple-400 w-8">tan:</span>
                            <MathJax>
                              {"$" + (angle === 90 || angle === 270 ? "\\text{undefined}" : formatValue(values.tangent)) + "$"}
                            </MathJax>
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
    </MathJaxContext>
  );
};

// Main component
export default function ReferencePage() {
  const [showVisual, setShowVisual] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const [degrees, setDegrees] = useState(0);
  const [radians, setRadians] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["$", "$"]],
      displayMath: [["$$", "$$"]],
      processEscapes: true
    },
    startup: {
      typeset: true
    }
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
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
            <CardContent>
              <MathJaxContext config={mathJaxConfig}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Coordinates Concept Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Coordinates (x, y)</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <MathJax>{"$x = \\cos \\theta$"}</MathJax>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <MathJax>{"$y = \\sin \\theta$"}</MathJax>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <MathJax>{"$x^2 + y^2 = 1$"}</MathJax>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 dark:text-blue-400">•</span>
                        <MathJax>{"$\\tan \\theta = \\frac{y}{x} = \\frac{\\sin \\theta}{\\cos \\theta}$"}</MathJax>
                      </div>
                    </div>
                  </motion.div>

                  {/* Radians vs Degrees Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Radians vs Degrees</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <MathJax>{"$360° = 2\\pi$ rad"}</MathJax>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <MathJax>{"$180° = \\pi$ rad"}</MathJax>
                      </div>
                      <div className="flex items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <MathJax>{"$90° = \\frac{\\pi}{2}$ rad"}</MathJax>
                      </div>
                      
                      {/* Quick Calculator Section */}
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md space-y-3">
                        <h4 className="font-medium text-sm">Quick Calculator</h4>
                        
                        {/* Degrees to Radians */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Degrees to Radians</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={degrees}
                              onChange={(e) => {
                                const deg = parseFloat(e.target.value) || 0;
                                setDegrees(deg);
                                const rad = (deg * Math.PI / 180);
                                setRadians(formatSpecialAngle(deg, rad));
                              }}
                              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                              placeholder="Degrees"
                            />
                            <span>°</span>
                            <span className="w-8 text-center">=</span>
                            <input
                              type="text"
                              value={radians}
                              readOnly
                              className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                            />
                            <span>rad</span>
                          </div>
                        </div>

                        {/* Radians to Degrees */}
                        <div className="space-y-2">
                          <label className="text-sm text-gray-600 dark:text-gray-400">Radians to Degrees</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.0001"
                              value={typeof radians === 'number' ? radians : ''}
                              onChange={(e) => {
                                const rad = parseFloat(e.target.value) || 0;
                                const deg = (rad * 180 / Math.PI);
                                setDegrees(deg.toFixed(4));
                                setRadians(rad);
                              }}
                              className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                              placeholder="Radians"
                            />
                            <span>rad</span>
                            <span>=</span>
                            <input
                              type="text"
                              value={degrees}
                              readOnly
                              className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900"
                            />
                            <span>°</span>
                          </div>
                        </div>

                        {/* Common Values Quick Reference */}
                        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                          <details>
                            <summary className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                              Common Values
                            </summary>
                            <div className="mt-2 space-y-1 pl-4">
                              <div>π ≈ 3.14159</div>
                              <div>30° = π/6 rad</div>
                              <div>45° = π/4 rad</div>
                              <div>60° = π/3 rad</div>
                              <div>90° = π/2 rad</div>
                              <div>180° = π rad</div>
                              <div>270° = 3π/2 rad</div>
                              <div>360° = 2π rad</div>
                            </div>
                          </details>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Quick Convert: rad = deg × (π/180)
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Special Triangles Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold">Quadrant Rules</h3>
                    </div>
                    <div className="space-y-4">
                      {/* ASTC Rule Card */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <h4 className="font-medium mb-2">ASTC Rule (Sign Rules)</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                            <div className="font-medium text-green-600">Quadrant I (0-90°)</div>
                            <div className="text-sm">All positive (+)</div>
                          </div>
                          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                            <div className="font-medium text-blue-600">Quadrant II (90-180°)</div>
                            <div className="text-sm">Only Sine positive (+)</div>
                          </div>
                          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                            <div className="font-medium text-red-600">Quadrant III (180-270°)</div>
                            <div className="text-sm">Only Tangent positive (+)</div>
                          </div>
                          <div className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                            <div className="font-medium text-purple-600">Quadrant IV (270-360°)</div>
                            <div className="text-sm">Only Cosine positive (+)</div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Reference */}
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <h4 className="font-medium mb-2">Common Values Quick Reference</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">30° Values:</div>
                            <ul className="text-sm space-y-1">
                              <li><MathJax>{"$\\sin = \\frac{1}{2}$"}</MathJax></li>
                              <li><MathJax>{"$\\cos = \\frac{\\sqrt{3}}{2}$"}</MathJax></li>
                              <li><MathJax>{"$\\tan = \\frac{1}{\\sqrt{3}}$"}</MathJax></li>
                            </ul>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">45° Values:</div>
                            <ul className="text-sm space-y-1">
                              <li><MathJax>{"$\\sin = \\frac{\\sqrt{2}}{2}$"}</MathJax></li>
                              <li><MathJax>{"$\\cos = \\frac{\\sqrt{2}}{2}$"}</MathJax></li>
                              <li><MathJax>{"$\\tan = 1$"}</MathJax></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </MathJaxContext>
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
                <MathJaxContext>
                  <ReferenceCircle showTips={showTips} />
                </MathJaxContext>
              </CardContent>
            </Card>
          )}

          {/* Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle>Common Angles Reference Table</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {isMounted && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="p-2">
                        <MathJax>{"$\\text{Angle (degrees)}$"}</MathJax>
                      </th>
                      <th className="p-2">
                        <MathJax>{"$\\text{Radians}$"}</MathJax>
                      </th>
                      <th className="p-2">
                        <MathJax>{"$\\text{Coordinates } (x, y)$"}</MathJax>
                      </th>
                      <th className="p-2">
                        <MathJax>{"$\\text{Sine}$"}</MathJax>
                      </th>
                      <th className="p-2">
                        <MathJax>{"$\\text{Cosine}$"}</MathJax>
                      </th>
                      <th className="p-2">
                        <MathJax>{"$\\text{Tangent}$"}</MathJax>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonAngles.map(angle => {
                      const values = getCorrectAnswers(angle);
                      return (
                        <tr key={angle} className="border-b">
                          <td className="p-2 text-center">
                            <MathJax>{`$${angle}°$`}</MathJax>
                          </td>
                          <td className="p-2 text-center">
                            <MathJax>{formatValue(values.radians)}</MathJax>
                          </td>
                          <td className="p-2 text-center">
                            <MathJax>{`(${formatValue(values.coordinates.x)}, ${formatValue(values.coordinates.y)})`}</MathJax>
                          </td>
                          <td className="p-2 text-center">
                            <MathJax>{formatValue(values.sine)}</MathJax>
                          </td>
                          <td className="p-2 text-center">
                            <MathJax>{formatValue(values.cosine)}</MathJax>
                          </td>
                          <td className="p-2 text-center">
                            <MathJax>
                              {angle === 90 || angle === 270 ? 'undefined' : formatValue(values.tangent)}
                            </MathJax>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>

          {/* Tips and Tricks */}
          <Card>
            <CardHeader>
              <CardTitle>Tips and Tricks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Memorization Patterns Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Memorization Patterns</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          Values repeat every 90° with alternating signs
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          Sine and cosine values are always between -1 and 1
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          Sine values in Q1 = Cosine values in Q2
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          Reference angles are always acute (≤ 90°)
                        </li>
                      </ul>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">ASTC Rule (Sign Rules)</div>
                      <ul className="text-sm space-y-1">
                        <li>Q1 (0-90°): All positive</li>
                        <li>Q2 (90-180°): Only Sine positive</li>
                        <li>Q3 (180-270°): Only Tangent positive</li>
                        <li>Q4 (270-360°): Only Cosine positive</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Special Angles Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Special Angles</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">30-60-90 Triangle</div>
                      <MathJax>{"$\\text{If } \\theta = 30°:$"}</MathJax>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><MathJax>{"$\\sin = \\frac{1}{2}$"}</MathJax></li>
                        <li><MathJax>{"$\\cos = \\frac{\\sqrt{3}}{2}$"}</MathJax></li>
                        <li><MathJax>{"$\\tan = \\frac{1}{\\sqrt{3}}$"}</MathJax></li>
                      </ul>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">45-45-90 Triangle</div>
                      <MathJax>{"$\\text{If } \\theta = 45°:$"}</MathJax>
                      <ul className="text-sm space-y-1 mt-1">
                        <li><MathJax>{"$\\sin = \\cos = \\frac{\\sqrt{2}}{2}$"}</MathJax></li>
                        <li><MathJax>{"$\\tan = 1$"}</MathJax></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Methods Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Quick Methods</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">Finding Reference Angles</div>
                      <ul className="text-sm space-y-1">
                        <li>Q1: θ = θ</li>
                        <li>Q2: θ = 180° - θ</li>
                        <li>Q3: θ = θ - 180°</li>
                        <li>Q4: θ = 360° - θ</li>
                      </ul>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">Co-function Relationships</div>
                      <ul className="text-sm space-y-1">
                        <li><MathJax>{"$\\sin(\\theta) = \\cos(90° - \\theta)$"}</MathJax></li>
                        <li><MathJax>{"$\\tan(\\theta) = \\cot(90° - \\theta)$"}</MathJax></li>
                        <li><MathJax>{"$\\sec(\\theta) = \\csc(90° - \\theta)$"}</MathJax></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Periodicity Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm h-full"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold">Periodicity & Properties</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">Periods</div>
                      <ul className="text-sm space-y-2">
                        <li>
                          <span className="font-medium">Sine & Cosine:</span>
                          <MathJax>{"$\\text{ Period = }2\\pi\\text{ or }360°$"}</MathJax>
                        </li>
                        <li>
                          <span className="font-medium">Tangent:</span>
                          <MathJax>{"$\\text{ Period = }\\pi\\text{ or }180°$"}</MathJax>
                        </li>
                      </ul>
                    </div>
                    <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="font-medium mb-1">Even/Odd Functions</div>
                      <ul className="text-sm space-y-1">
                        <li><MathJax>{"$\\cos(-x) = \\cos(x)\\text{ (even)}$"}</MathJax></li>
                        <li><MathJax>{"$\\sin(-x) = -\\sin(x)\\text{ (odd)}$"}</MathJax></li>
                        <li><MathJax>{"$\\tan(-x) = -\\tan(x)\\text{ (odd)}$"}</MathJax></li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MathJaxContext>
  );
} 