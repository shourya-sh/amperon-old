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
        title: 'How Capacitors Work',
        content: `# Energy Storage! ⚡

A **capacitor** stores electrical energy in an electric field.

## Inside a Capacitor:
- Two metal plates
- Separated by an insulator (dielectric)
- Electrons build up on one plate
- This creates a voltage!

## Key Formula:
**Q = C × V**
- Q = Charge (Coulombs)
- C = Capacitance (Farads)
- V = Voltage (Volts)`,
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
    ],
  },
];

export const getTutorialsByDifficulty = (difficulty: string) => {
  return tutorials.filter((t) => t.difficulty === difficulty);
};

export const getTutorialById = (id: string) => {
  return tutorials.find((t) => t.id === id);
};
