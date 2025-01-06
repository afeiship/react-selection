import React, { HTMLAttributes, useState, useEffect } from 'react';
import noop from '@jswork/noop';
import cx from 'classnames';
import ReactList, { TemplateArgs, ReactListProps, TemplateCallback } from '@jswork/react-list';
import fde from 'fast-deep-equal';

const CLASS_NAME = 'react-selection';
const toggle = (list: any[], value: any) => {
  const index = list.indexOf(value);
  const has = index > -1;
  has ? list.splice(index, 1) : list.push(value);
  return list;
};

export type StdError = { code: string };

export type ReactSelectionProps<T extends { value: any }> = {
  /**
   * If true, the selection can be deselected.
   * @default false
   */
  allowDeselect?: boolean;
  /**
   * The maximum number of selection.
   * @default 0(unlimited)
   */
  max?: number;
  /**
   * The items(data) to be selected.
   * @default []
   */
  items: T[];
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
   * The template for rendering each item.
   * @param args
   */
  template?: TemplateCallback;
  /**
   * The extra options for template function.
   */
  options?: any;
  /**
   * The props for ReactList component.
   * @default {}
   */
  listProps?: Omit<ReactListProps, 'template' | 'items' | 'options'>;
} & HTMLAttributes<HTMLDivElement>;

const defaults: ReactSelectionProps<any> = {
  max: 1000,
  allowDeselect: false,
  multiple: false,
  onChange: noop,
  onError: noop,
  items: [],
};

const ReactSelection = <T extends { value: any }>(props: ReactSelectionProps<T>) => {
  const {
    allowDeselect = false,
    max = 1000,
    items = [],
    value,
    onChange = noop,
    onError = noop,
    multiple = false,
    template,
    options,
    listProps,
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

  const handleTemplate = (args: TemplateArgs) => {
    const { item } = args;
    const handleSelect = multiple ? handleItemSelectMultiple : handleItemSelectSingle;
    const active = multiple ? stateValue?.includes(item.value) : stateValue === item.value;
    const disabled = multiple && stateValue?.length >= max && !active;
    const cb = () => handleSelect(item);
    const calcOpts = {
      ...options,
      multiple,
      max,
      disabled,
      active,
      value: stateValue,
      cb,
    };

    return template?.({ ...args, options: calcOpts });
  };

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

  return (
    <div data-component={CLASS_NAME} className={cx(CLASS_NAME, className)} {...rest}>
      <ReactList items={items} template={handleTemplate} options={options} {...listProps} />
    </div>
  );
};

export default ReactSelection;
