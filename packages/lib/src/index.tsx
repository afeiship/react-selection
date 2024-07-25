import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
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
   * If true, the selection can be reversible.
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
   * @param opts
   */
  template: TemplateCallback;
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

interface ReactSelectionState {
  value: any;
}

export default class ReactSelection<
  T extends {
    value: any;
  },
> extends Component<ReactSelectionProps<T>, ReactSelectionState> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    max: 0,
    allowDeselect: false,
    multiple: false,
    onChange: noop,
    onError: noop,
    items: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || (props.multiple ? [] : null),
    };
  }

  componentDidUpdate() {
    const { value, onChange } = this.props;
    const { value: stateValue } = this.state;
    const isEqual = fde(value, stateValue);
    if (value !== undefined && !isEqual) {
      this.setState({ value });
      onChange?.(value);
    }
  }

  handleTemplate = (args: TemplateArgs) => {
    const { multiple, template, options } = this.props;
    const { value } = this.state;
    const { item } = args;
    const handleSelect = multiple ? this.handleItemSelectMultiple : this.handleItemSelectSingle;
    const active = multiple ? value?.includes(item.value) : value === item.value;
    const cb = () => handleSelect(item);
    const calcOpts = {
      ...options,
      active,
      value,
      cb,
    };

    return template({ ...args, options: calcOpts });
  };

  handleItemSelectSingle = (item: any) => {
    const { onChange, allowDeselect } = this.props;
    const stateValue = this.state.value;
    const itemValue = item.value;
    const isChecked = itemValue === stateValue;
    const value = allowDeselect && isChecked ? null : itemValue;
    this.setState({ value }, () => {
      if (stateValue !== value) onChange?.(value);
    });
  };

  handleItemSelectMultiple = (item: any) => {
    const { onChange, max, onError } = this.props;
    const stateValue = this.state.value || [];
    const newValue = [...stateValue];
    const res = toggle(newValue, item.value);
    const calcRes = max! > 0 ? res.slice(0, max) : res;
    const hasExceed = res.length > max!;
    if (hasExceed) {
      onError?.({ code: 'MAX_LIMIT_EXCEED' });
      return;
    }
    this.setState({ value: calcRes }, () => {
      onChange?.(calcRes);
    });
  };

  render() {
    const {
      className,
      children,
      template,
      items,
      options,
      listProps,
      allowDeselect,
      onError,
      onChange,
      value,
      max,
      multiple,
      ...rest
    } = this.props;

    return (
      <div data-component={CLASS_NAME} className={cx(CLASS_NAME, className)} {...rest}>
        <ReactList items={items} template={this.handleTemplate} options={options} {...listProps} />
      </div>
    );
  }
}
