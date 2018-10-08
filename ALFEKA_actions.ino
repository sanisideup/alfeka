/* Sweep
 by BARRAGAN <http://barraganstudio.com>
 This example code is in the public domain.

 modified 8 Nov 2013
 by Scott Fitzgerald
 http://www.arduino.cc/en/Tutorial/Sweep
*/
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define PIN            11
#define NUMPIXELS      9

#include <Servo.h>

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);
Servo left_ear;  // create servo object to control a servo
Servo right_ear;
// twelve servo objects can be created on most boards

int posL = 90;    // variable to store the servo position
int posR = 0;

int incomingByte;

void setup() 
{
  #if defined (__AVR_ATtiny85__)
    if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
  #endif
  // End of trinket special code


  strip.begin();
  strip.setBrightness(20);
  strip.show(); // Initialize all pixels to 'off'
  left_ear.attach(9);  // attaches the servo on pin 9 to the servo object
  right_ear.attach(10);
  Serial.begin(9600);
}

void loop() 
{
  strip.setBrightness(20);
  if (Serial.available() > 0) 
  {
    // read the incoming byte:
    incomingByte = Serial.read();
  }
  if (incomingByte == 'A')
  {
    strip.setBrightness(90);
    ear_rainbowCycle(20);
    off();
    incomingByte = 0;
  }
  if (incomingByte == 'B')
  {
    ear(20);
    incomingByte = 0;
  }
}

void ear(uint8_t wait)
{
  for(int i = 0; i < 5 ; i+=1)
  {
    for (posL = 90; posL <= 180; posL += 1) 
    { 
      posR = posL - 90;
      left_ear.write(posL);              // tell servo to go to position in variable 'pos'
      right_ear.write(posR);
      delay(1);                       // waits 15ms for the servo to reach the position
    }
    for (posL = 180; posL >= 90; posL -= 1) 
    { 
      posR = posL - 90;
      left_ear.write(posL);              // tell servo to go to position in variable 'pos'
      right_ear.write(posR); 
      delay(1);                       // waits 15ms for the servo to reach the position
    }
  }
}
void off()
{
    for(int i=0;i<NUMPIXELS;i++)
    {
      // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
      strip.setPixelColor(i, strip.Color(0,0,0)); // Moderately bright green color.
      strip.show(); // This sends the updated pixel color to the hardware.
      //delay(delayval); // Delay for a period of time (in milliseconds).
  }
}

void ear_rainbowCycle(uint8_t wait) {
  uint16_t i, j;
  int inc = 1;
  for(j=0; j<256; j++) 
  { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) 
    {
      if(posL <= 180 && inc)
      {
        posL += 1;
        posR = posL - 90;
        left_ear.write(posL);              // tell servo to go to position in variable 'pos'
        right_ear.write(posR);
        //delay(15);    
      }
      else
      {
        inc = 0;
      }
      if(posL >= 90 && (!inc))
      {
        posL -= 1;
        posR = posL - 90;
        left_ear.write(posL);              // tell servo to go to position in variable 'pos'
        right_ear.write(posR);
        //delay(15);
      }
      else
      {
        inc = 1;
      }
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) 
{
  uint16_t i, j;
  int inc = 1;

  for(j=0; j<256; j++) 
  {
    for(i=0; i<strip.numPixels(); i++) 
    {
      strip.setPixelColor(i, Wheel((i+j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

void rainbowCycle(uint8_t wait,int times) {
  uint16_t i, j;
  for(j=0; j<256*times; j++) 
  { // 5 cycles of all colors on wheel
    for(i=0; i< strip.numPixels(); i++) 
    {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

