import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AccessibleButton } from '../AccessibleButton';

expect.extend(toHaveNoViolations);

describe('AccessibleButton Accessibility', () => {
  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <AccessibleButton label="Test Button" onClick={() => {}}>
        Click Me
      </AccessibleButton>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations when loading', async () => {
    const { container } = render(
      <AccessibleButton
        label="Test Button"
        isLoading={true}
        loadingText="Loading..."
        onClick={() => {}}
      >
        Click Me
      </AccessibleButton>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations when disabled', async () => {
    const { container } = render(
      <AccessibleButton label="Test Button" disabled onClick={() => {}}>
        Click Me
      </AccessibleButton>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should not have any accessibility violations with description', async () => {
    const { container } = render(
      <AccessibleButton
        label="Test Button"
        description="This is a test button description"
        onClick={() => {}}
      >
        Click Me
      </AccessibleButton>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
}); 