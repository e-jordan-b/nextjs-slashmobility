'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RangeProps } from './RangeProps';

export default function Range({min, max}: RangeProps) {
  const [minRange, setMinRange] = useState(min);
  const [maxRange, setMaxRange] = useState(max);
  return (
    <div className='range-container'>

    </div>
  )
}
