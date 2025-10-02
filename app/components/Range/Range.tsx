'use client'
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { RangeProps } from './RangeProps';
import './Range.css';

export default function Range({min, max}: Readonly<RangeProps>) {
  const [minRange, setMinRange] = useState(min)
  const [maxRange, setMaxRange] = useState(max)
  const [minInputValue, setMinInputValue] = useState(min)
  const [maxInputValue, setMaxInputValue] = useState(max)
  const [editingTarget, setEditingTarget] = useState<'min' | 'max' | null>(null)

  const trackRef = useRef<HTMLDivElement>(null); 
  const activeHandleRef = useRef<'min' | 'max' | null>(null)

  const getClientX = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
      return event.touches[0].clientX;
    }
    return event.clientX
  }

  const roundToPrecision = (num: number, precision: number = 2): number => {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  };


  const calcPercentage = useCallback((value: number) => {
    if(min === max) return 0
    return ((value - min) / (max - min)) * 100
  }, [min, max])

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if(!trackRef.current || !activeHandleRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const trackLeft = trackRect.left
    const trackWidth = trackRect.width

    const mousePosX = getClientX(event)
    const relativeX = Math.max(0, Math.min(mousePosX - trackLeft, trackWidth))
    const percentage = (relativeX / trackWidth)
    const newValue = roundToPrecision(min + percentage * (max - min))

    if (activeHandleRef.current === 'min') {
    const dragValue = Math.min(newValue, maxRange)
    setMinRange(dragValue)
    setMinInputValue(dragValue)
  } else {
    const dragValue = Math.max(newValue, minRange)
    setMaxRange(dragValue)
    setMaxInputValue(dragValue)
  }
    }, [min, max, minRange, maxRange])

  const handleMouseUp = useCallback(() => {
    activeHandleRef.current = null

    document.body.classList.remove('is-dragging')
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('touchmove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('touchend', handleMouseUp)
  }, [handleMouseMove])

  const handleMouseDown = useCallback((event: React.MouseEvent | React.TouchEvent, handleType: 'min' | 'max') => {
    event.preventDefault();

    activeHandleRef.current = handleType;
    document.body.classList.add('is-dragging')
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchend', handleMouseUp)
  }, [handleMouseMove, handleMouseUp])

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
    };
  }, []);

  const handleLabelClick = (target: 'min' | 'max') => {
    setEditingTarget(target)
  }

  const handleCommit = () => {
    const inputValue = editingTarget === 'min' ? minInputValue : maxInputValue
    const numericValue = Number(inputValue)

    if(isNaN(numericValue)) {
      setEditingTarget(null)
      return
    }

    if (editingTarget === 'min') {
      const validatedValue = Math.min(Math.max(numericValue, min), maxRange)
      setMinRange(validatedValue)
    } else if (editingTarget === 'max') {
      const validatedValue = Math.max(Math.min(numericValue, max), minRange)
      setMaxRange(validatedValue)
    }

    setEditingTarget(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommit()
    } else if (e.key === 'Escape') {
      setEditingTarget(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const numericValue = Number(value)

     if (value === '') {
      if (editingTarget === 'min') {
        setMinInputValue('');
        return;
      } else {
        setMaxInputValue('');
        return;
      }
    }

    if (numericValue >= min && numericValue <= max) {
      if (editingTarget === 'min') {
        setMinInputValue(numericValue);
      } else {
        setMaxInputValue(numericValue);
      }
    }

  }

  return (
    <div className='range-container'>
      { editingTarget === 'min' ? (
      <input
        type='number'
        value={minInputValue}
        onChange={(e) => handleInputChange(e)}
        onKeyDown={handleKeyDown}
        onBlur={handleCommit}
        autoFocus
        className='range-minInput'
      />) : (
      <span 
        className='range-minLabel'
        onClick={() => handleLabelClick('min')}>
        {minRange} €
      </span>)}
      <div className='full-range' ref={trackRef}>
        <div
          className='range-track' 
          style={{ left: `${calcPercentage(minRange)}%`, right: `${100 - calcPercentage(maxRange)}%` }}>
        </div>
        <div 
          className='range-minHandle' 
          style={{ left: `${calcPercentage(minRange)}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'min')}
          onTouchStart={(e) => handleMouseDown(e, 'min')}
          role="slider"
          >
        </div>
        <div
          className='range-maxHandle'
          style={{ left: `${calcPercentage(maxRange)}%` }}
          onMouseDown={(e) => handleMouseDown(e, 'max')}
          onTouchStart={(e) => handleMouseDown(e, 'max')}
          role="slider"
        >
        </div>
      </div>
      { editingTarget === 'max' ? (
      <input
        type='number'
        value={maxInputValue}
        onChange={(e) => handleInputChange(e)}
        onKeyDown={handleKeyDown}
        onBlur={handleCommit}
        autoFocus
        className='range-maxInput'
      />) : (
      <span className='range-maxLabel'
        onClick={() => handleLabelClick('max')}>
        {maxRange} €
      </span>)}
    </div>
  )
}
