import { useEffect, useRef, useState } from 'react'

export function useCountUp(targetValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return

    hasAnimated.current = true
    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (targetValue - startValue) * easeOut

      setDisplayValue(Math.round(currentValue * 10) / 10)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration])

  return displayValue
}
