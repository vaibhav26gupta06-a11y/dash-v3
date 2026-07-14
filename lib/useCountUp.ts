import { useEffect, useRef, useState } from 'react'

export function useCountUp(targetValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue)
  const animationRef = useRef<number | null>(null)
  const startValueRef = useRef(targetValue)

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const startValue = startValueRef.current
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (targetValue - startValue) * easeOut

      setDisplayValue(Math.round(currentValue * 10) / 10)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        startValueRef.current = targetValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue, duration])

  return displayValue
}
