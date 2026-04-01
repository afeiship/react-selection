import ReactSelection from '@jswork/react-selection/src';

const items = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'pear', label: 'Pear' },
];

export default ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => (
  <ReactSelection
    multiple
    max={3}
    value={value}
    onChange={onChange}
    onError={(err) => console.log('err:', err)}
    data={items}
    slots={{
      item: ({ item, active, disabled, onClick }) => {
        const themeCls = active ? 'btn-primary' : 'btn-default';
        return (
          <button
            disabled={disabled}
            className={`btn btn-sm ${themeCls}`}
            onClick={onClick}>
            {item.label}
          </button>
        );
      },
    }}
  />
);
