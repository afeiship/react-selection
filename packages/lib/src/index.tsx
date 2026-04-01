import React, { useState, useEffect, useCallback } from 'react';
import { ReactList, renderSlot, getKey, type KeyExtractor, type ReactListProps, type Slot } from '@jswork/react-list';
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

export type ReactSelectionProps<T> = Omit<ReactListProps<T>, 'slots' | 'keyExtractor'> & {
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
   * Extract the value from an item. Uses the same signature as KeyExtractor.
   * @default 'value'
   */
  valueExtractor?: KeyExtractor<T>;
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

export const ReactSelection = <T,>(props: ReactSelectionProps<T>) => {
  const {
    allowDeselect = false,
    max = 1000,
    value,
    onChange,
    onError,
    multiple = false,
    valueExtractor = 'value' as KeyExtractor<T>,
    slots,
    ...listRest
  } = props;
  const [stateValue, setStateValue] = useState(value || (multiple ? [] : null));

  useEffect(() => {
    const isEqual = fde(value, stateValue);
    if (value !== undefined && !isEqual) {
      setStateValue(value);
      onChange?.(value as any);
    }
  }, [value, onChange, stateValue]);

  const handleItemSelectSingle = useCallback((item: T) => {
    const itemValue = getKey(item, 0, valueExtractor);
    const isChecked = itemValue === stateValue;
    const newValue = allowDeselect && isChecked ? null : itemValue;
    setStateValue(newValue);
    if (stateValue !== newValue) onChange?.(newValue);
  }, [stateValue, allowDeselect, valueExtractor, onChange]);

  const handleItemSelectMultiple = useCallback((item: T) => {
    const newValue = toggle([...stateValue], getKey(item, 0, valueExtractor));
    const calcRes = max > 0 ? newValue.slice(0, max) : newValue;
    const hasExceed = newValue.length > max;
    if (hasExceed) {
      onError?.({ code: ErrorCode.MAX_LIMIT_EXCEED });
      return;
    }
    setStateValue(calcRes);
    onChange?.(calcRes);
  }, [stateValue, max, valueExtractor, onError, onChange]);

  const handleSelect = multiple ? handleItemSelectMultiple : handleItemSelectSingle;

  const listItemSlot = useCallback((listSlotProps: { item: T; index: number; data: T[] }) => {
    const { item, index, data: dataList } = listSlotProps;
    const itemValue = getKey(item, index, valueExtractor);
    const active = multiple ? stateValue?.includes(itemValue) : stateValue === itemValue;
    const disabled = multiple && stateValue?.length >= max && !active;
    const onClick = () => handleSelect(item);

    return renderSlot(slots.item, {
      item,
      index,
      data: dataList,
      active,
      disabled,
      onClick,
    });
  }, [stateValue, multiple, max, valueExtractor, handleSelect, slots.item]);

  return (
    <ReactList
      keyExtractor={valueExtractor}
      {...listRest}
      slots={{ item: listItemSlot, empty: slots.empty }}
    />
  );
};

export { Slot };
export default ReactSelection;
