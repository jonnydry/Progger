import React, { useState, useRef, useEffect, useMemo } from 'react';

interface WheelPickerProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const WheelPicker: React.FC<WheelPickerProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTimeRef = useRef(0);
  const optionHeight = 40; // Height of each option in pixels
  const visibleOptions = 5; // Number of visible options (odd number for center selection)

  // Adaptive throttling based on device capabilities
  const wheelThrottleMs = useMemo(() => {
    // Check for low-end devices (limited memory)
    const isLowEndDevice = typeof navigator !== 'undefined' &&
      'deviceMemory' in navigator &&
      (navigator.deviceMemory as number) < 4;

    // Check for high refresh rate displays
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return 150; // Respect accessibility preference
    if (isLowEndDevice) return 150; // More aggressive throttling for low-end devices
    return 50; // Responsive for modern devices (20fps)
  }, []);

  const currentIndex = useMemo(() => {
    const index = options.indexOf(value);
    return index >= 0 ? index : 0;
  }, [options, value]);

  useEffect(() => {
    if (containerRef.current) {
      const scrollPosition = currentIndex * optionHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [currentIndex, optionHeight]);

  // Prevent page scrolling when hovering over wheel picker
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (isHovering && containerRef.current) {
      // Add non-passive wheel listener to aggressively prevent scrolling
      containerRef.current.addEventListener('wheel', preventDefault, { passive: false });
      
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('wheel', preventDefault);
        }
      };
    }
  }, [isHovering]);


  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const deltaY = e.clientY - startY;
    const newScrollTop = scrollTop - deltaY;
    containerRef.current.scrollTop = newScrollTop;
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToNearest();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const deltaY = e.touches[0].clientY - startY;
    const newScrollTop = scrollTop - deltaY;
    containerRef.current.scrollTop = newScrollTop;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    snapToNearest();
  };

  const snapToNearest = () => {
    if (!containerRef.current) return;
    
    const scrollPosition = containerRef.current.scrollTop;
    const nearestIndex = Math.round(scrollPosition / optionHeight);
    const clampedIndex = Math.max(0, Math.min(nearestIndex, options.length - 1));
    
    containerRef.current.scrollTo({
      top: clampedIndex * optionHeight,
      behavior: 'smooth',
    });
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent event from bubbling to page scroll
    
    // Throttle wheel events - only process once per wheelThrottleMs
    const now = Date.now();
    if (now - lastWheelTimeRef.current < wheelThrottleMs) {
      return; // Ignore this event, too soon after last one
    }
    lastWheelTimeRef.current = now;
    
    // Determine direction and move by 1 item
    const direction = e.deltaY > 0 ? 1 : -1;
    const currentIndex = options.indexOf(value);
    const newIndex = Math.max(0, Math.min(currentIndex + direction, options.length - 1));
    
    if (newIndex !== currentIndex) {
      onChange(options[newIndex]);
    }
  };

  const handleClick = (index: number) => {
    onChange(options[index]);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * optionHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIdx = options.indexOf(value);

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIdx > 0) {
          onChange(options[currentIdx - 1]);
        }
        break;
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        if (currentIdx < options.length - 1) {
          onChange(options[currentIdx + 1]);
        }
        break;
      case 'Home':
        e.preventDefault();
        onChange(options[0]);
        break;
      case 'End':
        e.preventDefault();
        onChange(options[options.length - 1]);
        break;
    }
  };

  const centerOffset = (visibleOptions - 1) / 2 * optionHeight;

  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2 text-sm font-semibold text-text/70">
          {label}
        </label>
      )}
      <div className="relative" style={{ touchAction: 'none', overscrollBehavior: 'contain' }}>
        {/* Selection indicator */}
        <div
          className="absolute left-0 right-0 pointer-events-none z-10 bg-primary/20 border-y-2 border-primary/50 rounded-md"
          style={{
            top: centerOffset,
            height: optionHeight,
          }}
        />
        
        {/* Scrollable container */}
        <div
          ref={containerRef}
          role="listbox"
          aria-label={label || "Select option"}
          aria-activedescendant={`${label}-option-${currentIndex}`}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="relative overflow-hidden bg-background border-2 border-border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          style={{
            height: visibleOptions * optionHeight,
            touchAction: 'none',
            overscrollBehavior: 'contain',
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            handleMouseUp();
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Padding top to center first option */}
          <div style={{ height: centerOffset }} />
          
          {/* Options list */}
          <div className="relative">
            {options.map((option, index) => {
              const isSelected = option === value;
              const distanceFromCenter = Math.abs(index - currentIndex);
              const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.2);
              const scale = Math.max(0.9, 1 - distanceFromCenter * 0.05);
              
              return (
                <div
                  key={option}
                  id={`${label}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`flex items-center justify-center cursor-pointer transition-all duration-150 ${
                    isSelected ? 'font-semibold text-primary' : 'text-text/80'
                  }`}
                  style={{
                    height: optionHeight,
                    opacity,
                    transform: `scale(${scale})`,
                  }}
                  onClick={() => handleClick(index)}
                >
                  {option}
                </div>
              );
            })}
          </div>
          
          {/* Padding bottom to center last option */}
          <div style={{ height: centerOffset }} />
        </div>
      </div>
    </div>
  );
};

