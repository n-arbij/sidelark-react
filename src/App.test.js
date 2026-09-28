import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard navigation links', () => {
  render(<App />);
  expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  expect(screen.getByText(/goals/i)).toBeInTheDocument();
});
