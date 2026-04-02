/**
 * 01-rendering.spec.tsx
 *
 * Purpose: Test basic rendering behavior of ReactSelection component.
 * Description: Verifies that the component renders correctly with data items,
 * passes correct props to item slots (active, disabled, onClick),
 * and handles empty data by showing the empty slot.
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

const ItemSlot = ({ item, active, disabled, onClick }: SelectionItemSlotProps<TestItem>) => (
  <div data-testid={`item-${item.value}`} data-active={active} data-disabled={disabled} onClick={onClick}>
    {item.label}
  </div>
);

describe('ReactSelection - Rendering', () => {
  it('should render all data items via the item slot', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
      />
    );

    expect(screen.getByTestId('item-a')).toBeInTheDocument();
    expect(screen.getByTestId('item-b')).toBeInTheDocument();
    expect(screen.getByTestId('item-c')).toBeInTheDocument();
  });

  it('should pass correct item data and index to each slot', () => {
    const SlotTracker = ({ item, index }: SelectionItemSlotProps<TestItem>) => (
      <span data-testid={`slot-${index}`}>{item.label}-{index}</span>
    );

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: SlotTracker }}
      />
    );

    expect(screen.getByTestId('slot-0')).toHaveTextContent('Item A-0');
    expect(screen.getByTestId('slot-1')).toHaveTextContent('Item B-1');
    expect(screen.getByTestId('slot-2')).toHaveTextContent('Item C-2');
  });

  it('should render empty slot when data is empty', () => {
    const EmptySlot = () => <div data-testid="empty">No items</div>;

    render(
      <ReactSelection<TestItem>
        data={[]}
        slots={{ item: ItemSlot, empty: EmptySlot }}
      />
    );

    expect(screen.getByTestId('empty')).toBeInTheDocument();
    expect(screen.queryByTestId('item-a')).not.toBeInTheDocument();
  });

  it('should pass the full data array to each item slot', () => {
    const DataSlot = ({ data }: SelectionItemSlotProps<TestItem>) => (
      <span data-testid="data-count">{data.length}</span>
    );

    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: DataSlot }}
      />
    );

    // All 3 items should have data.length = 3
    const elements = screen.getAllByTestId('data-count');
    expect(elements).toHaveLength(3);
    elements.forEach(el => expect(el).toHaveTextContent('3'));
  });

  it('should mark items as not active and not disabled by default (single mode)', () => {
    render(
      <ReactSelection<TestItem>
        data={ITEMS}
        slots={{ item: ItemSlot }}
      />
    );

    ITEMS.forEach(item => {
      const el = screen.getByTestId(`item-${item.value}`);
      expect(el).toHaveAttribute('data-active', 'false');
      expect(el).toHaveAttribute('data-disabled', 'false');
    });
  });
});
