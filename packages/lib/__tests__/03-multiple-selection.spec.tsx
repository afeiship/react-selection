/**
 * 03-multiple-selection.spec.tsx
 *
 * Purpose: Test multiple selection behavior of ReactSelection.
 * Description: Verifies toggling items in multi-select mode,
 * max limit enforcement with onError callback,
 * and disabled state for items when max is reached.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactSelection, ErrorCode, type SelectionItemSlotProps } from '../src';

interface TestItem {
  value: string;
  label: string;
}

const ITEMS: TestItem[] = [
  { value: 'a', label: 'Item A' },
  { value: 'b', label: 'Item B' },
  { value: 'c', label: 'Item C' },
  { value: 'd', label: 'Item D' },
];

const ItemSlot = ({ item, active, disabled, onClick }: SelectionItemSlotProps<TestItem>) => (
  <div
    data-testid={`item-${item.value}`}
    data-active={active}
    data-disabled={disabled}
    onClick={onClick}
  >
    {item.label}
  </div>
);

describe('ReactSelection - Multiple Selection', () => {
  it('should toggle items in multiple mode', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // Select item A
    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenCalledWith(['a']);

    // Select item B
    fireEvent.click(screen.getByTestId('item-b'));
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenCalledWith(['a', 'b']);

    // Deselect item A (toggle off)
    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(onChange).toHaveBeenCalledWith(['b']);
  });

  it('should enforce max limit and call onError when exceeded', () => {
    const onChange = vi.fn();
    const onError = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        max={2}
        slots={{ item: ItemSlot }}
        onChange={onChange}
        onError={onError}
      />
    );

    // Select item A and B (reaches max=2)
    fireEvent.click(screen.getByTestId('item-a'));
    fireEvent.click(screen.getByTestId('item-b'));

    // Trying to select item C should trigger error
    fireEvent.click(screen.getByTestId('item-c'));
    expect(onError).toHaveBeenCalledWith({ code: ErrorCode.MAX_LIMIT_EXCEED });
    expect(onChange).not.toHaveBeenLastCalledWith(['a', 'b', 'c']);
  });

  it('should disable unselected items when max is reached', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        max={2}
        slots={{ item: ItemSlot }}
      />
    );

    // Select two items to reach max
    fireEvent.click(screen.getByTestId('item-a'));
    fireEvent.click(screen.getByTestId('item-b'));

    // Unselected items should be disabled
    expect(screen.getByTestId('item-c')).toHaveAttribute('data-disabled', 'true');
    expect(screen.getByTestId('item-d')).toHaveAttribute('data-disabled', 'true');

    // Selected items should NOT be disabled (can still toggle off)
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-disabled', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-disabled', 'false');
  });

  it('should allow toggling off an active item even when at max', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        max={2}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // Fill to max
    fireEvent.click(screen.getByTestId('item-a'));
    fireEvent.click(screen.getByTestId('item-b'));

    // Toggle off one active item
    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(onChange).toHaveBeenLastCalledWith(['b']);

    // Now other items should be available again
    expect(screen.getByTestId('item-c')).toHaveAttribute('data-disabled', 'false');
  });

  it('should initialize with an empty array when no value is provided in multiple mode', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        slots={{ item: ItemSlot }}
      />
    );

    // All items should be inactive
    ITEMS.forEach(item => {
      expect(screen.getByTestId(`item-${item.value}`)).toHaveAttribute('data-active', 'false');
    });
  });

  it('should initialize with the provided array value in multiple mode', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        multiple
        value={['b', 'c']}
        slots={{ item: ItemSlot }}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-c')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-d')).toHaveAttribute('data-active', 'false');
  });
});
