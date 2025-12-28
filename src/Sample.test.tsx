import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Sample', () => {
  function Sample() {
    return <div>Hello, Vitest + RTL!</div>;
  }

  it('renders the greeting', () => {
    render(<Sample />);
    expect(screen.getByText('Hello, Vitest + RTL!')).toBeInTheDocument();
  });
});
