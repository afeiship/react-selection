import ReactSelection from '@jswork/react-selection/src';

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'pear', label: 'Pear' },
];

export default ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <ReactSelection
    value={value}
    onChange={onChange}
    data={items}
    slots={{
      item: ({ item, active, onClick }) => (
        <button
          className={`btn btn-sm ${active ? 'btn-primary' : 'btn-default'}`}
          onClick={onClick}>
          {item.label}
        </button>
      ),
    }}
  />
);
