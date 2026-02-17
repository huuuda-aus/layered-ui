import {
  Children,
  type CSSProperties,
  type ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type LayeredSceneProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  transitionMs?: number
  easing?: string
  depthSpacingPx?: number
  perspectivePx?: number
  blurAt1Px?: number
  blurAt2Px?: number
  opacityAt1?: number
  opacityAt2?: number
  minVisibleOpacity?: number
  initialIndex?: number
}

export function LayeredScene({
  children,
  className,
  style,
  transitionMs = 250,
  easing = 'ease-out',
  depthSpacingPx = 200,
  perspectivePx = 3000,
  blurAt1Px = 6,
  blurAt2Px = 10,
  opacityAt1 = 0.7,
  opacityAt2 = 0.45,
  minVisibleOpacity = 0.2,
  initialIndex = 0,
}: LayeredSceneProps) {
  const layers = useMemo(() => Children.toArray(children), [children])

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const lerpDepth = (depth: number, at0: number, at1: number, at2: number) => {
    if (depth <= 0) return at0
    if (depth >= 2) return at2
    if (depth <= 1) return lerp(at0, at1, clamp01(depth))
    return lerp(at1, at2, clamp01(depth - 1))
  }

  const [activeIndex, setActiveIndex] = useState(() => {
    if (Number.isNaN(initialIndex)) return 0
    return Math.max(0, Math.min(layers.length - 1, initialIndex))
  })
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [incomingPhase, setIncomingPhase] = useState<0 | 1>(1)
  const [outgoingPhase, setOutgoingPhase] = useState<0 | 1>(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [motionDirection, setMotionDirection] = useState<1 | -1>(1)

  const timeoutRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  const goToIndex = useCallback((nextIndex: number) => {
    if (isAnimating) return
    if (nextIndex < 0 || nextIndex >= layers.length) return
    if (nextIndex === activeIndex) return

    const direction: 1 | -1 = nextIndex > activeIndex ? 1 : -1

    setIsAnimating(true)
    setOutgoingIndex(activeIndex)
    setOutgoingPhase(0)
    setMotionDirection(direction)

    if (direction === -1) {
      setIncomingIndex(nextIndex)
      setIncomingPhase(0)
    } else {
      setIncomingIndex(null)
      setIncomingPhase(1)
    }

    setActiveIndex(nextIndex)

    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = window.requestAnimationFrame(() => {
      setOutgoingPhase(1)
      if (direction === -1) {
        setIncomingPhase(1)
      }
      rafRef.current = null
    })

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      setOutgoingIndex(null)
      setIncomingIndex(null)
      setIncomingPhase(1)
      setOutgoingPhase(1)
      setMotionDirection(1)
      timeoutRef.current = null
    }, transitionMs + 60)
  }, [isAnimating, activeIndex, layers.length, transitionMs, setIsAnimating, setOutgoingIndex, setOutgoingPhase, setMotionDirection, setIncomingIndex, setIncomingPhase, setActiveIndex])

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setActiveIndex((prev) => Math.max(0, Math.min(layers.length - 1, prev)))
  }, [layers.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'PageUp') {
        goToIndex(activeIndex - 1)
      } else if (event.key === 'PageDown') {
        goToIndex(activeIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, goToIndex])

  const isTransitioning = isAnimating
  const cameraZ = depthSpacingPx * activeIndex

  return (
    <div
      className={`layeredScene ${isTransitioning ? 'is-transitioning' : ''}${className ? ` ${className}` : ''}`}
      aria-label="3D layered scene"
      style={{
        ['--camera-z' as never]: `${cameraZ}px`,
        ['--transition-ms' as never]: `${transitionMs}ms`,
        ['--transition-easing' as never]: easing,
        ['--perspective' as never]: `${perspectivePx}px`,
        ...style,
      }}
    >
      {layers.map((node, index) => {
        const depth = Math.abs(index - activeIndex)
        const isOutgoing = outgoingIndex !== null && index === outgoingIndex
        const isIncoming = incomingIndex !== null && index === incomingIndex

        const layerZ = -depthSpacingPx * index
        const outgoingOffset = isOutgoing && motionDirection === 1 ? depthSpacingPx * 2 : 0
        const effectiveZ = layerZ + outgoingOffset + cameraZ
        const isBehindCamera = effectiveZ > 0

        const keepIncomingMountedWhileBehindCamera =
          isIncoming && isAnimating && motionDirection === -1

        if (isBehindCamera && !isOutgoing && !keepIncomingMountedWhileBehindCamera) {
          return null
        }

        const depthOpacity = lerpDepth(depth, 1, opacityAt1, opacityAt2)
        const baseOpacity = index === activeIndex ? 1 : depthOpacity

        const reverseOutgoingTargetOpacity = minVisibleOpacity
        const forwardOutgoingTargetOpacity = minVisibleOpacity

        const opacity = isOutgoing && isAnimating
          ? motionDirection === -1
            ? outgoingPhase === 0
              ? 1
              : reverseOutgoingTargetOpacity
            : outgoingPhase === 0
                ? 1
                : forwardOutgoingTargetOpacity
          : isIncoming && isAnimating && motionDirection === -1
            ? incomingPhase === 0
              ? 0
              : 1
            : baseOpacity

        const blurPx = lerpDepth(depth, 0, blurAt1Px, blurAt2Px)
        const incomingBlurPx = blurAt2Px
        const finalBlurPx =
          isIncoming && isAnimating && motionDirection === -1
            ? incomingPhase === 0
              ? incomingBlurPx
              : 0
            : blurPx

        const stack = 10000 - Math.round(depth * 10) + (isOutgoing ? 1000 : 0)

        const content = isValidElement(node) ? node : <>{node}</>
        const nodeKey = isValidElement(node) ? node.key : null
        const key = nodeKey ?? index

        return (
          <div
            key={key}
            className={`layeredLayer ${depth === 0 ? 'is-focused' : ''} ${index === activeIndex ? 'is-active' : ''} ${isOutgoing ? 'is-outgoing' : ''}`}
            style={{
              ['--z' as never]: `${layerZ}px`,
              ['--outgoing-offset' as never]: `${outgoingOffset}px`,
              ['--stack' as never]: stack,
              ['--layer-blur' as never]: `${finalBlurPx}px`,
              opacity: Math.max(minVisibleOpacity, opacity),
            }}
          >
            <div className="layeredLayerInner">
              {content}
              <div className="layeredControls">
                {index !== 0 ? (
                  <button
                    type="button"
                    className="layeredBtn"
                    onClick={() => goToIndex(activeIndex - 1)}
                    disabled={isAnimating || index !== activeIndex}
                  >
                    Previous
                  </button>
                ) : null}
                {index !== layers.length - 1 ? (
                  <button
                    type="button"
                    className="layeredBtn"
                    onClick={() => goToIndex(activeIndex + 1)}
                    disabled={isAnimating || index !== activeIndex}
                  >
                    Next
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export type LayerProps = {
  children: ReactNode
}

export function Layer({ children }: LayerProps) {
  return <>{children}</>
}
