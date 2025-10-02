import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Range from '../Range'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

const mockSteps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

describe('Range Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with default props', () => {
  render(<Range min={10} max={90} />)

  expect(screen.getByText('10')).toBeInTheDocument()
  expect(screen.getByText('90')).toBeInTheDocument()

  const minHandle = screen.getByRole('slider', { name: /Minimum value/i })
  const maxHandle = screen.getByRole('slider', { name: /Maximum value/i })

  expect(minHandle).toBeInTheDocument()
  expect(maxHandle).toBeInTheDocument()

  expect(minHandle).toHaveAttribute('aria-valuemin', '10')
  expect(minHandle).toHaveAttribute('aria-valuemax', '90')
  expect(minHandle).toHaveAttribute('aria-valuenow', '10')

  expect(maxHandle).toHaveAttribute('aria-valuenow', '90')
  })

  it('renders correctly with stepped mode', () => {
    render(<Range min={0} max={100} steps={mockSteps} />)
  
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  
    const minHandle = screen.getByRole('slider', { name: /Minimum value/i })
    const maxHandle = screen.getByRole('slider', { name: /Maximum value/i })
  
    expect(minHandle).toBeInTheDocument()
    expect(maxHandle).toBeInTheDocument()
  
    expect(minHandle).toHaveAttribute('aria-valuemin', '0')
    expect(minHandle).toHaveAttribute('aria-valuemax', '100')
    expect(minHandle).toHaveAttribute('aria-valuenow', '0')
  
    expect(maxHandle).toHaveAttribute('aria-valuenow', '100')
  })

  it('should show input fields when labels are clicked in non-stepped mode', async () => {
     render(<Range min={10} max={90} />)
      const minLabel = screen.getByText('10')

      await userEvent.click(minLabel)

      const input = screen.getByRole('spinbutton')
      expect(input).toBeInTheDocument()
      
      expect(input).toHaveValue(10)
      expect(input).toHaveFocus()
  })

  it('should not show input fields when labels are clicked in stepped mode', async () => {
    render(<Range min={10} max={100} steps={mockSteps} />)
     const minLabel = screen.getByText('10')

     await userEvent.click(minLabel)

     const input = screen.queryByRole('spinbutton')
     expect(input).not.toBeInTheDocument()

     expect(minLabel).toHaveTextContent('10')
  })
  it('should revert the value when the Escape key is pressed', async () => {
      render(<Range min={10} max={90} />)
      const maxLabel = screen.getByText('90')
      
      await userEvent.click(maxLabel)
      const input = screen.getByRole('spinbutton')
      
      await userEvent.clear(input)
      await userEvent.type(input, '50')
      await userEvent.keyboard('{escape}')
      
      expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument()
      
      expect(screen.getByText('90')).toBeInTheDocument()
      expect(screen.queryByText('50')).not.toBeInTheDocument()

      const maxHandle = screen.getByRole('slider', { name: /Maximum value/i })
      expect(maxHandle).toHaveAttribute('aria-valuenow', '90')
    })
    
  it('should update the min value when dragging the min handle', () => {
    render(<Range min={0} max={100} />)
    const minHandle = screen.getByRole('slider', { name: /Minimum value/i })
    const track = minHandle.parentElement

    jest.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      width: 200, 
      height: 10,
      left: 100, 
      top: 0,
      right: 300,
      bottom: 10,
      x: 100,
      y: 0,
      toJSON: () => {},
    })

    fireEvent.mouseDown(minHandle, { clientX: 100 })

    fireEvent.mouseMove(window, { clientX: 150 })

    expect(minHandle).toHaveAttribute('aria-valuenow', '25')
    expect(screen.getByText('25')).toBeInTheDocument()

    fireEvent.mouseUp(window)
  })

  it('should not allow the min handle to be dragged past the max handle', () => {
    render(<Range min={0} max={100} />)
    const minHandle = screen.getByRole('slider', { name: /Minimum value/i })
    const track = minHandle.parentElement!
    
    jest.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      width: 200, left: 100, top: 0, height: 10, right: 300, bottom: 10, x: 100, y: 0, toJSON: () => {},
    })

    fireEvent.mouseDown(minHandle, { clientX: 100 })
    fireEvent.mouseMove(window, { clientX: 500 })
    
    expect(minHandle).toHaveAttribute('aria-valuenow', '100')

    fireEvent.mouseUp(window)
  })
})

  