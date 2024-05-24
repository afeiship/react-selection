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

export type ReactSelectionProps<T extends { value: any }> = {
  activeClassName?: string;
  checkAble?: boolean;
  items: T[];
  value?: any;
  onChange?: (value: any) => void;
  multiple?: boolean;
  template?: (args: TemplateArgs, opts?: any) => React.ReactNode;
  listProps?: Omit<ReactListProps, 'template' | 'items'>;
} & HTMLAttributes<HTMLDivElement>;

interface ReactSelectionState {
  value: any;
}

const defaultTemplate = (args: TemplateArgs, opts?: any) => {
  const { item } = args;
  const { key, className, cb } = opts;
  return (
    <div
      key={key}
      className={className}
      onClick={cb}>
      {item.label}
    </div>
  );
};

export default class ReactSelection<T extends {
  value: any
}> extends Component<ReactSelectionProps<T>, ReactSelectionState> {
  static displayName = CLASS_NAME;
  static version = '__VERSION__';
  static defaultProps = {
    activeClassName: 'is-active',
    checkAble: false,
    multiple: false,
    onChange: noop,
    items: [],
    template: defaultTemplate,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || (props.multiple ? [] : null),
    };
  }

  shouldComponentUpdate(nextProps: Readonly<ReactSelectionProps<any>>): boolean {
    const { value } = nextProps;
    if (this.state.value !== value) this.setState({ value });
    return true;
  }

  handleTemplate = (args: TemplateArgs, opts?: any) => {
    const { multiple, template } = this.props;
    const { value } = this.state;
    const { index, item } = args;
    const handleSelect = multiple ? this.handleItemSelectMultiple : this.handleItemSelectSingle;
    const isActive = multiple ? value.includes(item.value) : value === item.value;
    const cxClassName = cx('react-selection-item', { 'is-active': isActive });
    const cb = () => handleSelect(item);
    const calcOpts = { ...opts, key: index, className: cxClassName, cb };
    return template?.(args, calcOpts);
  };

  handleItemSelectSingle = (item: any) => {
    const { onChange, checkAble } = this.props;
    const stateValue = this.state.value;
    const itemValue = item.value;
    const isChecked = itemValue === stateValue;
    const value = (checkAble && isChecked) ? null : itemValue;
    this.setState({ value }, () => {
      if (stateValue !== value) onChange?.(value);
    });
  };

  handleItemSelectMultiple = (item: any) => {
    const { value, onChange } = this.props;
    const newValue = [...value];
    toggle(newValue, item.value);
    this.setState({ value: newValue }, () => {
      onChange?.(newValue);
    });
  };

  render() {
    const { className, children, template, items, listProps, activeClassName, checkAble, ...rest } = this.props;
    return (
      <div data-component={CLASS_NAME} className={cx(CLASS_NAME, className)} {...rest}>
        <ReactList items={items} template={this.handleTemplate} {...listProps} />
      </div>
    );
  }
}
