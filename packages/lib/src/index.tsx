import React, { HTMLAttributes, useState, useEffect } from 'react';
import noop from '@jswork/noop';
import cx from 'classnames';
import { ReactList, type Slot } from '@jswork/react-list';
import fde from 'fast-deep-equal';

const CLASS_NAME = 'react-selection';
const toggle = (list: any[], value: any) => {
  const index = list.indexOf(value);
  const has = index > -1;
  has ? list.splice(index, 1) : list.push(value);
  return list;
};

export type StdError = { code: string };

export interface SelectionItemSlotProps<T> {
  item: T;
  index: number;
  data: T[];
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

export type ReactSelectionProps<T extends { value: any }> = {
  /**
   * If true, the selection can be deselected.
   * @default false
   */
  allowDeselect?: boolean;
  /**
   * The maximum number of selection.
   * @default 1000
   */
  max?: number;
  /**
   * The data items to be selected.
   * @default []
   */
  data: T[];
  /**
   * Key extractor for list items. Defaults to 'value'.
   * @default 'value'
   */
  keyExtractor?: keyof T | ((item: T, index: number) => string | number);
  /**
   * The value of selection.
   * @default null
   */
  value?: any;
  /**
   * The change handler.
   * @param value
   */
  onChange?: (value: any) => void;
  /**
   * The error handler.
   * @param error
   */
  onError?: (error: StdError) => void;
  /**
   * If true, multiple selection is allowed.
   * @default false
   */
  multiple?: boolean;
  /**
   * Slot configuration for rendering items and empty state.
   */
  slots: {
    item: Slot<SelectionItemSlotProps<T>>;
    empty?: Slot<{ data: T[] }>;
  };
} & Omit<HTMLAttributes<HTMLDivElement>, 'slots'>;

const defaults = {
  max: 1000,
  allowDeselect: false,
  multiple: false,
  onChange: noop,
  onError: noop,
  data: [],
  keyExtractor: 'value' as const,
};

function renderSlot<P>(slot: Slot<P>, props: P): React.ReactNode {
  if (typeof slot === 'function') {
    return React.createElement(slot as any, props as any);
  }
  if (slot && typeof slot === 'object' && 'component' in slot) {
    return React.createElement(slot.component as any, { ...slot.props, ...props } as any);
  }
  return slot;
}

const ReactSelection = <T extends { value: any }>(props: ReactSelectionProps<T>) => {
  const {
    allowDeselect = false,
    max = 1000,
    data = [],
    keyExtractor = 'value',
    value,
    onChange = noop,
    onError = noop,
    multiple = false,
    slots,
    className,
    children,
    ...rest
  } = { ...defaults, ...props };
  const [stateValue, setStateValue] = useState(value || (multiple ? [] : null));

  useEffect(() => {
    const isEqual = fde(value, stateValue);
    if (value !== undefined && !isEqual) {
      setStateValue(value);
      onChange?.(value);
    }
  }, [value, onChange, stateValue]);

  const handleItemSelectSingle = (item: any) => {
    const itemValue = item.value;
    const isChecked = itemValue === stateValue;
    const newValue = allowDeselect && isChecked ? null : itemValue;
    setStateValue(newValue);
    if (stateValue !== newValue) onChange?.(newValue);
  };

  const handleItemSelectMultiple = (item: any) => {
    const newValue = toggle([...stateValue], item.value);
    const calcRes = max > 0 ? newValue.slice(0, max) : newValue;
    const hasExceed = newValue.length > max;
    if (hasExceed) {
      onError?.({ code: 'MAX_LIMIT_EXCEED' });
      return;
    }
    setStateValue(calcRes);
    onChange?.(calcRes);
  };

  const listItemSlot = (listSlotProps: { item: T; index: number; data: T[] }) => {
    const { item, index, data: dataList } = listSlotProps;
    const active = multiple ? stateValue?.includes(item.value) : stateValue === item.value;
    const disabled = multiple && stateValue?.length >= max && !active;
    const handleSelect = multiple ? handleItemSelectMultiple : handleItemSelectSingle;
    const onClick = () => handleSelect(item);

    return renderSlot(slots.item, {
      item,
      index,
      data: dataList,
      active,
      disabled,
      onClick,
    });
  };

  return (
    <div data-component={CLASS_NAME} className={cx(CLASS_NAME, className)} {...rest}>
      <ReactList
        data={data}
        keyExtractor={keyExtractor}
        slots={{ item: listItemSlot, empty: slots.empty }}
      />
    </div>
  );
};

export { Slot };
export default ReactSelection;
