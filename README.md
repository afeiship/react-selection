# react-selection
> Selection component for react.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install -S @jswork/react-selection
```

## usage
1. import css
  ```scss
  @import "~@jswork/react-selection/dist/style.css";

  // or use sass
  @import "~@jswork/react-selection/dist/style.scss";
  ```
2. import js
  ```js
  import ReactSelection from '@jswork/react-selection';
  import './index.css';
  import '@jswork/react-selection/dist/style.scss';
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
        <div className="mockup-code">
          <pre><code>{JSON.stringify(json)}</code></pre>
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
            className="x-4 *:bg-gray-400 *:rounded-md *:p-2 cursor-pointer" />
        </div>
        <div className="y-2">
          <h3>Single Selection + reversible(v2)</h3>
          <ReactSelection
            reversible
            value={v2}
            onChange={(e) => {
              setV2(e);
              setJson({ ...json, v2: e });
            }}
            items={items}
            className="x-4 *:bg-gray-400 *:rounded-md *:p-2 cursor-pointer" />
        </div>
        <div className="y-2">
          <h3>Multiple Selection(v3, max:3)</h3>
          <ReactSelection
            value={v3}
            max={3}
            onChange={(e) => {
              setV3(e);
              setJson({ ...json, v3: e });
            }}
            onError={(err) => {
              console.log('err:', err);
            }}
            items={items}
            multiple
            className="x-4 *:bg-slate-400 *:rounded-md *:px-2 *:py-1 cursor-pointer" />
        </div>
      </div>
    );
  }

  export default App;
  ```

## preview
- https://afeiship.github.io/react-selection/

## license
Code released under [the MIT license](https://github.com/afeiship/react-selection/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/react-selection
[version-url]: https://npmjs.org/package/@jswork/react-selection

[license-image]: https://img.shields.io/npm/l/@jswork/react-selection
[license-url]: https://github.com/afeiship/react-selection/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/react-selection
[size-url]: https://github.com/afeiship/react-selection/blob/master/dist/react-selection.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/react-selection
[download-url]: https://www.npmjs.com/package/@jswork/react-selection
