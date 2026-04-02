/**
 * 04-value-extractor.spec.tsx
 *
 * Purpose: Test valueExtractor prop of ReactSelection.
 * Description: Verifies that valueExtractor works with a string key
 * (e.g., 'id' instead of default 'value') and with a custom function,
 * and that selection and active state correctly reflect the extracted value.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ReactSelection, type SelectionItemSlotProps } from '../src';

interface IdItem {
  id: number;
  name: string;
}

interface CodeItem {
  code: string;
  title: string;
}

const ID_ITEMS: IdItem[] = [
  { id: 101, name: 'Alpha' },
  { id: 202, name: 'Beta' },
  { id: 303, name: 'Gamma' },
];

const CODE_ITEMS: CodeItem[] = [
  { code: 'US', title: 'United States' },
  { code: 'JP', title: 'Japan' },
];

const IdItemSlot = ({ item, active, onClick }: SelectionItemSlotProps<IdItem>) => (
  <div data-testid={`item-${item.id}`} data-active={active} onClick={onClick}>
    {item.name}
  </div>
);

const CodeItemSlot = ({ item, active, onClick }: SelectionItemSlotProps<CodeItem>) => (
  <div data-testid={`item-${item.code}`} data-active={active} onClick={onClick}>
    {item.title}
  </div>
);

describe('ReactSelection - Value Extractor', () => {
  it('should use "value" as default key for extraction', () => {
    interface ValueItem { value: string; label: string; }
    const items: ValueItem[] = [
      { value: 'x', label: 'X' },
      { value: 'y', label: 'Y' },
    ];
    const onChange = vi.fn();

    const Slot = ({ item, active, onClick }: SelectionItemSlotProps<ValueItem>) => (
      <div data-testid={`item-${item.value}`} data-active={active} onClick={onClick}>{item.label}</div>
    );

    render(
      <ReactSelection<ValueItem>
        data={items}
        slots={{ item: Slot }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('item-x'));
    expect(onChange).toHaveBeenCalledWith('x');
  });

  it('should extract value using a custom string key', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<IdItem>
        data={ID_ITEMS}
        valueExtractor="id"
        slots={{ item: IdItemSlot }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('item-101'));
    expect(onChange).toHaveBeenCalledWith(101);
    expect(screen.getByTestId('item-101')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('item-202')).toHaveAttribute('data-active', 'false');
  });

  it('should extract value using a custom function', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<CodeItem>
        data={CODE_ITEMS}
        valueExtractor={(item) => item.code.toLowerCase()}
        slots={{ item: CodeItemSlot }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('item-US'));
    expect(onChange).toHaveBeenCalledWith('us');
    expect(screen.getByTestId('item-US')).toHaveAttribute('data-active', 'true');
  });

  it('should work with valueExtractor in multiple mode', () => {
    const onChange = vi.fn();

    render(
      <ReactSelection<IdItem>
        data={ID_ITEMS}
        multiple
        valueExtractor="id"
        slots={{ item: IdItemSlot }}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByTestId('item-101'));
    fireEvent.click(screen.getByTestId('item-202'));
    expect(onChange).toHaveBeenCalledWith([101, 202]);

    // Toggle off
    fireEvent.click(screen.getByTestId('item-101'));
    expect(onChange).toHaveBeenCalledWith([202]);
  });
});
