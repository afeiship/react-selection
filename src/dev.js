import './dev.scss';
import ReactDownloadApp from './main';

/*===example start===*/

// install: npm install afeiship/react-download-app --save
// import : import ReactDownloadApp from 'react-download-app'

class App extends React.Component{
  state = {

  };

  constructor(props){
    super(props);
    window.demo = this;
    window.refs = this.refs;
    window.rc = this.refs.rc;
  }

  render(){
    return (
      <div className="hello-react-download-app">
        <ReactDownloadApp ref='rc' />
    </div>
    );
  }
}
/*===example end===*/

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
