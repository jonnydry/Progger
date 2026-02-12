import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WheelPicker } from '@/components/WheelPicker';

describe('WheelPicker accessibility ids', () => {
  it('generates unique option ids for multiple pickers sharing the same label', () => {
    render(
      <div>
        <WheelPicker
          label="Root"
          options={['C', 'D', 'E']}
          value="C"
          onChange={() => {}}
        />
        <WheelPicker
          label="Root"
          options={['F', 'G', 'A']}
          value="F"
          onChange={() => {}}
        />
      </div>
    );

    const listboxes = screen.getAllByRole('listbox');
    expect(listboxes).toHaveLength(2);

    const firstActive = listboxes[0].getAttribute('aria-activedescendant');
    const secondActive = listboxes[1].getAttribute('aria-activedescendant');

    expect(firstActive).toBeTruthy();
    expect(secondActive).toBeTruthy();
    expect(firstActive).not.toBe(secondActive);
  });
});
