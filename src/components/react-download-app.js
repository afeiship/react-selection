import React, {PureComponent} from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'noop';
import objectAssign from 'object-assign';
import closeImg from './rec_del.png';

export default class extends PureComponent {
  /*===properties start===*/
  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
  };

  static defaultProps = {
    src: 'http://placeholder.qiniudn.com/80x80'
  };
  /*===properties end===*/

  render() {
    const {
      className,
      src,
      ...props
    } = this.props;

    return (
      <footer
        {...props}
        data-role='root'
        className={classNames('webkit-sassui-flex-lmr-mauto react-download-app', className)}>
        <img data-role='close' className="close" src={closeImg} alt=""/>
        <img data-role='left' className="left" src={src}/>
        <div data-role='middle' className="middle">
          <h3 data-role='middle-hd' className="hd">搜狗搜索APP-答题助手</h3>
          <p data-role='middle-bd' className="bd">下载搜狗答题助手，帮你赢百万大奖</p>
        </div>
        <button data-role='right' className="right">打开</button>
      </footer>
    );
  }
}
