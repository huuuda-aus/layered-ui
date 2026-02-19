import './LayeredScene.css'

import {
  Children,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

export type LayeredSceneProps = {
  children: ReactNode,
  className?: string,
  style?: CSSProperties,
  transitionMs?: number,
  easing?: string,
  depthSpacingPx?: number,
  perspectivePx?: number,
  blurAt1Px?: number,
  blurAt2Px?: number,
  opacityAt1?: number,
  opacityAt2?: number,
  minVisibleOpacity?: number,
  initialIndex?: number,
  disableNavigationButtons?: boolean,
  modalOpen?: boolean,
  onModalClose?: () => void,
}

export type LayeredSceneRef = {
  goToPrev: () => void,
  goToNext: () => void,
  goToFirst: () => void
}

export const LayeredScene = forwardRef<LayeredSceneRef, LayeredSceneProps>(({
  children,
  className,
  style,
  transitionMs = 250,
  easing = 'linear',
  depthSpacingPx = 200,
  perspectivePx = 3000,
  blurAt1Px = 6,
  blurAt2Px = 10,
  opacityAt1 = 0.7,
  opacityAt2 = 0.45,
  minVisibleOpacity = 0.2,
  initialIndex = 0,
  disableNavigationButtons = false,
  modalOpen = false,
  onModalClose,
}, ref) => {
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
  const [modalPhase, setModalPhase] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const [modalAnimating, setModalAnimating] = useState(false)
  const [blurPx, setBlurPx] = useState<string>('0px')

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

  useLayoutEffect(() => {
    if (modalOpen && modalPhase === 'closed') {
      setModalPhase('opening');
      setBlurPx('8px');
      setModalAnimating(true);
      setTimeout(() => {
        setModalPhase('open');
      }, 300);
    } else if (!modalOpen && modalPhase !== 'closed') {
      setModalPhase('closing');
      setBlurPx('0px');
      setModalAnimating(true);
      setTimeout(() => {
        setModalPhase('closed');
        setModalAnimating(false);
      }, 300);
    }
  }, [modalOpen, modalPhase]);

  useEffect(() => {
    if (!modalOpen || !onModalClose) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onModalClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalOpen, onModalClose])

  useImperativeHandle(ref, () => ({
    goToPrev: () => goToIndex(activeIndex - 1),
    goToNext: () => goToIndex(activeIndex + 1),
    goToFirst: () => goToIndex(0),
  }), [activeIndex, goToIndex])

  const isTransitioning = isAnimating
  const modalDepth = modalPhase === 'opening' || modalPhase === 'open' ? -depthSpacingPx : 0
  const cameraZ = depthSpacingPx * activeIndex + modalDepth

  return (
    <div
      className={`layeredScene ${isTransitioning ? 'is-transitioning' : ''}${modalAnimating ? ' is-modal-animating' : ''}${modalPhase !== 'closed' ? ' modal-blur' : ''}${className ? ` ${className}` : ''}`}
      aria-label="3D layered scene"
      style={{
        '--camera-z': `${cameraZ}px`,
        '--blur-px': blurPx,
        '--transition-ms': `${transitionMs}ms`,
        '--transition-easing': easing,
        '--perspective': `${perspectivePx}px`,
        ...style,
      } as React.CSSProperties}
    >
      {layers.map((node, index) => {
        const depth = Math.abs(index - activeIndex)
        const isOutgoing = outgoingIndex !== null && index === outgoingIndex
        const isIncoming = incomingIndex !== null && index === incomingIndex

        const layerZ = -depthSpacingPx * index
        const outgoingOffset = isOutgoing && motionDirection === 1 ? depthSpacingPx * 2 : 0
        const incomingEntranceOffset = isIncoming && motionDirection === -1 && incomingPhase === 0 ? depthSpacingPx * 2 : 0
        const effectiveZ = layerZ + outgoingOffset + cameraZ + incomingEntranceOffset
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
        const modalBlurPx = modalPhase !== 'closed' ? 2 : 0
        const finalBlurPx =
          (isIncoming && isAnimating && motionDirection === -1
            ? incomingPhase === 0
              ? incomingBlurPx
              : 0
            : blurPx) + modalBlurPx

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
              ['--incoming-offset' as never]: `${incomingEntranceOffset}px`,
              ['--stack' as never]: stack,
              ['--layer-blur' as never]: `${finalBlurPx}px`,
              opacity: Math.max(minVisibleOpacity, opacity),
            }}
          >
            <div className="layeredLayerInner">
              {content}
              <div className="layeredControls">
                {!disableNavigationButtons && index !== 0 ? (
                  <button
                    type="button"
                    className="layeredBtn"
                    onClick={() => goToIndex(activeIndex - 1)}
                    disabled={isAnimating || index !== activeIndex}
                  >
                    Previous
                  </button>
                ) : null}
                {!disableNavigationButtons && index !== layers.length - 1 ? (
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
      {modalPhase !== 'closed' && (
        <div className="layeredOverlay" onClick={onModalClose} />
      )}
      {(modalPhase === 'opening' || modalPhase === 'open' || modalPhase === 'closing') && (
        <div className="layeredModalContent" style={
          modalPhase === 'opening' ? { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' } :
          modalPhase === 'closing' ? { opacity: 0, transform: 'translate(-50%, -50%) scale(0.5)' } : 
          {}
        }>
          <button className="modalCloseBtn" onClick={onModalClose}>&times;</button>
          <div className="layerHeader">
            <div>
              <h2 className="layerTitle">Test Popup</h2>
              <p className="layerSubtitle">Interactive modal with layered UI elements</p>
            </div>
          </div>

          <div className="modalBodyScroll">
            <div className="layerGrid">
              <div className="layerCard">
                <div className="layerCardLabel">Modal Views</div>
                <div className="layerCardValue">3 / 5</div>
                <div className="layerCardHint">Active panels</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Transition Time</div>
                <div className="layerCardValue">300ms</div>
                <div className="layerCardHint">Linear easing</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Blur Level</div>
                <div className="layerCardValue">4px</div>
                <div className="layerCardHint">Overlay filter</div>
              </div>
              <div className="layerCard">
                <div className="layerCardLabel">Camera Depth</div>
                <div className="layerCardValue">-200px</div>
                <div className="layerCardHint">Z-axis shift</div>
              </div>
            </div>

            <div className="layerRow">
              <div className="layerPanelBlock">
                <div className="layerSectionTitle">Animation Timeline</div>
                <svg className="layerChart" viewBox="0 0 360 120" role="img" aria-label="Animation timeline chart">
                  <rect x="0" y="0" width="360" height="120" rx="10" />
                  <path
                    d="M12 100 L52 80 L92 60 L132 40 L172 20 L212 15 L252 25 L292 45 L332 50"
                    className="layerChartLine"
                  />
                  <g className="layerChartDots">
                    <circle cx="12" cy="100" r="3" />
                    <circle cx="52" cy="80" r="3" />
                    <circle cx="92" cy="60" r="3" />
                    <circle cx="132" cy="40" r="3" />
                    <circle cx="172" cy="20" r="3" />
                    <circle cx="212" cy="15" r="3" />
                    <circle cx="252" cy="25" r="3" />
                    <circle cx="292" cy="45" r="3" />
                    <circle cx="332" cy="50" r="3" />
                  </g>
                  <g className="layerChartGrid">
                    <line x1="12" y1="30" x2="348" y2="30" />
                    <line x1="12" y1="60" x2="348" y2="60" />
                    <line x1="12" y1="90" x2="348" y2="90" />
                  </g>
                </svg>
                <div className="layerTinyNote">Smooth transitions with linear interpolation</div>
              </div>

              <div className="layerPanelBlock">
                <div className="layerSectionTitle">Modal Features</div>
                <svg className="layerImage" viewBox="0 0 160 160" role="img" aria-label="Modal features diagram">
                  <circle cx="80" cy="80" r="50" fill="rgba(200,205,215,0.1)" stroke="#9aa1b1" strokeOpacity="0.4" />
                  <circle cx="80" cy="50" r="8" fill="#00b894" />
                  <circle cx="110" cy="80" r="8" fill="#0984e3" />
                  <circle cx="80" cy="110" r="8" fill="#e17055" />
                  <circle cx="50" cy="80" r="8" fill="#fdcb6e" />
                  <text x="80" y="55" textAnchor="middle" fontSize="10" fill="#c7ccd8">Blur</text>
                  <text x="115" y="85" textAnchor="middle" fontSize="10" fill="#c7ccd8">Depth</text>
                  <text x="80" y="115" textAnchor="middle" fontSize="10" fill="#c7ccd8">Anim</text>
                  <text x="45" y="85" textAnchor="middle" fontSize="10" fill="#c7ccd8">Scale</text>
                </svg>
                <ul className="layerList">
                  <li>Background blur effect</li>
                  <li>Perspective depth shift</li>
                  <li>Smooth animations</li>
                  <li>Responsive scaling</li>
                </ul>
              </div>
            </div>

            <div className="layerPanelBlock">
              <div className="layerSectionTitle">Interaction Log</div>
              <div className="layerTable">
                <div className="layerTableRow layerTableHead">
                  <div>Event</div>
                  <div>Timestamp</div>
                  <div>Duration</div>
                  <div>Status</div>
                </div>
                <div className="layerTableRow">
                  <div>Open Modal</div>
                  <div>14:22:15</div>
                  <div>300ms</div>
                  <div>Success</div>
                </div>
                <div className="layerTableRow">
                  <div>Blur Apply</div>
                  <div>14:22:15</div>
                  <div>300ms</div>
                  <div>Success</div>
                </div>
                <div className="layerTableRow">
                  <div>Depth Shift</div>
                  <div>14:22:15</div>
                  <div>300ms</div>
                  <div>Success</div>
                </div>
              </div>
            </div>

            <div className="layerFootnote">
              Modal system active · Westworld-inspired UI · Layered perspective effects
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export interface LayerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Layer = forwardRef<HTMLDivElement, LayerProps>(function Layer({ children, ...rest }, ref) {
  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  )
})
