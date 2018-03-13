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
          onClick={this._onClick}
          ref='rc'/>
      </div>
    );
  }
}
/*===example end===*/

ReactDOM.render(
  <App/>, document.getElementById('app'));
