import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';

describe('Integration: Course CRUD with Teacher Persistence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Read Operations', () => {
    it('should display teacher information for all featured courses', () => {
      render(<HomePage />);
      expect(screen.getByText('Dr. Sarah Johnson')).toBeInTheDocument();
      expect(screen.getByText('Prof. Michael Chen')).toBeInTheDocument();
      expect(screen.getByText('Dr. Emily Williams')).toBeInTheDocument();
    });
  });
});
