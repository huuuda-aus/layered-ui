import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Layer = {
  id: string
  title: string
  subtitle: string
  body: string
  tone: 'navy' | 'brown' | 'maroon'
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const lerpDepth = (depth: number, at0: number, at1: number, at2: number) => {
  if (depth <= 0) return at0
  if (depth >= 2) return at2
  if (depth <= 1) return lerp(at0, at1, clamp01(depth))
  return lerp(at1, at2, clamp01(depth - 1))
}

function App() {
  const layers = useMemo<Layer[]>(
    () => [
      {
        id: 'layer-1',
        title: 'Layer 01',
        subtitle: 'Primary surface (in focus)',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sed arcu eu massa tincidunt feugiat. Curabitur euismod, nisl at convallis consequat, neque augue vehicula erat, eu pharetra massa velit in mauris.',
        tone: 'navy',
      },
      {
        id: 'layer-2',
        title: 'Layer 02',
        subtitle: 'Secondary surface (defocused)',
        body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
        tone: 'brown',
      },
      {
        id: 'layer-3',
        title: 'Layer 03',
        subtitle: 'Tertiary surface (deep background)',
        body: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.',
        tone: 'maroon',
      },
    ],
    [],
  )

  const TRANSITION_MS = 500
  const [activeIndex, setActiveIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const advance = () => {
    if (isAnimating) return

    const lastIndex = layers.length - 1

    const nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1
    setIsAnimating(true)
    setOutgoingIndex(activeIndex)
    setActiveIndex(nextIndex)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsAnimating(false)
      setOutgoingIndex(null)
      timeoutRef.current = null
    }, TRANSITION_MS + 50)
  }

  const isTransitioning = isAnimating
  const cameraZ = 200 * activeIndex

  return (
    <div className="app">
      <div
        className={`scene ${isTransitioning ? 'is-transitioning' : ''}`}
        aria-label="3D layered scene"
        style={{ ['--camera-z' as never]: `${cameraZ}px` }}
      >
        {layers.map((layer, index) => {
          const depth = Math.abs(index - activeIndex)
          const isOutgoing = outgoingIndex !== null && index === outgoingIndex

          const layerZ = -200 * index
          const outgoingOffset = isOutgoing ? 400 : 0
          const effectiveZ = layerZ + outgoingOffset + cameraZ
          const isBehindCamera = effectiveZ > 0

          if (isBehindCamera && !isOutgoing) {
            return null
          }

          const opacity = isOutgoing && isAnimating ? 0 : 1

          const blurPx = lerpDepth(depth, 0, 6, 10)
          const stack = 10000 - Math.round(depth * 10) + (isOutgoing ? 1000 : 0)

          return (
            <div
              key={layer.id}
              className={`layer tone-${layer.tone} ${depth === 0 ? 'is-focused' : ''} ${index === activeIndex ? 'is-active' : ''} ${isOutgoing ? 'is-outgoing' : ''}`}
              style={{
                ['--z' as never]: `${layerZ}px`,
                ['--outgoing-offset' as never]: `${outgoingOffset}px`,
                ['--stack' as never]: stack,
                ['--layer-blur' as never]: `${blurPx}px`,
                opacity,
              }}
            >
              <div className="layerInner">
                <div className="layerMeta">
                  <div className="caption">Prototype</div>
                  <div className="kicker">Perspective / Z-axis</div>
                </div>
                <h2 className="layerTitle">{layer.title}</h2>
                <h3 className="layerSubtitle">{layer.subtitle}</h3>
                <p className="layerBody">{layer.body}</p>
                <div className="layerActions">
                  <button
                    type="button"
                    className="advanceBtn"
                    onClick={advance}
                    disabled={isAnimating || index !== activeIndex}
                  >
                    {activeIndex === layers.length - 1 ? 'Back to first layer' : 'Next layer'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
