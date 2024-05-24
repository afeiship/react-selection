import ReactSelection from '@jswork/react-selection/src';
import './index.css';
import '@jswork/react-selection/src/style.scss';
import { useState } from 'react';

function App() {
  const [v1, setV1] = useState('apple');
  const [v3, setV3] = useState('apple');
  const [v2, setV2] = useState(['banana', 'orange']);
  const items = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'pear', label: 'Pear' },
  ];
  return (
    <div className="m-10 p-4 y-5 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">
        Build Time: {BUILD_TIME}
      </div>
      <h1>react-selection</h1>
      <div className="y-2">
        <h3>Single Selection</h3>
        <ReactSelection
          value={v1}
          onChange={(e) => {
            setV1(e);
            console.log('selected value: ', e);
          }}
          items={items}
          className="x-4 *:bg-gray-400 *:rounded-md *:p-2 cursor-pointer" />
      </div>
      <div className="y-2">
        <h3>Single Selection + checkAble</h3>
        <ReactSelection
          checkAble
          value={v3}
          onChange={(e) => {
            setV3(e);
            console.log('selected value: ', e);
          }}
          items={items}
          className="x-4 *:bg-gray-400 *:rounded-md *:p-2 cursor-pointer" />
      </div>
      <div className="y-2">
        <h3>Multiple Selection</h3>
        <ReactSelection
          value={v2}
          onChange={(e) => {
            setV2(e);
            console.log('selected values: ', e);
          }}
          items={items}
          multiple
          className="x-4 *:bg-slate-400 *:rounded-md *:px-2 *:py-1 cursor-pointer" />
      </div>
    </div>
  );
}

export default App;
