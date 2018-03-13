# react-download-app
> Down load app bar for react.


## properties:
```javascript

  static propTypes = {
    className: PropTypes.string,
    src: PropTypes.string,
  };

  static defaultProps = {
    src: 'http://placeholder.qiniudn.com/80x80'
  };
  
```

## usage:
```jsx

// install: npm install afeiship/react-download-app --save import : import
// ReactDownloadApp from 'react-download-app'

class App extends React.Component {
  constructor(props) {
    super(props);
    window.demo = this;
    window.refs = this.refs;
    window.rc = this.refs.rc;
  }

  _onClick = e => {
    console.log('DATA ROLE:->', e.target.getAttribute('data-role'));
  };

  render() {
    return (
      <div className="hello-react-download-app">
        <ReactDownloadApp
          src="https://m.sogou.com/images/logo72.png"
          onClick={this._onClick}
          ref='rc'/>
      </div>
    );
  }
}

```

## customize style:
```scss
// customize your styles:
$react-download-app-options:(
);

@import '~node_modules/react-download-app/style.scss';
```
