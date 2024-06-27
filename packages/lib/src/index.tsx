import noop from '@jswork/noop';
import cx from 'classnames';
import React, { Component, HTMLAttributes } from 'react';
import ReactList, { TemplateArgs, ReactListProps } from '@jswork/react-list';

const CLASS_NAME = 'react-selection';
const toggle = (list: any[], value: any) => {
  const index = list.indexOf(value);
  const has = index > -1;
  has ? list.splice(index, 1) : list.push(value);
  return list;
};

export type StdError = { code: string };

export type TemplateCallback = (args: TemplateArgs, opts?: any) => React.ReactNode;

export interface ItemOptions {
  key: number;
  active: boolean;
  value: any;
  className: string;
  cb: () => void;

  [key: string]: any;
}

export type ReactSelectionProps<T extends { value: any }> = {
  /**
   * The class name of active item.
   * @default 'is-active'
   */
  activeClassName?: string;
  /**
   * If true, the selection can be reversible.
   * @default false
   */
  reversible?: boolean;
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
  template?: TemplateCallback;
  /**
   * The props for ReactList component.
   * @default {}
   */
  listProps?: Omit<ReactListProps, 'template' | 'items'>;
} & HTMLAttributes<HTMLDivElement>;

interface ReactSelectionState {
  value: any;
}

const defaultTemplate = (args: TemplateArgs, opts?: any) => {
  const { item } = args;
  const { key, className, cb } = opts;
  return (
    <div key={key} className={className} onClick={cb}>
      {item.label}
    </div>
  );
};

export default class ReactSelection<
  T extends {
    value: any;
  },
> extends Component<ReactSelectionProps<T>, ReactSelectionState> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    activeClassName: 'is-active',
    max: 0,
    reversible: false,
    multiple: false,
    onChange: noop,
    onError: noop,
    items: [],
    template: defaultTemplate,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || (props.multiple ? [] : null),
    };
  }

  // shouldComponentUpdate(nextProps: Readonly<ReactSelectionProps<any>>): boolean {
  //   const { value } = nextProps;
  //   const { value: stateValue } = this.state;
  //   if (stateValue !== value) this.setState({ value });
  //   return true;
  // }

  componentDidUpdate() {
    const { value, onChange } = this.props;
    const { value: stateValue } = this.state;
    if (value !== undefined && value !== stateValue) {
      this.setState({ value });
      onChange?.(value);
    }
  }

  handleTemplate = (args: TemplateArgs, opts?: any) => {
    const { multiple, template } = this.props;
    const { value } = this.state;
    const { index, item } = args;
    const handleSelect = multiple ? this.handleItemSelectMultiple : this.handleItemSelectSingle;
    const active = multiple ? value.includes(item.value) : value === item.value;
    const cxClassName = cx('react-selection-item', { 'is-active': active });
    const cb = () => handleSelect(item);
    const calcOpts: ItemOptions = {
      ...opts,
      key: index,
      active,
      value,
      className: cxClassName,
      cb,
    };
    return template?.(args, calcOpts);
  };

  handleItemSelectSingle = (item: any) => {
    const { onChange, reversible } = this.props;
    const stateValue = this.state.value;
    const itemValue = item.value;
    const isChecked = itemValue === stateValue;
    const value = reversible && isChecked ? null : itemValue;
    this.setState({ value }, () => {
      if (stateValue !== value) onChange?.(value);
    });
  };

  handleItemSelectMultiple = (item: any) => {
    const { onChange, max, onError } = this.props;
    const stateValue = this.state.value;
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
      listProps,
      activeClassName,
      reversible,
      onError,
      onChange,
      value,
      max,
      multiple,
      ...rest
    } = this.props;

    return (
      <div data-component={CLASS_NAME} className={cx(CLASS_NAME, className)} {...rest}>
        <ReactList items={items} template={this.handleTemplate} {...listProps} />
      </div>
    );
  }
}
