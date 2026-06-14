export const SIGNS = ['A','B','C','D','E','F','G','H','I','L','O','R','U','V','W','Y']

export const SIGN_RULES = {
  'A': { thumb: 0.5, index: 0,   middle: 0,   ring: 0,   pinky: 0   },
  'B': { thumb: 0,   index: 1,   middle: 1,   ring: 1,   pinky: 1   },
  'C': { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0.5 },
  'D': { thumb: 0.5, index: 1,   middle: 0,   ring: 0,   pinky: 0   },
  'E': { thumb: 0,   index: 0,   middle: 0,   ring: 0,   pinky: 0   },
  'F': { thumb: 0.5, index: 0,   middle: 1,   ring: 1,   pinky: 1   },
  'G': { thumb: 1,   index: 1,   middle: 0,   ring: 0,   pinky: 0   },
  'H': { thumb: 0,   index: 1,   middle: 1,   ring: 0,   pinky: 0   },
  'I': { thumb: 0,   index: 0,   middle: 0,   ring: 0,   pinky: 1   },
  'L': { thumb: 1,   index: 1,   middle: 0,   ring: 0,   pinky: 0   },
  'O': { thumb: 0.5, index: 0.5, middle: 0.5, ring: 0.5, pinky: 0   },
  'R': { thumb: 0,   index: 1,   middle: 1,   ring: 0,   pinky: 0   },
  'U': { thumb: 0,   index: 1,   middle: 1,   ring: 0,   pinky: 0   },
  'V': { thumb: 0,   index: 1,   middle: 1,   ring: 0,   pinky: 0   },
  'W': { thumb: 0,   index: 1,   middle: 1,   ring: 1,   pinky: 0   },
  'Y': { thumb: 1,   index: 0,   middle: 0,   ring: 0,   pinky: 1   },
}

// Extended joint positions for each finger — 4 joints each
const EXTENDED = {
  thumb:  [[ 0.15,-0.10],[ 0.25,-0.20],[ 0.32,-0.32],[ 0.35,-0.42]],
  index:  [[ 0.10,-0.30],[ 0.10,-0.52],[ 0.10,-0.70],[ 0.10,-0.90]],
  middle: [[ 0.00,-0.30],[ 0.00,-0.55],[ 0.00,-0.75],[ 0.00,-0.95]],
  ring:   [[-0.10,-0.30],[-0.10,-0.52],[-0.10,-0.70],[-0.10,-0.90]],
  pinky:  [[-0.20,-0.25],[-0.20,-0.45],[-0.20,-0.60],[-0.20,-0.75]],
}

// Curled joint positions for each finger — 4 joints each
const CURLED = {
  thumb:  [[ 0.10,-0.05],[ 0.15,-0.10],[ 0.15,-0.05],[ 0.10, 0.00]],
  index:  [[ 0.10,-0.30],[ 0.15,-0.35],[ 0.15,-0.30],[ 0.10,-0.25]],
  middle: [[ 0.00,-0.30],[ 0.05,-0.35],[ 0.05,-0.30],[ 0.00,-0.25]],
  ring:   [[-0.10,-0.30],[-0.05,-0.35],[-0.05,-0.30],[-0.10,-0.25]],
  pinky:  [[-0.20,-0.25],[-0.15,-0.30],[-0.15,-0.25],[-0.20,-0.20]],
}

const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky']

function lerp(a, b, t) { return a + (b - a) * t }
function noise(n) { return (Math.random() - 0.5) * n }

// Produces exactly 21 landmarks = 42 numbers
// Structure:
//   [0]      = wrist
//   [1..4]   = thumb  (4 joints)
//   [5..8]   = index  (4 joints)
//   [9..12]  = middle (4 joints)
//   [13..16] = ring   (4 joints)
//   [17..20] = pinky  (4 joints)
// Total: 1 + 5×4 = 21 ✓
function makeSample(rule) {
  const pts = []

  // Landmark 0 — wrist at origin
  pts.push([0, 0])

  // 4 joints per finger × 5 fingers = 20 more landmarks
  FINGERS.forEach(finger => {
    const ext = rule[finger]
    for (let j = 0; j < 4; j++) {
      const e = EXTENDED[finger][j]
      const c = CURLED[finger][j]
      pts.push([
        lerp(c[0], e[0], ext) + noise(0.03),
        lerp(c[1], e[1], ext) + noise(0.03),
      ])
    }
  })

  // Must be exactly 21
  console.assert(pts.length === 21, `Expected 21 got ${pts.length}`)

  // Flatten → [x0,y0, x1,y1 ... x20,y20] = 42 numbers
  return pts.flat()
}

export function generateTrainingSamples() {
  const samples = []
  const labels  = []

  SIGNS.forEach((sign, idx) => {
    for (let i = 0; i < 50; i++) {
      samples.push(makeSample(SIGN_RULES[sign]))
      labels.push(idx)
    }
  })

  return { samples, labels }
}