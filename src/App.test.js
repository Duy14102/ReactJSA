import { render, screen } from '@testing-library/react';
import Wrapped from './Wrapped';

test('renders learn react link', () => {
  render(<Wrapped />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
