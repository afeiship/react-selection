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
    closeable: PropTypes.bool,
    elements: PropTypes.array,
    aside: PropTypes.element,
    extra: PropTypes.element
  };

  static defaultProps = {
    src: 'http://placeholder.qiniudn.com/80x80',
    closeable: true,
    elements: []
  };
  /*===properties end===*/

  render() {
    const {
      className,
      src,
      elements,
      aside,
      closeable,
      extra,
      ...props
    } = this.props;

    return (
      <footer
        {...props}
        data-role='root'
        className={classNames('webkit-sassui-flex-lmr-mauto react-download-app', className)}>
        { closeable && <img data-role='close' className="close" src={closeImg} alt=""/> }
        <img data-role='left' className="left" src={src}/>
          {
            elements.length > 0 && (
              <div data-role='middle' className="middle">
                {
                  elements.map((elem,index)=>{
                    return React.cloneElement(elem,{
                      ...elem.props,
                      key: index
                    });
                  })
                }
              </div>
            )
          }
        {!aside && <button data-role='right' className="right">打开</button>}
        { extra }
      </footer>
    );
  }
}
