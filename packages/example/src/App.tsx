import ReactSelection from '@jswork/react-selection/src';
import { TemplateArgs } from '@jswork/react-list';
import './index.css';
import '@jswork/react-selection/src/style.scss';
import { useState } from 'react';

function App() {
  const [v1, setV1] = useState('apple');
  const [v2, setV2] = useState('grape');
  const [v3, setV3] = useState(['banana', 'orange']);
  const [json, setJson] = useState({
    v1: 'apple',
    v2: 'grape',
    v3: ['banana', 'orange'],
  });

  const template = ({ item, options }: TemplateArgs) => {
    const themeCls = options?.active ? 'btn-primary' : 'btn-default';
    return (
      <button
        key={item.value}
        className={`btn btn-sm ${themeCls}`}
        onClick={options?.cb}>
        {item.label}
      </button>
    );
  };

  const items = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'pear', label: 'Pear' },
  ];
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
        <ReactSelection
          value={v1}
          onChange={(e) => {
            setV1(e);
            setJson({ ...json, v1: e });
          }}
          items={items}
          template={template}
          className="x-4 cursor-pointer"
        />
      </div>
      <div className="y-2">
        <h3>Single Selection + allowDeselect(v2)</h3>
        <ReactSelection
          allowDeselect
          value={v2}
          onChange={(e) => {
            setV2(e);
            setJson({ ...json, v2: e });
          }}
          items={items}
          template={template}
          className="x-4  cursor-pointer"
        />
      </div>
      <div className="y-2">
        <h3>Multiple Selection(v3, max:3)</h3>
        <ReactSelection
          className="x-4"
          value={v3}
          max={3}
          onChange={(e) => {
            setV3(e);
            setJson({ ...json, v3: e });
          }}
          onError={(err) => console.log('err:', err)}
          items={items}
          template={({ item, options }: TemplateArgs) => {
            const themeCls = options?.active ? 'btn-primary' : 'btn-default';
            return (
              <button
                key={item.value}
                disabled={options?.disabled}
                className={`btn btn-sm ${themeCls}`}
                onClick={options?.cb}>
                {item.label}
              </button>
            );
          }}
          multiple
        />
      </div>
    </div>
  );
}

export default App;
