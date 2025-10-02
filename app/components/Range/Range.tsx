"use client";
import React, { useState, useRef, useCallback } from "react";
import { RangeProps } from "./RangeProps";
import "./Range.css";

export default function Range({ min, max, steps }: Readonly<RangeProps>) {
  const isStepped = steps && steps.length > 0;

  const [minRange, setMinRange] = useState(min);
  const [maxRange, setMaxRange] = useState(max);
  const [minInputValue, setMinInputValue] = useState<string>(String(min));
  const [maxInputValue, setMaxInputValue] = useState<string>(String(max));
  const [editingTarget, setEditingTarget] = useState<"min" | "max" | null>(
    null
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const activeHandleRef = useRef<"min" | "max" | null>(null);

  const getClientX = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
      return event.touches[0].clientX;
    }
    return event.clientX;
  };

  const calcPercentage = useCallback(
    (value: number) => {
      if (min === max) return 0;
      return ((value - min) / (max - min)) * 100;
    },
    [min, max]
  );

  const findClosestValue = useCallback((value: number, steps: number[]) => {
    return steps.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }, []);

  const getNewValue = useCallback(
    (value: number) => {
      if (isStepped) {
        return findClosestValue(value, steps);
      }

      return Math.round(value * 100) / 100;
    },
    [min, max, isStepped, steps, findClosestValue]
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!trackRef.current || !activeHandleRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const trackLeft = trackRect.left;
      const trackWidth = trackRect.width;

      const mousePosX = getClientX(event);
      const relativeX = Math.max(
        0,
        Math.min(mousePosX - trackLeft, trackWidth)
      );
      const percentage = relativeX / trackWidth;
      const newValue = getNewValue(min + percentage * (max - min));

      if (activeHandleRef.current === "min") {
        const dragValue = Math.min(newValue, maxRange);
        setMinRange(dragValue);
        setMinInputValue(String(dragValue));
      } else {
        const dragValue = Math.max(newValue, minRange);
        setMaxRange(dragValue);
        setMaxInputValue(String(dragValue));
      }
    },
    [min, max, minRange, maxRange]
  );

  const handleMouseUp = useCallback(() => {
    activeHandleRef.current = null;

    document.body.classList.remove("is-dragging");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("touchend", handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent | React.TouchEvent, handleType: "min" | "max") => {
      event.preventDefault();

      activeHandleRef.current = handleType;
      document.body.classList.add("is-dragging");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  const handleLabelClick = (target: "min" | "max") => {
    setEditingTarget(target);
  };

  const handleCommit = () => {
    const inputValue = editingTarget === "min" ? minInputValue : maxInputValue;
    const numericValue = Number(inputValue);

    if (isNaN(numericValue)) {
      setEditingTarget(null);
      return;
    }

    if (editingTarget === "min") {
      const validatedValue = Math.min(Math.max(numericValue, min), maxRange);
      setMinRange(validatedValue);
    } else if (editingTarget === "max") {
      const validatedValue = Math.max(Math.min(numericValue, max), minRange);
      setMaxRange(validatedValue);
    }

    setEditingTarget(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommit();
    } else if (e.key === "Escape") {
      setEditingTarget(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = Number(value);

    if (value === "") {
      if (editingTarget === "min") {
        setMinInputValue("");
      } else {
        setMaxInputValue("");
      }
    }

    if (numericValue >= min && numericValue <= max) {
      if (editingTarget === "min") {
        setMinInputValue(String(numericValue));
      } else {
        setMaxInputValue(String(numericValue));
      }
    }
  };

  return (
    <div className="range-container">
      {!isStepped && editingTarget === "min" ? (
        <input
          type="number"
          value={minInputValue}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={handleKeyDown}
          onBlur={handleCommit}
          autoFocus
          className="range-minInput"
        />
      ) : (
        <span
          className="range-minLabel"
          onClick={() => handleLabelClick("min")}
        >
          {minRange}
        </span>
      )}
      <div className="full-range" ref={trackRef}>
        <div
          className="range-track"
          style={{
            left: `${calcPercentage(minRange)}%`,
            right: `${100 - calcPercentage(maxRange)}%`,
          }}
        ></div>
        <div
          className="range-minHandle"
          style={{ left: `${calcPercentage(minRange)}%` }}
          onMouseDown={(e) => handleMouseDown(e, "min")}
          onTouchStart={(e) => handleMouseDown(e, "min")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={minRange}
          aria-label="Minimum value"
        ></div>
        <div
          className="range-maxHandle"
          style={{ left: `${calcPercentage(maxRange)}%` }}
          onMouseDown={(e) => handleMouseDown(e, "max")}
          onTouchStart={(e) => handleMouseDown(e, "max")}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={maxRange}
          aria-label="Maximum value"
        ></div>
      </div>
      {!isStepped && editingTarget === "max" ? (
        <input
          type="number"
          value={maxInputValue}
          onChange={(e) => handleInputChange(e)}
          onKeyDown={handleKeyDown}
          onBlur={handleCommit}
          autoFocus
          className="range-maxInput"
        />
      ) : (
        <span
          className="range-maxLabel"
          onClick={() => handleLabelClick("max")}
        >
          {maxRange}
        </span>
      )}
    </div>
  );
}
