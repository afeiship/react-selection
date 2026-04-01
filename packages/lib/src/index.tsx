import React, { useState, useEffect, useCallback } from 'react';
import { ReactList, type ReactListProps, type Slot } from '@jswork/react-list';
import fde from 'fast-deep-equal';

const toggle = (list: any[], value: any) => {
  const index = list.indexOf(value);
  const has = index > -1;
  has ? list.splice(index, 1) : list.push(value);
  return list;
};

export enum ErrorCode {
  MAX_LIMIT_EXCEED = 'MAX_LIMIT_EXCEED',
}

export type StdError = { code: ErrorCode };

export interface SelectionItemSlotProps<T> {
  item: T;
  index: number;
  data: T[];
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}

export type ReactSelectionProps<T extends { value: any }> = Omit<ReactListProps<T>, 'slots'> & {
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
   * The value of selection.
   * @default null
   */
  value?: any;
  /**
   * The change handler.
   */
  onChange?: (value: any) => void;
  /**
   * The error handler.
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
};

const defaults = {
  max: 1000,
  allowDeselect: false,
  multiple: false,
  keyExtractor: 'value' as const,
};

function renderSlot<P>(slot: Slot<P>, props: P, key?: string | number): React.ReactNode {
  if (typeof slot === 'function') {
    return React.createElement(slot as any, key ? { key, ...props } : (props as any));
  }
  if (slot && typeof slot === 'object' && 'component' in slot) {
    return React.createElement(slot.component as any, { key, ...slot.props, ...props } as any);
  }
  if (key !== undefined) return <React.Fragment key={key}>{slot}</React.Fragment>;
  return slot;
}

export const ReactSelection = <T extends { value: any }>(props: ReactSelectionProps<T>) => {
  const {
    allowDeselect = false,
    max = 1000,
    value,
    onChange,
    onError,
    multiple = false,
    slots,
    ...listRest
  } = { ...defaults, ...props };
  const [stateValue, setStateValue] = useState(value || (multiple ? [] : null));

  useEffect(() => {
    const isEqual = fde(value, stateValue);
    if (value !== undefined && !isEqual) {
      setStateValue(value);
      onChange?.(value as any);
    }
  }, [value, onChange, stateValue]);

  const handleItemSelectSingle = useCallback((item: any) => {
    const itemValue = item.value;
    const isChecked = itemValue === stateValue;
    const newValue = allowDeselect && isChecked ? null : itemValue;
    setStateValue(newValue);
    if (stateValue !== newValue) onChange?.(newValue);
  }, [stateValue, allowDeselect, onChange]);

  const handleItemSelectMultiple = useCallback((item: any) => {
    const newValue = toggle([...stateValue], item.value);
    const calcRes = max > 0 ? newValue.slice(0, max) : newValue;
    const hasExceed = newValue.length > max;
    if (hasExceed) {
      onError?.({ code: ErrorCode.MAX_LIMIT_EXCEED });
      return;
    }
    setStateValue(calcRes);
    onChange?.(calcRes);
  }, [stateValue, max, onError, onChange]);

  const handleSelect = multiple ? handleItemSelectMultiple : handleItemSelectSingle;

  const listItemSlot = useCallback((listSlotProps: { item: T; index: number; data: T[] }) => {
    const { item, index, data: dataList } = listSlotProps;
    const active = multiple ? stateValue?.includes(item.value) : stateValue === item.value;
    const disabled = multiple && stateValue?.length >= max && !active;
    const onClick = () => handleSelect(item);
    const key = (item as any).value ?? index;

    return renderSlot(slots.item, {
      item,
      index,
      data: dataList,
      active,
      disabled,
      onClick,
    }, key);
  }, [stateValue, multiple, max, handleSelect, slots.item]);

  return (
    <ReactList
      {...listRest}
      slots={{ item: listItemSlot, empty: slots.empty }}
    />
  );
};

export { Slot };
export default ReactSelection;
