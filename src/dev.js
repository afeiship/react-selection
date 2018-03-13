import './dev.scss';
import ReactDownloadApp from './main';

/*===example start===*/

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
          elements={[
            <h3 data-role='middle-hd' className="hd">搜狗搜索APP-答题助手</h3>,
            <p data-role='middle-bd' style={{ color:'#999'}} className="bd">下载搜狗答题助手，帮你赢百万大奖</p>
          ]}
          onClick={this._onClick}
          ref='rc'/>
      </div>
    );
  }
}
/*===example end===*/

ReactDOM.render(
  <App/>, document.getElementById('app'));
