/**
 * 05-controlled-value.spec.tsx
 *
 * Purpose: Test controlled value behavior of ReactSelection.
 * Description: Verifies that when the value prop changes externally,
 * the component syncs its internal state and calls onChange.
 * Also tests that identical values do not trigger unnecessary updates.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactSelection, type SelectionItemSlotProps } from '../src';

interface TestItem {
  value: string;
  label: string;
}

const ITEMS: TestItem[] = [
  { value: 'a', label: 'Item A' },
  { value: 'b', label: 'Item B' },
  { value: 'c', label: 'Item C' },
];

const ItemSlot = ({ item, active, onClick }: SelectionItemSlotProps<TestItem>) => (
  <div data-testid={`item-${item.value}`} data-active={active} onClick={onClick}>
    {item.label}
  </div>
);

describe('ReactSelection - Controlled Value', () => {
  it('should sync internal state when value prop changes', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="a"
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');

    // External value change
    rerender(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="b"
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('should not call onChange when value prop stays the same', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="a"
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // Rerender with same value
    rerender(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="a"
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // onChange should not have been called for the controlled sync
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should sync multiple mode when value prop changes', () => {
    const onChange = vi.fn();

    const { rerender } = render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        value={['a']}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false');

    // External value change
    rerender(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        value={['b', 'c']}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-c')).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenCalledWith(['b', 'c']);
  });

  it('should allow user interaction after controlled value sync', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="a"
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');

    // User clicks a different item
    fireEvent.click(screen.getByTestId('item-b'));
    expect(onChange).toHaveBeenCalledWith('b');
  });
});
