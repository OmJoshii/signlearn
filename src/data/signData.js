// Each sign is defined by which fingers are "up" (extended)
// Fingers order: [thumb, index, middle, ring, pinky]
// This maps to rules we check against the normalized landmarks

export const SIGNS = ['A','B','C','D','E','F','G','H','I','L','O','R','U','V','W','Y']

// For each sign, define the finger extension pattern
// 1 = finger extended/up, 0 = finger curled/down, 0.5 = partially extended
export const SIGN_RULES = {
  'A': { thumb: 0.5, index: 0, middle: 0, ring: 0, pinky: 0 },
  'B': { thumb: 0,   index: 1, middle: 1, ring: 1, pinky: 1 },
  'C': { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
  'D': { thumb: 0.5, index: 1, middle: 0, ring: 0, pinky: 0 },
  'E': { thumb: 0,   index: 0, middle: 0, ring: 0, pinky: 0 },
  'F': { thumb: 0.5, index: 0, middle: 1, ring: 1, pinky: 1 },
  'G': { thumb: 1,   index: 1, middle: 0, ring: 0, pinky: 0 },
  'H': { thumb: 0,   index: 1, middle: 1, ring: 0, pinky: 0 },
  'I': { thumb: 0,   index: 0, middle: 0, ring: 0, pinky: 1 },
  'L': { thumb: 1,   index: 1, middle: 0, ring: 0, pinky: 0 },
  'O': { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0 },
  'R': { thumb: 0,   index: 1, middle: 1, ring: 0, pinky: 0 },
  'U': { thumb: 0,   index: 1, middle: 1, ring: 0, pinky: 0 },
  'V': { thumb: 0,   index: 1, middle: 1, ring: 0, pinky: 0 },
  'W': { thumb: 0,   index: 1, middle: 1, ring: 1, pinky: 0 },
  'Y': { thumb: 1,   index: 0, middle: 0, ring: 0, pinky: 1 },
}

// Generate synthetic training samples for each sign
// We add small random variations to simulate real hand positions
export function generateTrainingSamples() {
  const samples = []
  const labels  = []

  SIGNS.forEach((sign, labelIndex) => {
    const rule = SIGN_RULES[sign]

    // Generate 50 variations per sign
    for (let i = 0; i < 50; i++) {
      const landmarks = generateLandmarksFromRule(rule)
      samples.push(landmarks)
      labels.push(labelIndex)
    }
  })

  return { samples, labels }
}

// Convert a finger rule into 42 numbers (21 landmarks × x,y)
function generateLandmarksFromRule(rule) {
  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky']

  // Base positions for each finger joint (relative to wrist)
  const basePositions = {
    thumb:  [[0.1, -0.1], [0.2, -0.2], [0.3, -0.3], [0.35, -0.4]],
    index:  [[0.1, -0.3], [0.1, -0.5], [0.1, -0.7], [0.1, -0.9]],
    middle: [[0.0, -0.3], [0.0, -0.55],[0.0, -0.75],[0.0, -0.95]],
    ring:   [[-0.1,-0.3], [-0.1,-0.5], [-0.1,-0.7], [-0.1,-0.9]],
    pinky:  [[-0.2,-0.25],[-0.2,-0.45],[-0.2,-0.6], [-0.2,-0.75]],
  }

  // Curled positions (finger folded down)
  const curledPositions = {
    thumb:  [[0.1,-0.05],[0.15,-0.1],[0.15,-0.05],[0.1, 0.0]],
    index:  [[0.1, -0.3],[0.15,-0.35],[0.15,-0.3],[0.1,-0.25]],
    middle: [[0.0, -0.3],[0.05,-0.35],[0.05,-0.3],[0.0,-0.25]],
    ring:   [[-0.1,-0.3],[-0.05,-0.35],[-0.05,-0.3],[-0.1,-0.25]],
    pinky:  [[-0.2,-0.25],[-0.15,-0.3],[-0.15,-0.25],[-0.2,-0.2]],
  }

  // Start with wrist at origin
  const points = [[0, 0]]

  // Palm base points (landmarks 1,5,9,13,17 — base of each finger)
  points.push([0.15, -0.05])  // thumb base
  points.push([0.1,  -0.25])  // index base
  points.push([0.0,  -0.25])  // middle base
  points.push([-0.1, -0.25])  // ring base
  points.push([-0.2, -0.2])   // pinky base

  // Add each finger's joints
  fingers.forEach(finger => {
    const extension = rule[finger]
    const base      = basePositions[finger]
    const curled    = curledPositions[finger]

    base.forEach((basePos, j) => {
      const curl = curled[finger] ? curled[finger][j] : curled[j]
      // Interpolate between curled and extended based on extension value
      const x = lerp(curl[0], basePos[0], extension) + noise(0.03)
      const y = lerp(curl[1], basePos[1], extension) + noise(0.03)
      points.push([x, y])
    })
  })

  // Flatten to [x0,y0,x1,y1,...] format
  return points.flat()
}

// Linear interpolation between two values
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Small random noise to simulate real variation
function noise(amount) {
  return (Math.random() - 0.5) * amount
}