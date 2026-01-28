// components/FilterTabs.jsx
const FilterTabs = ({ activeTab, setActiveTab }) => (
  <div className="btn-group my-3">
    {['All', 'Income', 'Expense'].map(tab => (
      <button
        key={tab}
        className={`btn btn-sm ${activeTab === tab ? 'btn-dark' : 'btn-outline-dark'}`}
        onClick={() => setActiveTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default FilterTabs;
