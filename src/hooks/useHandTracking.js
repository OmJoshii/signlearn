import { useState, useEffect, useRef } from 'react'
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision'

export function useHandTracking(videoRef, canvasRef, isActive) {
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState(null)
  const [landmarks, setLandmarks]     = useState(null)
  const handLandmarkerRef             = useRef(null)
  const animationFrameRef             = useRef(null)

  // Step A — Load the MediaPipe model
  useEffect(() => {
    async function loadModel() {
      try {
        // FilesetResolver loads the WebAssembly files MediaPipe needs
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        // Create the hand landmarker with our settings
        handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU' // use GPU for speed, falls back to CPU
          },
          runningMode: 'VIDEO',  // we're processing a live video, not images
          numHands: 1            // detect one hand at a time
        })

        setIsLoading(false)
      } catch (err) {
        setError('Failed to load hand tracking model')
        console.error(err)
      }
    }

    loadModel()

    // Cleanup when component unmounts
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Step B — Start detecting once model is ready and camera is active
  useEffect(() => {
    if (isLoading || !isActive || !videoRef.current) return

    function detect() {
      const video  = videoRef.current
      const canvas = canvasRef.current

      if (!video || !canvas || video.readyState < 2) {
        // Video not ready yet, try again next frame
        animationFrameRef.current = requestAnimationFrame(detect)
        return
      }

      // Match canvas size to video size
      canvas.width  = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Run hand detection on current video frame
      const result = handLandmarkerRef.current.detectForVideo(video, performance.now())

      if (result.landmarks && result.landmarks.length > 0) {
        const hand = result.landmarks[0] // first hand detected
        setLandmarks(hand)
        drawLandmarks(ctx, hand, canvas.width, canvas.height)
      } else {
        setLandmarks(null)
      }

      // Schedule next frame (creates a smooth detection loop ~60fps)
      animationFrameRef.current = requestAnimationFrame(detect)
    }

    detect()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isLoading, isActive, videoRef, canvasRef])

  return { isLoading, error, landmarks }
}

// Draw the 21 dots and connecting lines on the canvas
function drawLandmarks(ctx, landmarks, width, height) {
  // Connection pairs — which dots to draw lines between
  const connections = [
    [0,1],[1,2],[2,3],[3,4],         // thumb
    [0,5],[5,6],[6,7],[7,8],         // index
    [0,9],[9,10],[10,11],[11,12],    // middle
    [0,13],[13,14],[14,15],[15,16],  // ring
    [0,17],[17,18],[18,19],[19,20],  // pinky
    [5,9],[9,13],[13,17]             // palm connections
  ]

  // Draw lines between connected points
  ctx.strokeStyle = '#A78BFA' // purple
  ctx.lineWidth   = 2
  connections.forEach(([a, b]) => {
    ctx.beginPath()
    ctx.moveTo(landmarks[a].x * width, landmarks[a].y * height)
    ctx.lineTo(landmarks[b].x * width, landmarks[b].y * height)
    ctx.stroke()
  })

  // Draw dots on each landmark
  landmarks.forEach((point, index) => {
    const x = point.x * width
    const y = point.y * height

    ctx.beginPath()
    // Fingertips (4,8,12,16,20) are bigger and white
    const isTip = [4, 8, 12, 16, 20].includes(index)
    ctx.arc(x, y, isTip ? 6 : 4, 0, Math.PI * 2)
    ctx.fillStyle = isTip ? '#FFFFFF' : '#7C3AED'
    ctx.fill()
    ctx.strokeStyle = '#7C3AED'
    ctx.lineWidth   = 1.5
    ctx.stroke()
  })
}