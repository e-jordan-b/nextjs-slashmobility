import React from 'react'
import Range from '../components/Range/Range';
import { fetchData } from '../services/fetchData';


export default async function Exercise2() {
  const rangeArray = await fetchData<number[]>('/range-array');

  if (!Array.isArray(rangeArray) || rangeArray.length < 2 || !rangeArray.every(num => typeof num === 'number')) {
    return <div>Invalid range array</div>;
  }

  return (
    <Range steps={rangeArray} min={rangeArray[0]} max={rangeArray[rangeArray.length - 1]} />
  )
}
