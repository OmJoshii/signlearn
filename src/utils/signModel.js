import * as tf from '@tensorflow/tfjs'
import { SIGNS, generateTrainingSamples } from '../data/signData'

let model = null
let isTraining = false

// Normalize landmarks relative to wrist position
// This makes recognition work regardless of hand position on screen
export function normalizeLandmarks(landmarks) {
  // Wrist is landmark 0 — use it as the origin
  const wristX = landmarks[0].x
  const wristY = landmarks[0].y

  // Get all x,y relative to wrist
  const points = landmarks.map(lm => [
    lm.x - wristX,
    lm.y - wristY
  ])

  // Find the max distance to scale everything between -1 and 1
  const maxDist = Math.max(
    ...points.map(([x, y]) => Math.sqrt(x * x + y * y))
  )

  if (maxDist === 0) return points.flat()

  // Scale all points
  return points.map(([x, y]) => [x / maxDist, y / maxDist]).flat()
}

// Build and train the neural network
export async function trainModel(onProgress) {
  if (isTraining) return
  isTraining = true

  // Generate training data
  const { samples, labels } = generateTrainingSamples()

  // Convert to TensorFlow tensors (the format TF.js needs)
  const xs = tf.tensor2d(samples)                    // input:  shape [800, 42]
  const ys = tf.oneHot(tf.tensor1d(labels, 'int32'), SIGNS.length) // output: shape [800, 16]

  // Build the neural network architecture
  model = tf.sequential({
    layers: [
      // Input layer — takes 42 numbers
      tf.layers.dense({
        inputShape: [42],
        units: 128,
        activation: 'relu'  // relu = "keep positive values, zero out negatives"
      }),
      // Dropout — randomly turns off 30% of neurons during training
      // This prevents the model from "memorizing" instead of "learning"
      tf.layers.dropout({ rate: 0.3 }),
      // Hidden layer
      tf.layers.dense({
        units: 64,
        activation: 'relu'
      }),
      tf.layers.dropout({ rate: 0.2 }),
      // Output layer — one probability per sign
      tf.layers.dense({
        units: SIGNS.length,
        activation: 'softmax' // softmax = convert to probabilities that add up to 1
      })
    ]
  })

  // Compile — tell the model how to learn
  model.compile({
    optimizer: 'adam',               // adam = smart learning rate adjustment
    loss: 'categoricalCrossentropy', // standard loss for classification
    metrics: ['accuracy']
  })

  // Train the model
  await model.fit(xs, ys, {
    epochs: 50,          // go through all data 50 times
    batchSize: 32,       // process 32 samples at a time
    validationSplit: 0.2, // use 20% of data to validate (not train)
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        // Report progress back to UI
        if (onProgress) {
          onProgress({
            epoch: epoch + 1,
            total: 50,
            accuracy: (logs.acc * 100).toFixed(1),
            loss: logs.loss.toFixed(4)
          })
        }
      }
    }
  })

  // Clean up tensors from memory
  xs.dispose()
  ys.dispose()

  isTraining = false
  return model
}

// Predict which sign is being shown
export function predict(landmarks) {
  if (!model) return null

  // Normalize the landmarks
  const input = normalizeLandmarks(landmarks)

  // Run through the model
  const inputTensor = tf.tensor2d([input])
  const prediction  = model.predict(inputTensor)
  const probabilities = prediction.dataSync()

  inputTensor.dispose()
  prediction.dispose()

  // Find the sign with highest probability
  let maxProb  = 0
  let maxIndex = 0
  probabilities.forEach((prob, i) => {
    if (prob > maxProb) {
      maxProb  = prob
      maxIndex = i
    }
  })

  // Only return a result if confidence is above 70%
  if (maxProb < 0.7) return null

  return {
    sign:       SIGNS[maxIndex],
    confidence: (maxProb * 100).toFixed(1),
    allProbs:   Array.from(probabilities).map((p, i) => ({
      sign: SIGNS[i],
      prob: (p * 100).toFixed(1)
    }))
  }
}

export function isModelReady() {
  return model !== null
}