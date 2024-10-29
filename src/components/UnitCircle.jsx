'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/hooks/use-toast";
import { Settings } from "lucide-react";
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UnitCircle() {
  const { toast } = useToast();
  
  const commonAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  
  const [openDialog, setOpenDialog] = useState(false);
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [selectedAngle, setSelectedAngle] = useState(null);
  
  // Practice options state
  const [practiceOptions, setPracticeOptions] = useState({
    coordinates: true,
    radians: true,
    sine: true,
    cosine: true,
    tangent: true,
    showDegrees: true, // Changed to true
    showAxes: true,
  });
  
  // Store answers for each angle
  const [answers, setAnswers] = useState(
    Object.fromEntries(
      commonAngles.map(angle => [
        angle,
        {
          completed: false,
          angle: '',  // Add this line
          coordinates: { x: '', y: '' },
          radians: '',
          sine: '',
          cosine: '',
          tangent: ''
        }
      ])
    )
  );

  // Calculate correct answers for a given angle
  const getCorrectAnswers = (angle) => {
    const radians = (angle * Math.PI) / 180;
    const sin = Number(Math.sin(radians).toFixed(4));
    const cos = Number(Math.cos(radians).toFixed(4));
    
    // Special case for common angles to return exact radian values
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

  // Calculate point position on circle with fixed precision
  const getPointPosition = (degrees) => {
    const radians = (degrees * Math.PI) / 180;
    return {
      x: Number(Math.cos(radians).toFixed(4)),
      y: Number(Math.sin(radians).toFixed(4))
    };
  };

  const handlePointClick = (angle) => {
    setSelectedAngle(angle);
    setOpenDialog(true);
  };

  const handleClearCircle = () => {
    if (Object.values(answers).some(a => a.completed)) {
      const confirmed = window.confirm("Are you sure you want to clear all your answers?");
      if (!confirmed) return;
    }
    
    setAnswers(
      Object.fromEntries(
        commonAngles.map(angle => [
          angle,
          {
            completed: false,
            angle: '',  // Add this line
            coordinates: { x: '', y: '' },
            radians: '',
            sine: '',
            cosine: '',
            tangent: ''
          }
        ])
      )
    );
    
    toast({
      title: "Circle Cleared",
      description: "All answers have been reset.",
    });
  };

  const handleInputChange = (e, field, subfield = null) => {
    const value = e.target.value;
    
    // Handle pi and square root conversions
    let processedValue = value.toLowerCase()
      .replace('pi', 'π')
      .replace('sqrt', '√')
      .replace(/(?:square)?root/i, '√');
    
    setAnswers(prev => ({
      ...prev,
      [selectedAngle]: {
        ...prev[selectedAngle],
        ...(subfield 
          ? {
              [field]: {
                ...prev[selectedAngle][field],
                [subfield]: processedValue
              }
            }
          : { [field]: processedValue }
        )
      }
    }));
  };

  const [autoAdvance, setAutoAdvance] = useState(false);

  const getNextAngle = (currentAngle) => {
    const index = commonAngles.indexOf(currentAngle);
    // Go counter-clockwise (next higher angle)
    return index === commonAngles.length - 1 ? commonAngles[0] : commonAngles[index + 1];
  };

  const handleSaveAnswers = () => {
    const currentAnswers = answers[selectedAngle];
    const emptyFields = [];
    const invalidFields = [];

    // Helper function to validate a numeric value
    const validateNumeric = (value, fieldName) => {
      if (!value) {
        emptyFields.push(fieldName);
        return;
      }

      // Special case for tangent field
      if (fieldName === 'Tangent' && value.toLowerCase() === 'undefined') {
        return;
      }

      // If the value contains π or √, consider it valid
      if (value.includes('π') || value.includes('√')) {
        return;
      }

      // Check for fraction format (e.g., "1/2")
      if (value.includes('/')) {
        const [numerator, denominator] = value.split('/');
        if (!isNaN(numerator) && !isNaN(denominator) && denominator !== '0') {
          return;
        }
      }

      // For plain numbers, check if they're valid
      if (isNaN(value)) {
        invalidFields.push(fieldName);
      }
    };

    if (practiceOptions.coordinates) {
      validateNumeric(currentAnswers.coordinates.x, 'X Coordinate');
      validateNumeric(currentAnswers.coordinates.y, 'Y Coordinate');
    }
    if (practiceOptions.radians) validateNumeric(currentAnswers.radians, 'Radians');
    if (practiceOptions.sine) validateNumeric(currentAnswers.sine, 'Sine');
    if (practiceOptions.cosine) validateNumeric(currentAnswers.cosine, 'Cosine');
    if (practiceOptions.tangent) validateNumeric(currentAnswers.tangent, 'Tangent');

    if (emptyFields.length > 0) {
      toast({
        title: "Missing Values",
        description: `Please fill in: ${emptyFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    if (invalidFields.length > 0) {
      toast({
        title: "Invalid Values",
        description: `Please enter valid numbers for: ${invalidFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setAnswers(prev => ({
      ...prev,
      [selectedAngle]: {
        ...prev[selectedAngle],
        completed: true
      }
    }));

    // If autoAdvance is enabled, move to next point
    if (autoAdvance) {
      const nextAngle = getNextAngle(selectedAngle);
      setSelectedAngle(nextAngle);
    } else {
      setOpenDialog(false);
    }
  };

  const checkAllAnswers = () => {
    const tolerance = 0.01;
    let correct = 0;
    let total = 0;
    const errors = [];

    // Calculate total possible points first
    const pointsPerAngle = commonAngles.length;
    if (practiceOptions.coordinates) total += pointsPerAngle * 2; // x and y coordinates
    if (practiceOptions.radians) total += pointsPerAngle;
    if (practiceOptions.sine) total += pointsPerAngle;
    if (practiceOptions.cosine) total += pointsPerAngle;
    if (practiceOptions.tangent) total += pointsPerAngle;

    // Helper function to evaluate expressions with π and √
    const evaluateExpression = (expr) => {
      if (!expr) return NaN;
      
      // Handle 'undefined' for tangent
      if (expr.toLowerCase() === 'undefined') return Infinity;
      
      // Convert π to Math.PI
      expr = expr.replace(/π/g, 'Math.PI');
      
      // Convert √ to Math.sqrt
      expr = expr.replace(/√(\d+)/g, 'Math.sqrt($1)');
      
      // Handle fractions
      if (expr.includes('/')) {
        const [num, den] = expr.split('/');
        return Number(num) / Number(den);
      }

      try {
        return Number(eval(expr));
      } catch {
        return NaN;
      }
    };

    commonAngles.forEach(angle => {
      const correctVals = getCorrectAnswers(angle);
      const userVals = answers[angle];
      
      if (!userVals.completed) {
        errors.push(`${angle}° point not completed`);
        return;
      }

      if (practiceOptions.coordinates) {
        const userX = evaluateExpression(userVals.coordinates.x);
        const userY = evaluateExpression(userVals.coordinates.y);
        
        if (Math.abs(userX - correctVals.coordinates.x) <= tolerance) correct++;
        else errors.push(`X coordinate at ${angle}°`);
        
        if (Math.abs(userY - correctVals.coordinates.y) <= tolerance) correct++;
        else errors.push(`Y coordinate at ${angle}°`);
      }
      
      if (practiceOptions.radians) {
        const userRadians = evaluateExpression(userVals.radians);
        if (Math.abs(userRadians - correctVals.radians) <= tolerance) correct++;
        else errors.push(`Radians at ${angle}°`);
      }
      
      if (practiceOptions.sine) {
        const userSine = evaluateExpression(userVals.sine);
        if (Math.abs(userSine - correctVals.sine) <= tolerance) correct++;
        else errors.push(`Sine at ${angle}°`);
      }
      
      if (practiceOptions.cosine) {
        const userCosine = evaluateExpression(userVals.cosine);
        if (Math.abs(userCosine - correctVals.cosine) <= tolerance) correct++;
        else errors.push(`Cosine at ${angle}°`);
      }
      
      if (practiceOptions.tangent) {
        // Special case for tangent at 90° and 270°
        if ((angle === 90 || angle === 270) && 
            userVals.tangent.toLowerCase() === 'undefined') {
          correct++;
        } else {
          const userTangent = evaluateExpression(userVals.tangent);
          if (Math.abs(userTangent - correctVals.tangent) <= tolerance) {
            correct++;
          } else {
            errors.push(`Tangent at ${angle}°`);
          }
        }
      }
    });

    toast({
      title: `Score: ${correct}/${total}`,
      description: errors.length > 0 
        ? `Errors: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? ` and ${errors.length - 3} more...` : ''}`
        : "Perfect! All answers are correct!",
      variant: errors.length > 0 ? "destructive" : "default",
    });
  };

  // Add beforeunload event listener
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Check if any answers exist
      if (Object.values(answers).some(a => a.completed)) {
        e.preventDefault();
        e.returnValue = ''; // Required for Chrome
        return ''; // Required for other browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers]);

  // Add this near the top with other state variables
  const [showReference, setShowReference] = useState(false);

  // Add this helper function after getCorrectAnswers
  const formatValue = (value) => {
    // Handle special angles and their values
    const specialValues = {
      // Exact values
      0: "0",
      1: "1",
      "-1": "-1",
      0.5: "½",
      "-0.5": "-½",
      
      // 30° and 150° values
      0.8660254037844386: "√3/2",
      "-0.8660254037844386": "-√3/2",
      0.8660254: "√3/2",
      "-0.8660254": "-√3/2",
      
      // 45° and 135° values
      0.7071067811865476: "√2/2",
      "-0.7071067811865476": "-√2/2",
      0.7071068: "√2/2",
      "-0.7071068": "-√2/2",
      
      // Common tangent values
      1.7320508075688772: "√3",
      "-1.7320508075688772": "-√3",
      1.7320508: "√3",
      "-1.7320508": "-√3",
      
      // Radians
      3.141592653589793: "π",
      1.5707963267948966: "π/2",
      "-1.5707963267948966": "-π/2",
      4.71238898038469: "3π/2",
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
    };

    // Check for special values first
    if (specialValues.hasOwnProperty(value)) {
      return specialValues[value];
    }

    // For radians display, if the value is close to a fraction of π
    if (Math.abs(value) < 10) { // Only check for reasonable radian values
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

    // For values that might be square roots
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

    // If no special value is found, return with 4 decimal places
    return value.toFixed(4);
  };

  const router = useRouter();

  const [showReferenceWarning, setShowReferenceWarning] = useState(false);

  const handleReferenceClick = () => {
    if (Object.values(answers).some(a => a.completed)) {
      setShowReferenceWarning(true);
    } else {
      router.push('/reference');
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="pt-6">
          <div className="aspect-square relative border-2 border-gray-200 rounded-full mb-4">
            {/* Axes */}
            {practiceOptions.showAxes && (
              <>
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-300" />
                <div className="absolute top-0 left-1/2 w-[2px] h-full bg-gray-300" />
                {/* X and Y labels */}
                <span className="absolute text-sm font-semibold text-gray-500" style={{ left: '-24px', top: '50%', transform: 'translateY(-50%)' }}>
                  X
                </span>
                <span className="absolute text-sm font-semibold text-gray-500" style={{ left: '50%', top: '-24px', transform: 'translateX(-50%)' }}>
                  Y
                </span>
              </>
            )}
            
            {/* Common angle points */}
            {commonAngles.map(angle => {
              const point = getPointPosition(angle);
              const radius = 50; // Set to exactly 50% for full radius
              
              // Special cases for axis points to ensure perfect alignment
              let exactX, exactY;
              
              if (angle === 0) {
                exactX = 100; // Right point
                exactY = 50;
              } else if (angle === 90) {
                exactX = 50;
                exactY = 0; // Top point
              } else if (angle === 180) {
                exactX = 0; // Left point
                exactY = 50;
              } else if (angle === 270) {
                exactX = 50;
                exactY = 100; // Bottom point
              } else {
                // Calculate position for other points
                exactX = 50 + (radius * point.x);
                exactY = 50 - (radius * point.y);
              }
              
              return (
                <div key={angle} className="absolute" style={{
                  left: `${exactX}%`,
                  top: `${exactY}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}>
                  <button
                    onClick={() => handlePointClick(angle)}
                    className={`w-3 h-3 rounded-full transition-colors
                      ${answers[angle].completed ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}
                      hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                  />
                  {!practiceOptions.showDegrees && ( // Flipped condition
                    <span
                      className="absolute text-xs text-gray-500 whitespace-nowrap"
                      style={{
                        left: '50%',
                        top: '50%',
                        transform: `translate(${
                          // Special case for 180°
                          angle === 180 ? '-150%' :
                          // Special case for 270°
                          angle === 270 ? '-50%' :
                          // Left side (180-270)
                          angle > 180 && angle < 270 ? '-130%' :
                          // Right side
                          point.x > 0 ? '10px' :
                          // Left side
                          point.x < 0 ? '-110%' :
                          // Center
                          '-50%'
                        }, ${
                          // Special case for 270° (like 90° but above)
                          angle === 270 ? '-180%' :
                          // Bottom half
                          point.y > 0 ? '10px' :
                          // Top half
                          point.y < 0 ? '-110%' :
                          // Center
                          '-50%'
                        })`
                      }}
                    >
                      {angle}°
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <Button 
              onClick={checkAllAnswers}
              className="flex-1"
              disabled={!Object.values(answers).every(a => a.completed)}
            >
              Check All Points
            </Button>
            <Button 
              variant="outline"
              onClick={handleClearCircle}
              className="flex-1"
            >
              Clear Circle
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReferenceClick}
              className="px-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <path d="M12 17h.01"/>
              </svg>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setOpenOptionsDialog(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAngle === null ? 'Loading...' :
                !practiceOptions.showDegrees
                  ? `Point at ${selectedAngle}°`
                  : answers[selectedAngle]?.angle 
                    ? `Point at ${answers[selectedAngle].angle}°`
                    : 'Enter angle for this point'
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {practiceOptions.showDegrees && (
              <div>
                <Label>Angle</Label>
                <Input
                  value={selectedAngle !== null ? answers[selectedAngle].angle || '' : ''}
                  onChange={(e) => setAnswers(prev => ({
                    ...prev,
                    [selectedAngle]: {
                      ...prev[selectedAngle],
                      angle: e.target.value
                    }
                  }))}
                  placeholder="Enter angle in degrees"
                />
              </div>
            )}

            {practiceOptions.coordinates && (
              <div>
                <Label>Coordinates</Label>
                <div className="flex gap-2 items-center">
                  <span>(</span>
                  <Input
                    placeholder="x"
                    value={selectedAngle !== null ? answers[selectedAngle].coordinates.x : ''}
                    onChange={(e) => handleInputChange(e, 'coordinates', 'x')}
                    className="text-center"
                  />
                  <span>,</span>
                  <Input
                    placeholder="y"
                    value={selectedAngle !== null ? answers[selectedAngle].coordinates.y : ''}
                    onChange={(e) => handleInputChange(e, 'coordinates', 'y')}
                    className="text-center"
                  />
                  <span>)</span>
                </div>
              </div>
            )}

            {practiceOptions.radians && (
              <div>
                <Label>Radians</Label>
                <Input
                  value={selectedAngle !== null ? answers[selectedAngle].radians : ''}
                  onChange={(e) => handleInputChange(e, 'radians')}
                />
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              {practiceOptions.sine && (
                <div>
                  <Label>Sine</Label>
                  <Input
                    value={selectedAngle !== null ? answers[selectedAngle].sine : ''}
                    onChange={(e) => handleInputChange(e, 'sine')}
                  />
                </div>
              )}
              {practiceOptions.cosine && (
                <div>
                  <Label>Cosine</Label>
                  <Input
                    value={selectedAngle !== null ? answers[selectedAngle].cosine : ''}
                    onChange={(e) => handleInputChange(e, 'cosine')}
                  />
                </div>
              )}
              {practiceOptions.tangent && (
                <div>
                  <Label>Tangent</Label>
                  <Input
                    value={selectedAngle !== null ? answers[selectedAngle].tangent : ''}
                    onChange={(e) => handleInputChange(e, 'tangent')}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-advance">Auto-advance to next point</Label>
              <Switch
                id="auto-advance"
                checked={autoAdvance}
                onCheckedChange={setAutoAdvance}
              />
            </div>

            <Button onClick={() => {
              if (practiceOptions.showDegrees &&
                  (!answers[selectedAngle].angle || 
                   isNaN(answers[selectedAngle].angle) ||
                   Number(answers[selectedAngle].angle) !== selectedAngle)) {
                toast({
                  title: "Incorrect Angle",
                  description: "Please enter the correct angle for this point.",
                  variant: "destructive",
                });
                return;
              }
              handleSaveAnswers();
            }}>
              Save Values
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Options Dialog */}
      <Dialog open={openOptionsDialog} onOpenChange={setOpenOptionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Practice Options</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Visual Options */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Visual Options</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="showAxes">Show Axes</Label>
                <Switch
                  id="showAxes"
                  checked={practiceOptions.showAxes}
                  onCheckedChange={(checked) => 
                    setPracticeOptions(prev => ({ ...prev, showAxes: checked }))
                  }
                />
              </div>
            </div>

            {/* Information to Test */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Information to Test</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showDegrees">Degrees</Label>
                  <Switch
                    id="showDegrees"
                    checked={practiceOptions.showDegrees}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, showDegrees: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="coordinates">Coordinates</Label>
                  <Switch
                    id="coordinates"
                    checked={practiceOptions.coordinates}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, coordinates: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="radians">Radians</Label>
                  <Switch
                    id="radians"
                    checked={practiceOptions.radians}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, radians: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sine">Sine</Label>
                  <Switch
                    id="sine"
                    checked={practiceOptions.sine}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, sine: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cosine">Cosine</Label>
                  <Switch
                    id="cosine"
                    checked={practiceOptions.cosine}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, cosine: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="tangent">Tangent</Label>
                  <Switch
                    id="tangent"
                    checked={practiceOptions.tangent}
                    onCheckedChange={(checked) => 
                      setPracticeOptions(prev => ({ ...prev, tangent: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showReferenceWarning} onOpenChange={setShowReferenceWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>View Reference Circle?</AlertDialogTitle>
            <AlertDialogDescription>
              Going to the reference page will show you a completed circle. Your current progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push('/reference')}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
