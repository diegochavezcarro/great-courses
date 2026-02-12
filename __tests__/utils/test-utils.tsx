import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render function that can wrap providers if needed in the future
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
export { customRender as render };
