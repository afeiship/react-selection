/**
 * 02-single-selection.spec.tsx
 *
 * Purpose: Test single selection behavior of ReactSelection.
 * Description: Verifies clicking an item selects it (active=true),
 * clicking a different item switches selection,
 * allowDeselect enables deselecting by clicking the active item again,
 * and onChange is called with the correct value on each selection change.
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
];

const ItemSlot = ({ item, active, onClick }: SelectionItemSlotProps<TestItem>) => (
  <div data-testid={`item-${item.value}`} data-active={active} onClick={onClick}>
    {item.label}
  </div>
);

describe('ReactSelection - Single Selection', () => {
  it('should select an item when clicked', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'false');
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('should switch selection when a different item is clicked', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // Select first item
    fireEvent.click(screen.getByTestId('item-a'));
    expect(onChange).toHaveBeenCalledWith('a');

    // Switch to second item
    fireEvent.click(screen.getByTestId('item-b'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('should not deselect when allowDeselect is false (default)', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
        onChange={onChange}
      />
    );

    // Select first item
    fireEvent.click(screen.getByTestId('item-a'));
    expect(onChange).toHaveBeenCalledWith('a');

    // Click again - should remain selected (allowDeselect defaults to false)
    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'true');
    // onChange is NOT called again since value didn't change (stateValue === newValue)
  });

  it('should deselect when allowDeselect is true and active item is clicked again', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
        allowDeselect={true}
        onChange={onChange}
      />
    );

    // Select first item
    fireEvent.click(screen.getByTestId('item-a'));
    expect(onChange).toHaveBeenCalledWith('a');

    // Click again - should deselect
    fireEvent.click(screen.getByTestId('item-a'));
    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should initialize with the provided value as active', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        value="b"
        slots={{ item: ItemSlot }}
      />
    );

    expect(screen.getByTestId('item-a')).toHaveAttribute('data-active', 'false');
    expect(screen.getByTestId('item-b')).toHaveAttribute('data-active', 'true');
  });
});
