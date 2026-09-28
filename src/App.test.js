import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard navigation links', () => {
  render(<App />);
  expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  expect(screen.getByText(/goals/i)).toBeInTheDocument();
});

test('renders the real calendar page on the calendar route', () => {
  window.history.pushState({}, '', '/calendar');

  render(<App />);

  expect(screen.getByText(/calendar/i)).toBeInTheDocument();
  expect(screen.getByText('Mon')).toBeInTheDocument();
});
