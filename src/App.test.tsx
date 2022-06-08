import { render, screen } from '@testing-library/react'
import App from '@/App'

test('renders any text', () => {
  render(<App />)
  const linkElement = screen.getByText(/./i)
  expect(linkElement).toBeInTheDocument()
})
