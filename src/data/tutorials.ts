import type { Tutorial } from '../types';

export const tutorials: Tutorial[] = [
  // Beginner Level
  {
    id: 'intro-to-circuits',
    title: 'What is a Circuit?',
    description: 'Learn the basics of electrical circuits and how electricity flows!',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Fundamentals',
    icon: '⚡',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Welcome to Circuits!',
        content: `# Welcome, Young Engineer! 🎉

A **circuit** is like a road for electricity! Just like cars need roads to travel, electricity needs circuits to flow.

## What You'll Learn:
- What electricity is
- How circuits work
- The parts of a circuit

Let's start our adventure!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'What is Electricity?',
        content: `# Electricity - Tiny Moving Particles ⚡

Electricity is made of tiny particles called **electrons**. 

Imagine billions of tiny balls rolling through a tube - that's kind of what electricity is!

## Fun Fact:
Electrons are SO tiny that about 6 quintillion (6,000,000,000,000,000,000) of them pass through a light bulb every second!

When these electrons move together in the same direction, we call it **electric current**.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Parts of a Circuit',
        content: `# The Three Essential Parts 🔧

Every circuit needs THREE things:

## 1. ⚡ Power Source (Battery)
This pushes the electrons around the circuit - like a water pump!

## 2. 🔌 Wires (Path)
The road that electrons travel on.

## 3. 💡 Load (Light, Motor, etc.)
Something useful that uses the electricity!

If ANY part is missing, the circuit won't work!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Build Your First Circuit!',
        content: `# Time to Build! 🛠️

Let's create a simple circuit:

1. **Drag a Battery** from the components panel
2. **Add an LED** 
3. **Add a Resistor** (this protects the LED!)
4. **Connect them** with wires

The LED should light up! 💡

**Try it now in the canvas!**`,
        type: 'interactive',
        action: {
          type: 'add_component',
          component: 'battery',
        },
        completed: false,
      },
    ],
  },
  {
    id: 'resistors-101',
    title: 'Understanding Resistors',
    description: 'Learn about resistors and how they control electricity flow!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Components',
    icon: '🔧',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Resistor?',
        content: `# Resistors - Traffic Controllers! 🚦

A **resistor** is like a speed bump for electricity. It slows down the flow of electrons!

## Why Do We Need Them?
- **Protect components** - Some parts can't handle too much current
- **Control brightness** - Make LEDs dimmer or brighter
- **Set timing** - Used in many electronic timers

Without resistors, many circuits would break or even catch fire! 🔥`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Reading Resistor Colors',
        content: `# The Color Code 🌈

Resistors have colored bands that tell us their value!

## Common Colors:
- **Black** = 0
- **Brown** = 1
- **Red** = 2
- **Orange** = 3
- **Yellow** = 4
- **Green** = 5
- **Blue** = 6
- **Purple** = 7
- **Gray** = 8
- **White** = 9

## Example:
Brown-Black-Red = 1,000 Ω (1kΩ)

**Pro Tip:** "Bad Boys Race Our Young Girls But Violet Generally Wins"`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Interactive: Choose the Right Resistor',
        content: `# Protect the LED! 💡

LEDs need the right resistor to work safely.

## Your Mission:
An LED needs about 20mA of current and you have a 9V battery.

**Question:** What resistor should you use?

Using Ohm's Law: R = V / I = (9V - 2V) / 0.02A = 350Ω

A **330Ω** or **470Ω** resistor would work great!

**Try adding the right resistor in the canvas!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'leds-and-lights',
    title: 'LEDs - Light It Up!',
    description: 'Discover how LEDs work and create colorful light circuits!',
    difficulty: 'beginner',
    duration: '12 min',
    category: 'Components',
    icon: '💡',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an LED?',
        content: `# LEDs - Super Efficient Lights! 💡

**LED** stands for **Light Emitting Diode**.

## Why LEDs are Awesome:
- ⚡ Use very little electricity
- ❄️ Stay cool (don't get hot!)
- ⏰ Last for years and years
- 🌈 Come in many colors

LEDs are used in phone screens, traffic lights, and even your TV!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'The Right Direction',
        content: `# One-Way Street! ➡️

LEDs only work in ONE direction!

## How to Tell:
- **Longer leg** = Positive (Anode) ➕
- **Shorter leg** = Negative (Cathode) ➖

If you connect it backwards, it won't light up (but it won't break either!).

## Remember:
**L**onger leg = **P**ositive (L and P look similar!)`,
        type: 'text',
        completed: false,
      },
    ],
  },

  // Intermediate Level
  {
    id: 'series-parallel',
    title: 'Series vs Parallel Circuits',
    description: 'Learn the two ways to connect components!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Circuit Design',
    icon: '🔀',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Series Circuits',
        content: `# All in a Row! ➡️

In a **series circuit**, components are connected one after another.

## Key Facts:
- Current is the **SAME** everywhere
- Voltage is **SHARED** between components
- If one component breaks, the whole circuit stops!

## Real Example:
Old Christmas lights were series circuits - one bulb burns out, they ALL go dark! 🎄`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Parallel Circuits',
        content: `# Multiple Paths! 🔀

In a **parallel circuit**, components have their own separate paths.

## Key Facts:
- Voltage is the **SAME** for each component
- Current is **SPLIT** between paths
- If one component breaks, others keep working!

## Real Example:
Your house wiring is parallel - turning off one light doesn't affect others!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build Both Types!',
        content: `# Experiment Time! 🔬

**Challenge 1: Series Circuit**
Connect 2 LEDs in series with a battery and see what happens!

**Challenge 2: Parallel Circuit**  
Now connect 2 LEDs in parallel - notice they're brighter!

**Why?** In series, the voltage is shared. In parallel, each LED gets full voltage!

Try both in the canvas and compare!`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'ohms-law',
    title: "Ohm's Law - The Magic Formula",
    description: 'Master the most important equation in electronics!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Theory',
    icon: '📐',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: "Introducing Ohm's Law",
        content: `# The Golden Rule ⚡

**Ohm's Law** is the most important formula in electronics:

# V = I × R

- **V** = Voltage (Volts) - electrical pressure
- **I** = Current (Amps) - flow of electricity
- **R** = Resistance (Ohms) - opposition to flow

## The Triangle Trick:
Put V at top, I and R at bottom. Cover what you want to find!

- Want V? It's I × R
- Want I? It's V ÷ R
- Want R? It's V ÷ I`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Real World Examples',
        content: `# Let's Calculate! 🧮

## Example 1:
You have a 9V battery and a 1000Ω resistor. How much current flows?

I = V ÷ R = 9 ÷ 1000 = 0.009A = **9mA**

## Example 2:
An LED needs 20mA at 2V. The battery is 9V. What resistor do you need?

Voltage across resistor = 9V - 2V = 7V
R = V ÷ I = 7 ÷ 0.02 = **350Ω**

Use a 330Ω or 470Ω (these are standard values)`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'switches-buttons',
    title: 'Switches and Buttons',
    description: 'Learn to control your circuits with switches!',
    difficulty: 'intermediate',
    duration: '15 min',
    category: 'Components',
    icon: '🔘',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Types of Switches',
        content: `# Control the Flow! 🎮

Switches let you turn circuits ON and OFF!

## Common Types:

### Toggle Switch
- Stays in position (ON or OFF)
- Like a light switch

### Push Button
- Only ON while pressed
- Like a doorbell

### SPST, SPDT, DPDT
- Single/Double Pole (how many circuits)
- Single/Double Throw (how many positions)`,
        type: 'text',
        completed: false,
      },
    ],
  },

  // Advanced Level
  {
    id: 'transistors',
    title: 'Transistors - Electronic Switches',
    description: 'Discover the building blocks of computers!',
    difficulty: 'advanced',
    duration: '30 min',
    category: 'Components',
    icon: '🔌',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Transistor?',
        content: `# The Most Important Invention! 🏆

**Transistors** are electronic switches that changed the world!

## Two Main Uses:
1. **Switching** - Turn things ON/OFF with tiny signals
2. **Amplifying** - Make weak signals stronger

## Fun Fact:
Your phone has BILLIONS of transistors, each smaller than a virus! 🤯

A transistor has 3 pins:
- **Base (B)** - The control pin
- **Collector (C)** - Current flows IN
- **Emitter (E)** - Current flows OUT`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'NPN vs PNP',
        content: `# Two Flavors 🍦

## NPN Transistor
- Most common type
- Current flows from Collector to Emitter
- Base needs POSITIVE voltage to turn ON
- Think: "Not Pointing iN"

## PNP Transistor
- Current flows from Emitter to Collector
- Base needs NEGATIVE voltage to turn ON
- Think: "Pointing iN Permanently"

For beginners, NPN (like 2N2222) is easier to use!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Touch Sensor',
        content: `# Project: Touch-Activated LED! 👆

Let's use a transistor to make an LED that turns on when you touch it!

## How It Works:
Your body has a tiny amount of electrical resistance. When you touch the base, a tiny current flows - the transistor amplifies this and turns on the LED!

## Components Needed:
- 1x NPN Transistor
- 1x LED
- 1x 330Ω Resistor
- 1x 9V Battery

**Try building this in the canvas!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'capacitors-basics',
    title: 'Capacitors - Energy Storage',
    description: 'Learn how capacitors store and release energy!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Components',
    icon: '🔋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Capacitor?',
        content: `# Energy Buckets! 🪣

A **capacitor** is like a tiny rechargeable battery - it stores electrical energy!

## How It Works:
Imagine a bucket that fills with water (energy) when you pour it in, then pours it back out when you tip it.

## Two Main Parts:
- Two metal plates
- Separated by an insulator (dielectric)

When voltage is applied, electrons pile up on one side creating stored energy!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Capacitance - Storage Capacity',
        content: `# How Much Can It Hold? 📏

**Capacitance** is measured in **Farads (F)**.

## Common Values:
- **pF** (picofarads) - 0.000000000001F - tiny!
- **nF** (nanofarads) - 0.000000001F - small
- **µF** (microfarads) - 0.000001F - common
- **mF** (millifarads) - 0.001F - large

## Rule of Thumb:
Bigger capacitance = stores MORE energy = takes LONGER to charge/discharge

**Fun Fact:** A 1 Farad capacitor is HUGE - usually only seen in car audio systems!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Charging and Discharging',
        content: `# The Fill and Drain Cycle ⏱️

## Charging:
Connect to a power source → electrons flow onto the plates → voltage builds up → capacitor is "full"

## Discharging:
Connect to a circuit → stored electrons flow out → powers the circuit → capacitor is "empty"

## Real Uses:
- **Smoothing** - Reduces voltage wobbles
- **Timing** - Creates delays in circuits
- **Filters** - Blocks some frequencies
- **Flash photography** - Quick burst of power! 📸`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Interactive: Blink an LED',
        content: `# Build a Flasher Circuit! ✨

Create a circuit where an LED blinks on and off using a capacitor!

## Components Needed:
- 1x Capacitor (100µF)
- 1x LED
- 1x Resistor (1kΩ)
- 1x Battery

The capacitor charges through the resistor, then discharges through the LED - creating a blinking effect!

**Try building this timing circuit!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'diodes-basics',
    title: 'Diodes - One-Way Gates',
    description: 'Understand how diodes control current direction!',
    difficulty: 'beginner',
    duration: '12 min',
    category: 'Components',
    icon: '🚪',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Diode?',
        content: `# The One-Way Valve! ➡️

A **diode** lets electricity flow in ONE direction only - like a check valve in plumbing!

## The Two Sides:
- **Anode** (+) - Where current enters
- **Cathode** (-) - Where current exits

## The Rule:
Current flows from Anode → Cathode
Current is BLOCKED from Cathode → Anode

Look for the stripe on the diode - that's the cathode side!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Why Use Diodes?',
        content: `# Protection and Control! 🛡️

## Common Uses:

### 1. Reverse Polarity Protection
Protects your circuit if you connect the battery backwards!

### 2. AC to DC Conversion
Power adapters use diodes to convert wall power to DC

### 3. Voltage Regulation
Some diodes (Zener diodes) keep voltage stable

### 4. Signal Detection
Radio circuits use diodes to detect radio waves

## Types:
- **Standard** (1N4007) - General purpose
- **Zener** - Voltage regulation
- **Schottky** - Fast switching
- **LED** - Light Emitting Diode!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Protected Circuit',
        content: `# Safety First! ⚠️

Add a diode to protect your circuit from reverse voltage!

## The Setup:
1. Add a diode right after the battery
2. Connect the anode to battery positive
3. Connect the cathode to your circuit

Now if someone connects the battery backwards, the diode blocks the current and saves your components!

**Try adding protection to your LED circuit!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'voltage-divider',
    title: 'Voltage Dividers',
    description: 'Learn how to create different voltages in your circuit!',
    difficulty: 'intermediate',
    duration: '18 min',
    category: 'Circuit Design',
    icon: '⚖️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Voltage Divider?',
        content: `# Splitting Voltage! ⚡➗

A **voltage divider** uses resistors to create a lower voltage from a higher one.

## The Magic:
Two resistors in series split the voltage between them!

## Formula:
**Vout = Vin × (R2 / (R1 + R2))**

- Vin = Input voltage
- R1 = First resistor
- R2 = Second resistor
- Vout = Output voltage (across R2)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Practical Example',
        content: `# Make 5V from 9V! 🔢

Let's create 5V from a 9V battery:

## Step 1: Choose R1 and R2
We want: Vout = 5V, Vin = 9V

Using equal resistors (1kΩ each) gives us:
5V = 9V × (1000 / (1000 + 1000))
5V = 9V × 0.5 = 4.5V

Close! For exactly 5V, we need:
- R1 = 800Ω
- R2 = 1000Ω (1kΩ)

## Important:
Don't draw too much current from a voltage divider - it's for reference voltages, not power!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build Your Own',
        content: `# Interactive Challenge! 🎯

Create a voltage divider that produces 3V from a 9V battery!

## Your Mission:
1. Add two resistors in series
2. Calculate values to get 3V
3. Use a voltmeter to check!

**Hint:** 3V is 1/3 of 9V, so R2 should be 1/3 of the total resistance!

Try different resistor combinations in the canvas!`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'motors-basics',
    title: 'DC Motors - Making Things Move!',
    description: 'Control motors and create motion in your projects!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Components',
    icon: '⚙️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'How Motors Work',
        content: `# Electricity to Motion! 🔄

A **DC motor** converts electrical energy into spinning motion using magnetism!

## Inside a Motor:
- **Coils** - Wire loops that become electromagnets
- **Magnets** - Create magnetic field
- **Commutator** - Switches current direction
- **Brushes** - Conduct current to spinning part

When current flows, magnetic forces make the coil spin!

## Direction Control:
Reverse the voltage = reverse the spin direction! 🔄`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Protecting Your Circuit',
        content: `# Motors Need Special Care! ⚠️

Motors can damage circuits in two ways:

## 1. High Current Draw
Motors need a LOT of current to start

**Solution:** Use a transistor as a switch! The transistor handles the high current.

## 2. Back EMF
When a motor stops, it generates voltage that can flow backwards!

**Solution:** Add a "flyback diode" across the motor (backwards) to absorb this voltage.

## The Safe Motor Circuit:
Battery → Transistor → Motor
          ↑             ↓
      Resistor    Flyback Diode`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Motor Controller',
        content: `# Control a Motor! 🎮

Build a transistor-controlled motor circuit:

## Components:
- 1x DC Motor
- 1x NPN Transistor (2N2222)
- 1x Resistor (1kΩ) - for transistor base
- 1x Diode (1N4007) - flyback protection
- 1x Battery (6-9V)
- 1x Switch

When you close the switch, a small current flows into the transistor base, allowing a large current to flow through the motor!

**Build this and make it spin!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'buzzers-sound',
    title: 'Buzzers and Sound',
    description: 'Create audio alerts and simple melodies!',
    difficulty: 'beginner',
    duration: '10 min',
    category: 'Components',
    icon: '🔊',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'How Buzzers Work',
        content: `# Make Some Noise! 🔔

A **buzzer** creates sound using vibrations!

## Two Types:

### Active Buzzers
- Have built-in oscillator
- Just connect power → makes sound
- Fixed frequency (pitch)

### Passive Buzzers
- Need you to provide the signal
- Can make different tones
- More flexible!

Most hobby projects use active buzzers - super simple!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Buzzer Polarity',
        content: `# Getting It Right ✅

Most buzzers have polarity (+ and -):

## Finding the Positive:
- Longer lead = Positive (+)
- Red wire = Positive (+)
- + symbol on the buzzer

## What Happens If Wrong?
- Active buzzer: Won't make sound
- Passive buzzer: Might work, might not

Always check the datasheet if unsure!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build an Alarm',
        content: `# Create a Simple Alarm! 🚨

Build a switch-controlled buzzer:

## Simple Circuit:
Battery → Switch → Buzzer → Ground

When you press the switch, the buzzer sounds!

## Challenge:
Add an LED that lights up when the buzzer sounds. This teaches you about parallel circuits!

**Try building your alarm system!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'breadboards',
    title: 'Using Breadboards',
    description: 'Master the essential tool for prototyping circuits!',
    difficulty: 'beginner',
    duration: '15 min',
    category: 'Fundamentals',
    icon: '📋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Breadboard?',
        content: `# The Perfect Testing Ground! 🧪

A **breadboard** (or protoboard) lets you build circuits WITHOUT soldering!

## Why Use Breadboards?
- ✅ Reusable - build, test, rebuild!
- ✅ No soldering needed
- ✅ Easy to change connections
- ✅ Great for learning
- ✅ Quick prototyping

## The Layout:
Breadboards have rows and columns of holes. Inside are metal clips that connect the holes together in specific patterns.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'How Breadboards Connect',
        content: `# Understanding the Connections 🔗

## Power Rails (sides):
- Red line = Positive rail (+)
- Blue/Black line = Negative rail (-)
- ALL holes in a rail are connected together
- Use for power distribution

## Center Rows:
- Holes in each row (a-e or f-j) are connected
- The gap in the middle separates them
- Perfect for ICs (integrated circuits)

## Important Rule:
Holes are connected HORIZONTALLY in rows
NOT vertically in columns!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Breadboard Best Practices',
        content: `# Pro Tips! 💡

## Do's ✅:
- Use red wire for positive
- Use black wire for negative (ground)
- Keep wires neat and flat
- Test connections with a multimeter
- Plan your layout before building

## Don'ts ❌:
- Don't force components in
- Don't bend leads at sharp angles
- Don't cross wires unnecessarily
- Don't exceed breadboard ratings (1A max usually)

## Troubleshooting:
If circuit doesn't work:
1. Check power connections
2. Verify component orientation
3. Look for loose connections
4. Use multimeter to test continuity`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'multimeters',
    title: 'Using a Multimeter',
    description: 'Learn to measure voltage, current, and resistance!',
    difficulty: 'beginner',
    duration: '20 min',
    category: 'Measurement',
    icon: '📊',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a Multimeter?',
        content: `# Your Electronic Detective! 🔍

A **multimeter** (or DMM - Digital Multimeter) measures electrical properties!

## What It Measures:
- **Voltage** (V) - Electrical pressure
- **Current** (A) - Flow of electricity
- **Resistance** (Ω) - Opposition to flow
- **Continuity** - Are two points connected?
- **Diode test** - Is your diode working?

## Parts:
- Display screen
- Selection dial
- Two probes (red and black)
- Probe ports (COM, VΩ, mA, 10A)

It's the MOST important tool for electronics!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Measuring Voltage',
        content: `# Voltage Measurement 📈

Voltage is measured **in parallel** (across a component).

## Steps:
1. Set dial to V⎓ (DC voltage) or V~ (AC voltage)
2. Black probe → COM port
3. Red probe → VΩ port
4. Touch black probe to ground/negative
5. Touch red probe to the point you want to measure
6. Read the display!

## Safety Tips:
- Start with highest range
- Never measure voltage in series
- Circuit can be powered ON
- Red is positive, black is negative

**Practice measuring your battery voltage!**`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Measuring Current',
        content: `# Current Measurement ⚡

Current is measured **in series** (through the circuit).

## Steps:
1. Set dial to A (DC amps) or mA (milliamps)
2. Black probe → COM port
3. Red probe → mA port (or 10A port for high current)
4. BREAK the circuit
5. Insert multimeter in the break
6. Power ON and read display

## Critical Warning! ⚠️
- Never measure current across a battery
- Always measure in series
- Start with highest range
- Can blow fuse if done wrong!

**Practice with an LED circuit!**`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Measuring Resistance',
        content: `# Resistance Measurement 🔧

Resistance is measured with power OFF!

## Steps:
1. Set dial to Ω (ohms)
2. Black probe → COM port
3. Red probe → VΩ port
4. Power OFF the circuit!
5. Touch probes to both ends of resistor
6. Read the display

## Continuity Test:
Set dial to continuity symbol (sound waves icon)
- Beep = connected!
- No beep = not connected

Great for finding broken wires!

## Important:
Always remove power before measuring resistance or you'll get wrong readings!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'power-supplies',
    title: 'Power Supplies and Batteries',
    description: 'Choose and use the right power source for your projects!',
    difficulty: 'intermediate',
    duration: '18 min',
    category: 'Fundamentals',
    icon: '🔌',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Types of Power Sources',
        content: `# Powering Your Projects! 🔋

## Batteries (Portable Power)

### Primary (Single Use):
- **Alkaline** (AA, AAA, 9V) - Common, cheap
- **Lithium** - Long life, expensive

### Secondary (Rechargeable):
- **NiMH** - Good capacity, cheap
- **Li-ion/Li-Po** - High energy, needs protection
- **Lead Acid** - Heavy, cheap, good for high current

## Power Adapters (Wall Power):
- Convert AC to DC
- Rated by voltage and current
- Look for "UL Listed" for safety!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Battery Specifications',
        content: `# Understanding Battery Ratings 📋

## Voltage:
- **1.5V** - Alkaline AA/AAA/C/D
- **9V** - Alkaline 9V battery
- **3.7V** - Li-ion cell
- **12V** - Car battery (lead acid)

## Capacity (mAh):
How long it can supply current:
- 2000mAh battery + 100mA circuit = 20 hours
- Higher mAh = longer runtime

## Series vs Parallel:
- **Series** - Voltages add (2× 1.5V = 3V)
- **Parallel** - Capacity adds (2× 2000mAh = 4000mAh)

Never mix old and new batteries!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Voltage Regulators',
        content: `# Keeping Voltage Steady! 📏

A **voltage regulator** keeps voltage constant even as battery drains.

## Common Types:
- **7805** - Outputs 5V
- **LM317** - Adjustable output
- **Buck converter** - Steps down efficiently
- **Boost converter** - Steps up voltage

## When to Use:
- Circuit needs precise voltage
- Powering sensitive components
- Battery voltage varies too much

## Example Circuit:
9V Battery → 7805 Regulator → 5V Output
Add capacitors for stability!

**Try adding a regulator to your circuit!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'capacitors-advanced',
    title: 'Capacitors Deep Dive',
    description: 'Master energy storage and timing circuits!',
    difficulty: 'advanced',
    duration: '25 min',
    category: 'Components',
    icon: '🔋',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Capacitor Types',
        content: `# Many Flavors! 🧪

## Ceramic Capacitors:
- Small, cheap, non-polarized
- 1pF to 1µF typically
- Great for high frequencies
- Slight value change with temperature

## Electrolytic Capacitors:
- Polarized (+ and -)
- Large values (1µF to 1000s of µF)
- Good for power supply filtering
- Can explode if connected backwards! 💥

## Film Capacitors:
- Stable, precise
- Medium values
- More expensive
- Great for audio circuits

## Tantalum Capacitors:
- Small size, high capacity
- Polarized
- Expensive
- Stable over temperature`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'RC Time Constants',
        content: `# Timing with Resistors and Capacitors ⏱️

When a resistor and capacitor work together, they create precise timing!

## The Formula:
**τ (tau) = R × C**

Where:
- τ = Time constant (seconds)
- R = Resistance (ohms)
- C = Capacitance (farads)

## What It Means:
After 1 time constant:
- Capacitor is 63% charged (or discharged)

After 5 time constants:
- Fully charged (99%)

## Example:
1kΩ × 100µF = 0.1 seconds
5 × 0.1s = 0.5 seconds to fully charge!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Build a Timer Circuit',
        content: `# 555 Timer - The Classic! 🎯

The 555 timer IC is one of the most popular chips ever made!

## Astable Mode (Blinks Forever):
Uses two resistors and one capacitor to create pulses.

**Frequency = 1.44 / ((R1 + 2×R2) × C)**

## Components:
- 555 Timer IC
- 2× Resistors
- 1× Capacitor
- 1× LED
- 1× Battery

The LED will blink at a rate determined by your R and C values!

**Build your own blinking LED!**`,
        type: 'interactive',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Filter Circuits',
        content: `# Cleaning Up Signals 🧹

Capacitors can filter (remove) certain frequencies!

## Low-Pass Filter:
Lets low frequencies through, blocks high frequencies
- Used in audio to remove noise
- R → C → Ground configuration

## High-Pass Filter:
Lets high frequencies through, blocks low (DC)
- Used to block DC in audio circuits
- C → R → Ground configuration

## Cutoff Frequency:
**fc = 1 / (2π × R × C)**

Frequencies above fc are reduced!

## Real Use:
Power supply circuits use capacitors to filter out AC ripple, giving smooth DC.`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'inductors-coils',
    title: 'Inductors and Magnetic Fields',
    description: 'Explore inductors and electromagnetic induction!',
    difficulty: 'advanced',
    duration: '22 min',
    category: 'Components',
    icon: '🧲',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an Inductor?',
        content: `# Coils of Wire! 🌀

An **inductor** is simply a coil of wire - but it has amazing properties!

## How It Works:
Current flowing through the coil creates a magnetic field. When current changes, the magnetic field changes, which creates a voltage!

## Key Property:
Inductors **resist changes** in current
- Unlike resistors (resist current itself)
- Unlike capacitors (resist changes in voltage)

## Symbol:
Looks like a spring or coil in schematics

## Unit:
**Henry (H)** - usually mH (millihenry) or µH (microhenry)`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Inductor Applications',
        content: `# What Are They Used For? 🤔

## 1. Filters (with Capacitors):
Create LC filters for radios and audio
- Low-pass filters
- High-pass filters
- Band-pass filters (select specific frequency)

## 2. Transformers:
Two inductors near each other:
- Changes voltage levels
- Isolates circuits
- Your phone charger has one!

## 3. DC-DC Converters:
Boost voltage efficiently
- Switch current on/off rapidly
- Inductor stores energy
- Releases at different voltage

## 4. RF Circuits:
Essential for:
- Antennas
- Radio transmitters/receivers
- Wireless power transfer`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Back EMF and Protection',
        content: `# The Voltage Spike! ⚡

When current through an inductor stops suddenly, it creates a **huge voltage spike**!

## Why It Happens:
Inductor wants to keep current flowing
When you open the switch, it generates high voltage trying to maintain current

## Real Example:
- Motors have coils (inductors)
- When motor stops, back EMF occurs
- Can be hundreds of volts!
- Can damage transistors and ICs

## Protection:
**Flyback Diode** across the inductor:
- Gives current a path when circuit opens
- Absorbs the voltage spike
- Protects your components!

Always use flyback diodes with relays, motors, and solenoids!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'integrated-circuits',
    title: 'Integrated Circuits (ICs)',
    description: 'Learn about the chips that power modern electronics!',
    difficulty: 'advanced',
    duration: '28 min',
    category: 'Components',
    icon: '🖥️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is an IC?',
        content: `# Tiny Computers on a Chip! 💎

An **Integrated Circuit (IC)** contains thousands to billions of components in a tiny package!

## Inside an IC:
- Transistors
- Resistors
- Capacitors
- Diodes
- All microscopic!

## Common Packages:
- **DIP** (Dual Inline Package) - through-hole, breadboard friendly
- **SOIC** (Small Outline IC) - surface mount
- **QFP** (Quad Flat Package) - many pins
- **BGA** (Ball Grid Array) - highest density

## Pin Identification:
Look for the notch or dot - that marks pin 1!
Pins count counterclockwise from pin 1.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Types of ICs',
        content: `# Many Functions! 🎭

## Analog ICs:
Process continuous signals
- **Op-Amps** (LM358, LM741) - amplify signals
- **Voltage Regulators** (7805) - steady voltage
- **Timer ICs** (555) - create timing pulses

## Digital ICs:
Process binary (0/1) signals
- **Logic Gates** (7400 series)
- **Microcontrollers** (Arduino, PIC)
- **Memory** (RAM, ROM, Flash)

## Mixed-Signal ICs:
Both analog and digital
- **ADC** - Analog to Digital Converter
- **DAC** - Digital to Analog Converter
- **Microcontrollers** (have both!)

## Power Management ICs:
- Battery chargers
- DC-DC converters
- Power monitors`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Reading Datasheets',
        content: `# The IC Manual 📖

Every IC has a **datasheet** - the instruction manual!

## Key Information:
1. **Pin Diagram** - What each pin does
2. **Absolute Maximum Ratings** - Don't exceed these!
3. **Operating Conditions** - Normal use range
4. **Electrical Characteristics** - Performance specs
5. **Application Circuits** - Example uses

## Important Pins:
- **VCC/VDD** - Positive power
- **GND/VSS** - Ground (0V)
- **Inputs** - Signals going in
- **Outputs** - Signals coming out

## Pro Tip:
Always read the datasheet before using an IC! It tells you exactly how to use it safely and correctly.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'IC Best Practices',
        content: `# Keep Your ICs Happy! 😊

## Do's ✅:
- **Use decoupling capacitors** (0.1µF near VCC to GND)
- Check pin orientation before inserting
- Start with low voltage and test
- Use IC sockets for easy replacement
- Handle by edges (don't touch pins)

## Don'ts ❌:
- Never exceed maximum voltage
- Don't apply voltage to inputs before power
- Don't reverse power polarity
- Don't bend pins
- Don't let pins short together

## ESD Protection:
ICs are sensitive to static electricity!
- Touch grounded metal before handling
- Store in anti-static foam or bags
- Use ESD wrist strap when possible

One zap can permanently damage an IC!`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'circuit-protection',
    title: 'Circuit Protection',
    description: 'Keep your circuits safe with proper protection!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Circuit Design',
    icon: '🛡️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Why Protection Matters',
        content: `# Safety First! ⚠️

Circuits can fail in many ways - protection prevents damage and safety hazards!

## Common Failures:
- **Overcurrent** - Too much current flows
- **Overvoltage** - Voltage too high
- **Reverse polarity** - Battery connected backwards
- **Short circuits** - Direct path to ground
- **ESD** - Static electricity discharge

## What Can Happen:
- Components burn out 🔥
- ICs permanently damaged
- Battery overheats
- Fire hazard!
- Personal injury

Good protection saves your project AND keeps you safe!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Overcurrent Protection',
        content: `# Limiting Current Flow ⚡

## Fuses:
One-time protection
- Melts when current too high
- Must be replaced
- Rated by current (e.g., 1A, 500mA)
- Types: fast-blow, slow-blow

## Resettable Fuses (PTC):
Self-resetting protection
- Heats up when current high
- Resistance increases
- Limits current
- Cools down and resets

## Current-Limiting Resistors:
Simple protection
- Calculate: R = V / Imax
- Limits maximum current
- Creates voltage drop
- Dissipates power as heat

Place fuses as close to the power source as possible!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Voltage Protection',
        content: `# Keeping Voltage in Check 📏

## Zener Diodes:
Voltage clamps
- Conducts when voltage exceeds rating
- Shunts excess current to ground
- Protects sensitive components
- Choose voltage rating just above normal

## Transient Voltage Suppressors (TVS):
Fast protection
- Clamps voltage spikes
- Very fast response (nanoseconds)
- Good for ESD protection
- Common in USB circuits

## Voltage Regulators:
Constant output
- Drops excess voltage
- Maintains stable output
- Linear or switching types
- Prevents overvoltage damage

## Metal Oxide Varistors (MOV):
AC protection
- Used in surge protectors
- Clamps high voltage transients
- Degrades over time`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Polarity and Short Protection',
        content: `# Preventing Connection Mistakes 🔄

## Reverse Polarity Protection:

### Method 1: Diode
- Simple and cheap
- 0.7V drop (power loss)
- Use Schottky for less drop

### Method 2: P-MOSFET
- No voltage drop
- More complex circuit
- Most efficient

## Short Circuit Protection:
- Use current limiting
- Add fuses
- Current sense resistors
- Electronic circuit breakers

## Build a Protected Circuit:
Battery → Fuse → Reverse Protection Diode → Voltage Regulator → Circuit

Now your circuit is protected from most common failures!

**Try adding protection to your projects!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
  {
    id: 'pcb-design-intro',
    title: 'Introduction to PCB Design',
    description: 'Learn how to design and order custom circuit boards!',
    difficulty: 'advanced',
    duration: '30 min',
    category: 'Circuit Design',
    icon: '🔲',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'What is a PCB?',
        content: `# Printed Circuit Boards! 🎨

A **PCB** is a board with copper traces that connect components - like a breadboard, but permanent!

## Layers:
- **Top copper** - Traces and pads
- **Bottom copper** - More traces
- **Substrate** - Insulating material (usually FR4)
- **Silkscreen** - Labels and text
- **Soldermask** - Green coating (protects copper)

## Why Use PCBs?
✅ Professional and permanent
✅ Compact size
✅ Reliable connections
✅ Can be mass-produced
✅ No messy wires!

## When to Use:
- Final version of your project
- Need multiple copies
- Commercial products
- Professional appearance`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'PCB Design Software',
        content: `# Tools of the Trade 🛠️

## Popular Free Options:

### KiCad:
- Completely free
- Professional features
- Open source
- Steep learning curve
- Large library

### EasyEDA:
- Web-based
- Integrated with JLCPCB
- Easy to learn
- Good for beginners

### Fusion 360 (Eagle):
- Free for hobbyists
- Professional software
- Good community

## Design Process:
1. **Schematic** - Draw the circuit
2. **Assign footprints** - Choose part packages
3. **Layout** - Place and route components
4. **Design rules check** - Find errors
5. **Generate Gerbers** - Files for manufacturer`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'PCB Design Best Practices',
        content: `# Making Great Boards! ⭐

## Trace Width:
- Power traces: 0.5mm - 1mm (or more)
- Signal traces: 0.25mm - 0.4mm
- Use trace width calculators for current

## Spacing:
- Minimum clearance: 0.2mm
- More space for high voltage!
- Keep AC away from sensitive signals

## Component Placement:
- Group related components
- Keep signal paths short
- Decoupling caps near IC power pins
- Consider thermal management

## Ground Planes:
- Use copper pour for ground
- Reduces noise
- Better return paths
- Acts as shield

## Vias:
- Connect top and bottom layers
- Don't place under SMD pads
- Use thermal relief for ground connections`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Ordering Your PCB',
        content: `# From Design to Reality! 📦

## Popular Manufacturers:
- **JLCPCB** - Cheap, fast, good quality
- **PCBWay** - Good for prototypes
- **OSH Park** - USA-based, purple boards!
- **Seeed Studio** - Good for small batches

## What to Specify:
- **Dimensions** - Board size
- **Layers** - Usually 2 (top and bottom)
- **Thickness** - Usually 1.6mm
- **Color** - Green is cheapest
- **Surface finish** - HASL or ENIG
- **Quantity** - Often 5 minimum

## Costs:
- Small 2-layer board: $2-5 for 5 pieces
- Shipping: $5-20
- Production time: 2-5 days
- Delivery: 1-2 weeks

## First Time Tips:
- Order extra boards (mistakes happen!)
- Check design 3 times before ordering
- Start with simple designs
- Join boards together to save cost`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Circuit Troubleshooting',
    description: 'Learn systematic debugging techniques!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Fundamentals',
    icon: '🔧',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Systematic Approach',
        content: `# Debug Like a Pro! 🔍

When circuits don't work, use a systematic approach!

## The Scientific Method:
1. **Observe** - What's happening?
2. **Hypothesize** - What could be wrong?
3. **Test** - Check your hypothesis
4. **Repeat** - Until you find the problem

## Common Symptoms:
- Nothing happens (no power)
- Component gets hot (short or wrong value)
- Intermittent behavior (loose connection)
- Wrong output (calculation error)
- Component damaged (smoke, burning smell)

## First Steps:
✓ Visual inspection
✓ Check power supply
✓ Verify component orientation
✓ Look for obvious damage`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Common Mistakes',
        content: `# The Usual Suspects! 🕵️

## Top 10 Beginner Errors:

1. **Polarity Wrong** - LEDs, capacitors, diodes backwards
2. **Missing Ground** - Always close the loop!
3. **Wrong Values** - Read resistor bands carefully
4. **Loose Connections** - Push components in firmly
5. **No Current Limiting** - LEDs need resistors!
6. **Power Supply Issues** - Check voltage and current
7. **Breadboard Problems** - Verify internal connections
8. **Component Damage** - Got hot? Probably dead
9. **Wiring Errors** - Follow schematic carefully
10. **Calculation Mistakes** - Double-check Ohm's Law

## Quick Checks:
- Battery connected?
- Battery still good?
- Switches in right position?
- Fuses not blown?`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Using Test Equipment',
        content: `# Measurement is Key! 📊

## Multimeter Tests:

### Voltage Check:
- Measure at power source (correct?)
- Measure at IC power pins (reaching?)
- Measure at component inputs (right levels?)

### Continuity Check:
- Test all connections
- Find broken wires
- Verify switch operation
- Check solder joints

### Resistance Check:
- Power OFF first!
- Verify resistor values
- Check for shorts (0Ω)
- Check for opens (infinite Ω)

### Current Check:
- Measure series current
- Compare to expected value
- Find shorts (high current)

## Oscilloscope (Advanced):
- View signal waveforms
- Check timing
- Find noise issues
- Verify frequency`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Isolation and Division',
        content: `# Divide and Conquer! ✂️

## Block Testing:
Break circuit into sections:

1. **Power Supply Block**
   - Test voltage at source
   - Test current capability
   - Check regulation

2. **Input Section**
   - Verify sensor/switch works
   - Check signal levels
   - Test connections

3. **Processing Section**
   - ICs getting power?
   - Inputs correct?
   - Outputs responding?

4. **Output Section**
   - Power reaching load?
   - Component working individually?
   - Correct voltage/current?

## Progressive Testing:
- Start simple (just power LED)
- Add one section at a time
- Test after each addition
- Isolate where it breaks

## The Swap Test:
Suspect a component?
- Replace with known good one
- If works, found the problem!
- Keep spare components handy`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'soldering-basics',
    title: 'Soldering Techniques',
    description: 'Master the art of making permanent connections!',
    difficulty: 'intermediate',
    duration: '25 min',
    category: 'Fundamentals',
    icon: '🔥',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Soldering Equipment',
        content: `# The Essentials! 🛠️

## Basic Tools:
- **Soldering Iron** - 30-60W, temperature controlled
- **Solder** - 60/40 or 63/37 tin/lead or lead-free
- **Stand** - Holds hot iron safely
- **Sponge/Brass Wool** - Cleans tip
- **Helping Hands** - Holds components
- **Wire Cutters** - Trim leads

## Safety Equipment:
- **Ventilation** - Fumes are harmful!
- **Safety Glasses** - Protect eyes from splashes
- **Heat-Resistant Mat** - Protect workspace

## Temperature:
- Lead solder: 300-350°C (572-662°F)
- Lead-free: 350-400°C (662-752°F)
- Too hot = damages components
- Too cold = cold joints`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Good Solder Joints',
        content: `# What to Aim For! 🎯

## Perfect Joint Characteristics:
✓ **Shiny** - Smooth, reflective surface
✓ **Concave** - Gentle cone shape
✓ **Fills Pad** - Complete coverage
✓ **No Excess** - Just enough solder
✓ **Strong Bond** - Mechanically solid

## Bad Joints:

### Cold Joint:
- Dull, grainy appearance
- Solder didn't melt properly
- Unreliable connection
- Fix: Reheat properly

### Dry Joint:
- Not enough solder
- Weak connection
- May fail over time
- Fix: Add more solder

### Solder Bridge:
- Connects adjacent pins
- Creates short circuit
- Fix: Solder wick or desoldering

### Too Much Solder:
- Blob-like appearance
- May hide problems
- Wastes solder
- Fix: Remove excess`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Soldering Technique',
        content: `# The Perfect Process! 🌟

## Step-by-Step:

### 1. Prepare
- Clean iron tip (wet sponge)
- Tin the tip (coat with solder)
- Component ready and secured

### 2. Heat
- Touch iron to BOTH pad and lead
- Wait 1-2 seconds
- Must heat both!

### 3. Apply Solder
- Feed solder to the JOINT (not iron)
- Solder should melt on contact
- Apply just enough to coat

### 4. Remove
- Remove solder first
- Keep heating 1 more second
- Remove iron
- Don't move component!

### 5. Cool
- Wait 3-5 seconds
- Don't blow on it
- Check joint quality

## Pro Tips:
- Use flux for better flow
- Keep tip clean
- Work quickly but carefully
- Practice on scrap first!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Desoldering',
        content: `# Fixing Mistakes! 🔄

## Methods:

### Solder Wick (Braid):
- Copper braid absorbs solder
- Press to joint with hot iron
- Solder wicks up into braid
- Cut off used section
- Best for: Small joints, SMD

### Solder Sucker (Pump):
- Spring-loaded vacuum pump
- Heat joint
- Place tip over joint
- Release plunger
- Solder sucked up
- Best for: Through-hole components

### Desoldering Station:
- Combination iron + vacuum
- Professional tool
- Heat and suck simultaneously
- Best for: Lots of desoldering

## Tips:
- Add fresh solder first (improves heat transfer)
- May need multiple attempts
- Be patient
- Don't overheat pads
- PCB pads can lift if overheated!

## Component Removal:
Heat one lead at a time, gently wiggle component free`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'project-planning',
    title: 'Planning Your Projects',
    description: 'Learn to design successful electronic projects!',
    difficulty: 'intermediate',
    duration: '20 min',
    category: 'Fundamentals',
    icon: '📝',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Defining Requirements',
        content: `# Start with the End in Mind! 🎯

## Key Questions:

### 1. What Should It Do?
- Core functionality
- Features (must-have vs nice-to-have)
- User interface needs
- Output requirements

### 2. Where Will It Be Used?
- Indoor or outdoor?
- Temperature range
- Humidity/weather exposure
- Vibration/movement

### 3. What Are the Constraints?
- **Size** - How big can it be?
- **Power** - Battery or wall power?
- **Cost** - Budget limitations?
- **Time** - Deadline for completion?

### 4. Who Is It For?
- You (learning project)
- Others (needs to be user-friendly)
- Commercial (needs to be professional)

Write down specific, measurable requirements!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'Breaking Down the System',
        content: `# Divide into Blocks! 🧩

## System Block Diagram:

Every project has blocks:

### Input Block:
- Sensors
- Switches
- User interface
- Data sources

### Processing Block:
- Microcontroller
- Logic circuits
- Signal conditioning
- Calculations

### Output Block:
- LEDs, displays
- Motors, actuators
- Sound, buzzers
- Communication

### Power Block:
- Battery/adapter
- Voltage regulation
- Power distribution
- Protection

Draw each block and connections!
This makes complex projects manageable.`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'Component Selection',
        content: `# Choosing the Right Parts! 🛒

## Research Process:

### 1. Identify Needs
- What specs are required?
- Voltage, current, speed, accuracy
- Physical size constraints

### 2. Find Candidates
- Search suppliers (Digi-Key, Mouser, Amazon)
- Check availability
- Compare specifications
- Read reviews

### 3. Check Compatibility
- Voltage levels match?
- Current requirements met?
- Interfaces work together?
- Physical mounting possible?

### 4. Consider Practicality
- Can you solder it?
- Breadboard compatible?
- Documentation available?
- Support libraries exist?

### 5. Budget Check
- Cost per unit
- Shipping costs
- Quantity discounts
- Alternatives available?

## Pro Tips:
- Buy extras (mistakes happen!)
- Choose common parts (easier to replace)
- Prioritize parts with good documentation`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Prototyping Strategy',
        content: `# Build, Test, Iterate! 🔄

## Development Stages:

### Stage 1: Proof of Concept
- Breadboard simple version
- Test core functionality
- Verify approach works
- Use dev boards (Arduino, etc.)

### Stage 2: Prototype
- Add all features
- Still on breadboard
- Test extensively
- Find and fix bugs

### Stage 3: Integration
- Combine all blocks
- Test interactions
- Verify power consumption
- Check timing issues

### Stage 4: Finalization
- Design PCB or stripboard
- Choose enclosure
- Plan assembly process
- Document everything!

## Testing Between Stages:
- Does each block work alone?
- Do blocks work together?
- Edge cases handled?
- Failure modes considered?

## Documentation Tips:
- Take photos of working breadboard
- Note component values
- Draw schematic as you go
- Keep a project journal`,
        type: 'text',
        completed: false,
      },
    ],
  },
  {
    id: 'logic-gates',
    title: 'Logic Gates - Digital Basics',
    description: 'Learn how computers make decisions!',
    difficulty: 'advanced',
    duration: '35 min',
    category: 'Digital',
    icon: '🖥️',
    progress: 0,
    steps: [
      {
        id: 'step-1',
        title: 'Binary - The Language of Computers',
        content: `# Ones and Zeros 🔢

Computers only understand two things:
- **1** = ON / HIGH / TRUE
- **0** = OFF / LOW / FALSE

This is called **binary**!

## Why Binary?
It's easy to represent with electricity:
- Voltage present = 1
- No voltage = 0

All the amazing things computers do come from combining 1s and 0s!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-2',
        title: 'AND, OR, NOT Gates',
        content: `# The Basic Gates 🚪

## AND Gate
Output is 1 only if BOTH inputs are 1
- 0 AND 0 = 0
- 0 AND 1 = 0
- 1 AND 0 = 0
- 1 AND 1 = 1

## OR Gate
Output is 1 if ANY input is 1
- 0 OR 0 = 0
- 0 OR 1 = 1
- 1 OR 0 = 1
- 1 OR 1 = 1

## NOT Gate
Flips the input
- NOT 0 = 1
- NOT 1 = 0`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-3',
        title: 'NAND, NOR, XOR Gates',
        content: `# More Logic Gates! 🎛️

## NAND Gate
NOT + AND = opposite of AND
- 0 NAND 0 = 1
- 0 NAND 1 = 1
- 1 NAND 0 = 1
- 1 NAND 1 = 0

**Fun Fact:** You can build ANY logic circuit using only NAND gates!

## NOR Gate
NOT + OR = opposite of OR
- 0 NOR 0 = 1
- 0 NOR 1 = 0
- 1 NOR 0 = 0
- 1 NOR 1 = 0

## XOR Gate (Exclusive OR)
Output is 1 if inputs are DIFFERENT
- 0 XOR 0 = 0
- 0 XOR 1 = 1
- 1 XOR 0 = 1
- 1 XOR 1 = 0

Great for comparison and parity checking!`,
        type: 'text',
        completed: false,
      },
      {
        id: 'step-4',
        title: 'Building Digital Circuits',
        content: `# Practical Logic! ⚡

## 7400 Series ICs:
Classic logic chips still used today!

- **7400** - Quad 2-input NAND gate
- **7402** - Quad 2-input NOR gate
- **7404** - Hex inverter (NOT gates)
- **7408** - Quad 2-input AND gate
- **7432** - Quad 2-input OR gate
- **7486** - Quad 2-input XOR gate

## Voltage Levels:
- TTL: 0V = 0, 5V = 1
- CMOS: 0V = 0, 3.3V or 5V = 1

## Example Project:
Build a burglar alarm!
- Switch on door (input)
- Switch on window (input)
- OR gate (if either opens)
- Buzzer (output)

**Try building logic circuits!**`,
        type: 'interactive',
        completed: false,
      },
    ],
  },
];

// Additional tutorial categories for future expansion
export const futureTutorialCategories = [
  {
    category: 'Microcontrollers',
    topics: [
      'Introduction to Arduino',
      'Programming Basics',
      'Digital I/O',
      'Analog Inputs',
      'PWM and Analog Output',
      'Serial Communication',
    ],
  },
  {
    category: 'Communication',
    topics: [
      'UART/Serial',
      'I2C Protocol',
      'SPI Protocol',
      'Wireless (Bluetooth/WiFi)',
      'RF Communication',
    ],
  },
  {
    category: 'Sensors',
    topics: [
      'Temperature Sensors',
      'Light Sensors',
      'Motion/Accelerometers',
      'Distance Sensors',
      'Gas/Environmental Sensors',
    ],
  },
  {
    category: 'Power Electronics',
    topics: [
      'Buck Converters',
      'Boost Converters',
      'Linear Regulators',
      'Battery Management',
      'Solar Power',
    ],
  },
  {
    category: 'Audio',
    topics: [
      'Audio Amplifiers',
      'Speakers and Transducers',
      'Tone Generation',
      'Audio Filters',
      'Music Synthesis',
    ],
  },
  {
    category: 'Advanced Digital',
    topics: [
      'Flip-Flops and Latches',
      'Counters',
      'Shift Registers',
      'Multiplexers',
      'State Machines',
    ],
  },
];

export const getTutorialsByDifficulty = (difficulty: string) => {
  return tutorials.filter((t) => t.difficulty === difficulty);
};

export const getTutorialById = (id: string) => {
  return tutorials.find((t) => t.id === id);
};
