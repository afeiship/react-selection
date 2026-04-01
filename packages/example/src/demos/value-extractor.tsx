import ReactSelection from '@jswork/react-selection/src';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'David' },
];

export default ({ value, onChange }: { value: number | null; onChange: (v: number | null) => void }) => (
  <ReactSelection
    value={value}
    valueExtractor="id"
    onChange={onChange}
    data={users}
    slots={{
      item: ({ item, active, onClick }) => (
        <button
          className={`btn btn-sm ${active ? 'btn-primary' : 'btn-default'}`}
          onClick={onClick}>
          {item.name}
        </button>
      ),
    }}
  />
);
