import './index.css';
import { useState } from 'react';
import SingleSelection from './demos/single-selection';
import AllowDeselect from './demos/allow-deselect';
import MultipleSelection from './demos/multiple-selection';
import ValueExtractor from './demos/value-extractor';

function App() {
  const [v1, setV1] = useState('apple');
  const [v2, setV2] = useState<string | null>('grape');
  const [v3, setV3] = useState(['banana', 'orange']);
  const [v4, setV4] = useState<number | null>(1);
  const json = { v1, v2, v3, v4 };

  return (
    <div className="m-10 p-4 y-5 shadow bg-gray-100 text-gray-800 hover:shadow-md transition-all">
      <div className="badge badge-warning absolute right-0 top-0 m-4">Build Time: {BUILD_TIME}</div>
      <h1>react-selection</h1>
      <div className="mockup-code">
        <pre>
          <code>{JSON.stringify(json)}</code>
        </pre>
      </div>
      <div className="y-2">
        <h3>Single Selection(v1)</h3>
        <div className="x-3">
          <SingleSelection value={v1} onChange={setV1} />
        </div>
      </div>
      <div className="y-2">
        <h3>Single Selection + allowDeselect(v2)</h3>
        <div className="x-3">
          <AllowDeselect value={v2} onChange={setV2} />
        </div>
      </div>
      <div className="y-2">
        <h3>Multiple Selection(v3, max:3)</h3>
        <div className="x-3">
          <MultipleSelection value={v3} onChange={setV3} />
        </div>
      </div>
      <div className="y-2">
        <h3>valueExtractor(v4)</h3>
        <div className="x-3">
          <ValueExtractor value={v4} onChange={setV4} />
        </div>
      </div>
    </div>
  );
}

export default App;
