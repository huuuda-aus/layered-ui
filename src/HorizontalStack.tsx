import {
  Children,
  type CSSProperties,
  forwardRef,
  type ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

export type HorizontalStackRef = {
  goTo: (index: number) => void,
  goToPrev: () => void,
  goToNext: () => void,
  goToPrevSlide: () => void,
  goToNextSlide: () => void,
  goToFirstSlide: () => void,
  slideCount: number,
}

export type HorizontalStackProps = {
  children: ReactNode,
  className?: string,
  style?: CSSProperties,
  gap?: number,
  transitionMs?: number,
  easing?: string,
  initialIndex?: number,
  onSlideChange?: (index: number) => void,
}

export const HorizontalStack = forwardRef<HorizontalStackRef, HorizontalStackProps>(({
  children,
  className,
  style,
  gap = 16,
  transitionMs = 320,
  easing = 'cubic-bezier(0.23, 1, 0.32, 1)',
  initialIndex = 0,
  onSlideChange,
}, ref) => {
  const slides = useMemo(() => Children.toArray(children), [children])

  const clampIndex = useCallback((index: number) => {
    if (slides.length === 0) return 0
    return Math.max(0, Math.min(slides.length - 1, index))
  }, [slides.length])

  const [activeIndex, setActiveIndex] = useState(() => clampIndex(initialIndex))
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    setActiveIndex((prev) => clampIndex(prev))
  }, [clampIndex])

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(containerRef.current?.clientWidth ?? 0)
    }

    handleResize()

    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(handleResize)
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    onSlideChange?.(activeIndex)
  }, [activeIndex, onSlideChange])

  const goTo = useCallback((index: number) => {
    setActiveIndex((prev) => {
      const next = clampIndex(index)
      return next === prev ? prev : next
    })
  }, [clampIndex])

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = clampIndex(prev + 1)
      return next === prev ? prev : next
    })
  }, [clampIndex])

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const next = clampIndex(prev - 1)
      return next === prev ? prev : next
    })
  }, [clampIndex])

  const goToFirstSlide = useCallback(() => {
    goTo(0)
  }, [goTo])

  useImperativeHandle(ref, () => ({
    goTo,
    goToPrev,
    goToNext,
    goToPrevSlide: goToPrev,
    goToNextSlide: goToNext,
    goToFirstSlide,
    slideCount: slides.length,
  }), [goTo, goToPrev, goToNext, goToFirstSlide, slides.length])

  const trackOffset = containerWidth + gap
  const translateAmount = trackOffset * activeIndex

  const trackStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: `${gap}px`,
    transition: `transform ${transitionMs}ms ${easing}`,
    transform: `translate3d(-${translateAmount}px, 0, 0)`,
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  }

  return (
    <div
      ref={containerRef}
      className={`horizontalStack ${className ?? ''}`.trim()}
      style={{
        '--horizontal-stack-gap': `${gap}px`,
        '--horizontal-stack-transition-ms': `${transitionMs}ms`,
        '--horizontal-stack-transition-easing': easing,
        ...style,
      } as CSSProperties}
    >
      <div className="horizontalStackTrack" style={trackStyle}>
        {slides.map((slide, index) => {
          const slideKey = isValidElement(slide) ? slide.key ?? index : index
          const position = index === activeIndex - 1
            ? 'prev'
            : index === activeIndex + 1
              ? 'next'
              : index === activeIndex
                ? 'active'
                : ''
          return (
            <div key={slideKey} className="horizontalStackSlide" data-slide-position={position}>
              {slide}
            </div>
          )
        })}
      </div>
    </div>
  )
})
