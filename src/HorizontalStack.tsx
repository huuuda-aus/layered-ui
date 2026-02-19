import './HorizontalStack.css'

import {
  Children,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

export type HorizontalStackRef = {
  goToPrev: () => void
  goToNext: () => void
  goToIndex: (index: number) => void
  getActiveIndex: () => number
}

export interface HorizontalStackProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  gap?: number
}

export interface SlideProps {
  children: ReactNode
}

export function Slide({ children }: SlideProps) {
  return <>{children}</>
}

const clampIndex = (index: number, max: number) => {
  if (max < 0) return 0
  return Math.max(0, Math.min(max, index))
}

export const HorizontalStack = forwardRef<HorizontalStackRef, HorizontalStackProps>(function HorizontalStack(
  { children, className, style, gap = 24 },
  ref
) {
  const slides = useMemo(() => Children.toArray(children), [children])
  const containerRef = useRef<HTMLDivElement>(null)
  const activeIndexRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const pointerStateRef = useRef<null | { startX: number; pointerId: number }>(null)

  const pxGap = Math.max(0, gap)

  const updateContainerWidth = useCallback(() => {
    if (!containerRef.current) return
    setContainerWidth(containerRef.current.clientWidth)
  }, [])

  useEffect(() => {
    updateContainerWidth()

    const node = containerRef.current
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && node ? new ResizeObserver(() => updateContainerWidth()) : null

    if (resizeObserver && node) {
      resizeObserver.observe(node)
    }

    const handleWindowResize = () => updateContainerWidth()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowResize)
    }

    return () => {
      resizeObserver?.disconnect()
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleWindowResize)
      }
    }
  }, [updateContainerWidth])

  const setClampedIndex = useCallback(
    (targetIndex: number) => {
      if (slides.length === 0) {
        activeIndexRef.current = 0
        setActiveIndex(0)
        return
      }

      const clamped = clampIndex(targetIndex, slides.length - 1)
      activeIndexRef.current = clamped
      setActiveIndex(clamped)
    },
    [slides.length]
  )

  useEffect(() => {
    setClampedIndex(activeIndexRef.current)
  }, [slides.length, setClampedIndex])

  useImperativeHandle(
    ref,
    () => ({
      goToPrev: () => setClampedIndex(activeIndexRef.current - 1),
      goToNext: () => setClampedIndex(activeIndexRef.current + 1),
      goToIndex: (index: number) => setClampedIndex(index),
      getActiveIndex: () => activeIndexRef.current,
    }),
    [setClampedIndex]
  )

  const maxSlideIndex = Math.max(0, slides.length - 1)
  const isAtStart = activeIndex <= 0
  const isAtEnd = activeIndex >= maxSlideIndex

  return (
    <div
      className={`horizontalStackRoot${className ? ` ${className}` : ''}`}
      style={{
        ['--horizontal-stack-gap' as never]: `${pxGap}px`,
        ...style,
      }}
    >
      <div className="horizontalStackIndicators">
        <div className="horizontalStackIndicatorWrapper">
          <button
            type="button"
            className={`horizontalStackChevron left${isAtStart ? ' is-disabled' : ''}`}
            aria-label="Previous slide"
            onClick={() => setClampedIndex(activeIndexRef.current - 1)}
            disabled={isAtStart}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <div className="horizontalStackDots" role="tablist" aria-label="Slide navigation">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`horizontalStackDot${index === activeIndex ? ' is-active' : ''}`}
                aria-selected={index === activeIndex}
                role="tab"
              />
            ))}
          </div>
          <button
            type="button"
            className={`horizontalStackChevron right${isAtEnd ? ' is-disabled' : ''}`}
            aria-label="Next slide"
            onClick={() => setClampedIndex(activeIndexRef.current + 1)}
            disabled={isAtEnd}
          >
            <span aria-hidden="true">›</span>
          </button>
        </div>
      </div>
      <div
        className="horizontalStackViewport"
        ref={containerRef}
        onPointerDown={(event) => {
          pointerStateRef.current = { startX: event.clientX, pointerId: event.pointerId }
          containerRef.current?.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const pointer = pointerStateRef.current
          if (!pointer || pointer.pointerId !== event.pointerId) return
          event.preventDefault()
        }}
        onPointerUp={(event) => {
          const pointer = pointerStateRef.current
          if (!pointer || pointer.pointerId !== event.pointerId) return
          pointerStateRef.current = null
          containerRef.current?.releasePointerCapture(event.pointerId)
          const delta = event.clientX - pointer.startX
          if (Math.abs(delta) < 40) return
          if (delta > 0) {
            setClampedIndex(activeIndexRef.current - 1)
          } else {
            setClampedIndex(activeIndexRef.current + 1)
          }
        }}
        onPointerCancel={(event) => {
          const pointer = pointerStateRef.current
          if (pointer?.pointerId === event.pointerId) {
            pointerStateRef.current = null
            containerRef.current?.releasePointerCapture(event.pointerId)
          }
        }}
      >
        <div
          className="horizontalStackTrack"
          role="region"
          aria-roledescription="carousel"
          aria-label="Horizontal stack"
          style={{
            transform: `translateX(${-(containerWidth + pxGap) * activeIndex}px)`,
            ['--horizontal-stack-span' as never]: `${containerWidth}px`,
          }}
        >
          {slides.map((slide, index) => {
            const key = isValidElement(slide) && slide.key ? slide.key : index
            return (
              <div
                key={key}
                className={`horizontalStackSlide${index === activeIndex ? ' is-active' : ''}`}
                aria-hidden={index === activeIndex ? undefined : true}
              >
                <div className="horizontalStackSlideInner">{slide}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})
HorizontalStack.displayName = 'HorizontalStack'
