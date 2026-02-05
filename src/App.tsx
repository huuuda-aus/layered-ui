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
      {
        id: 'layer-4',
        title: 'Layer 04',
        subtitle: 'Quaternary surface',
        body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        tone: 'navy',
      },
      {
        id: 'layer-5',
        title: 'Layer 05',
        subtitle: 'Quinary surface',
        body: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        tone: 'brown',
      },
      {
        id: 'layer-6',
        title: 'Layer 06',
        subtitle: 'Senary surface',
        body: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
        tone: 'maroon',
      },
      {
        id: 'layer-7',
        title: 'Layer 07',
        subtitle: 'Septenary surface',
        body: 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
        tone: 'navy',
      },
      {
        id: 'layer-8',
        title: 'Layer 08',
        subtitle: 'Octonary surface',
        body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
        tone: 'brown',
      },
      {
        id: 'layer-9',
        title: 'Layer 09',
        subtitle: 'Nonary surface',
        body: 'Sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
        tone: 'maroon',
      },
      {
        id: 'layer-10',
        title: 'Layer 10',
        subtitle: 'Denary surface',
        body: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui.',
        tone: 'navy',
      },
    ],
    [],
  )

  const TRANSITION_MS = 500
  const [activeIndex, setActiveIndex] = useState(0)
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null)
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null)
  const [incomingPhase, setIncomingPhase] = useState<0 | 1>(1)
  const [outgoingPhase, setOutgoingPhase] = useState<0 | 1>(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [motionDirection, setMotionDirection] = useState<1 | -1>(1)
  const timeoutRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

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

  const goToIndex = (nextIndex: number) => {
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
    }, TRANSITION_MS + 120)
  }

  const goNext = () => goToIndex(activeIndex + 1)
  const goPrev = () => goToIndex(activeIndex - 1)

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
          const LAYER_2_INDEX = 1
          const MIN_VISIBLE_OPACITY = 0.2

          const depth = Math.abs(index - activeIndex)
          const isOutgoing = outgoingIndex !== null && index === outgoingIndex
          const isIncoming = incomingIndex !== null && index === incomingIndex

          const layerZ = -200 * index
          const outgoingOffset = isOutgoing && motionDirection === 1 ? 400 : 0
          const effectiveZ = layerZ + outgoingOffset + cameraZ
          const isBehindCamera = effectiveZ > 0

          const keepIncomingMountedWhileBehindCamera =
            isIncoming && isAnimating && motionDirection === -1

          const neverCull = index === LAYER_2_INDEX

          if (isBehindCamera && !neverCull && !isOutgoing && !keepIncomingMountedWhileBehindCamera) {
            return null
          }

          const depthOpacity = lerpDepth(depth, 1, 0.7, 0.45)
          const baseOpacity = index === activeIndex ? 1 : depthOpacity
          const reverseOutgoingTargetOpacity = MIN_VISIBLE_OPACITY
          const forwardOutgoingTargetOpacity = MIN_VISIBLE_OPACITY

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

          const clampedOpacity = index === LAYER_2_INDEX
            ? Math.max(MIN_VISIBLE_OPACITY, opacity)
            : opacity

          const blurPx = lerpDepth(depth, 0, 6, 10)
          const incomingBlurPx = 10
          const finalBlurPx =
            isIncoming && isAnimating && motionDirection === -1
              ? incomingPhase === 0
                ? incomingBlurPx
                : 0
              : blurPx
          const stack = 10000 - Math.round(depth * 10) + (isOutgoing ? 1000 : 0)

          return (
            <div
              key={layer.id}
              className={`layer tone-${layer.tone} ${depth === 0 ? 'is-focused' : ''} ${index === activeIndex ? 'is-active' : ''} ${isOutgoing ? 'is-outgoing' : ''}`}
              style={{
                ['--z' as never]: `${layerZ}px`,
                ['--outgoing-offset' as never]: `${outgoingOffset}px`,
                ['--stack' as never]: stack,
                ['--layer-blur' as never]: `${finalBlurPx}px`,
                opacity: clampedOpacity,
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
                  {index !== 0 ? (
                    <button
                      type="button"
                      className="advanceBtn"
                      onClick={goPrev}
                      disabled={isAnimating || index !== activeIndex}
                    >
                      Previous layer
                    </button>
                  ) : null}
                  {index !== layers.length - 1 ? (
                    <button
                      type="button"
                      className="advanceBtn"
                      onClick={goNext}
                      disabled={isAnimating || index !== activeIndex}
                    >
                      Next layer
                    </button>
                  ) : null}
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
