import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, removeCustomer } from './customerThunks';
import { useNavigate } from 'react-router-dom';

const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, loading, page, totalPages } = useSelector(state => state.customer);
  // console.log(list)
   const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({  customer_type: '',
  sms: '',
  whatsapp: '',});
    const [sort, setSort] = useState({ sortBy: 'id', sortOrder: 'DESC' })

    // delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedCustomerId, setSelectedCustomerId] = useState(null);
const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    dispatch(fetchCustomers({ page, search, ...filters, ...sort }));
  }, [dispatch, page, search, filters, sort]);

  const handlePageChange = (newPage) => {
      dispatch(fetchCustomers({ page: newPage, search, ...filters, ...sort }));
    };

      const handleSearch = () => {
        dispatch(fetchCustomers({ page: 1, search, ...filters, ...sort }));
      };
       const handleSearchChange = (e) => setSearch(e.target.value);

       const handleFilterChange = (e) => {
  const updatedFilters = { ...filters, [e.target.name]: e.target.value };
  setFilters(updatedFilters);
  dispatch(fetchCustomers({ page: 1, search, ...updatedFilters, ...sort }));
};
  const handleSortChange = (column) => {
    setSort(prev => ({
      sortBy: column,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }));
  };
const triggerDelete = (id) => {
  setSelectedCustomerId(id);
  setShowDeleteModal(true);
};
  // const handleDelete = async (id) => {
  //   const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
  //   if (confirmDelete) {
  //     ;
  //     try {
  //           await dispatch(removeCustomer(id)).unwrap();
  //           dispatch(fetchCustomers());
  //           alert("Customer deleted successfully.");
  //         } catch (error) {
  //           alert("Failed to delete customer.");
  //         }
  //   }
  // };
const confirmDelete = async () => {
  if (!deleteReason.trim()) {
    alert('Please provide a reason for deleting this customer.');
    return;
  }

  try {
    await dispatch(removeCustomer({ id: selectedCustomerId, reason: deleteReason })).unwrap();
    dispatch(fetchCustomers());
    alert("Customer soft-deleted successfully.");
  } catch (error) {
    alert("Failed to soft-delete customer.");
  } finally {
    setShowDeleteModal(false);
    setDeleteReason('');
    setSelectedCustomerId(null);
  }
};
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customer List</h2>
        <button className="btn btn-primary" onClick={() => navigate('/customers/add')}>
          + Add Customer
        </button>
      </div>
       <div className="d-flex justify-content-between align-items-center my-3">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Search by ID / Name / Place"
    value={search}
    onChange={handleSearchChange}
  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    style={{ maxWidth: '300px' }}
  />
   <div className="mb-3 d-flex gap-3">
        <select name="customer_type" className="form-select w-auto" onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="consigner">Consigner</option>
          <option value="consignee">consignee</option>
        </select>
        <select name="sms" className="form-select w-auto" onChange={handleFilterChange}>
          <option value="">All SMS</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <select name="whatsapp" className="form-select w-auto" onChange={handleFilterChange}>
          <option value="">All Whatsapp</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
      </div>

  <div>
    <button
      className="btn btn-secondary me-2"
      disabled={page === 1}
      onClick={() => handlePageChange(page - 1)}
    >
      Prev
    </button>
    <span>Page {page} of {totalPages}</span>
    <button
      className="btn btn-secondary ms-2"
      disabled={page === totalPages}
      onClick={() => handlePageChange(page + 1)}
    >
      Next
    </button>
  </div>
</div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th onClick={() => handleSortChange('id')}>#</th>
                <th  onClick={() => handleSortChange('name')}>Name</th>
                <th>Primary Phone</th>
                <th>Email</th>
                <th>Place</th>
                <th>Type</th>
                <th>SMS</th>
                <th>WhatsApp</th>
                <th onClick={() => handleSortChange('CreatedAt')}>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? (
                list.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.PrimaryPhoneNumber}</td>
                    <td>{c.email}</td>
                    <td>{c.place || c.place_id || '-'}</td>
                    <td>{c.customer_type || '-'}</td>
                    <td>{c.SendSMSOptIn ? 'Yes' : 'No'}</td>
                    <td>{c.SendWhatsAppOptIn ? 'Yes' : 'No'}</td>
                    <td>{new Date(c.CreatedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => navigate(`/customers/edit/${c.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => triggerDelete(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {showDeleteModal && (
  <div className="modal show d-block" tabIndex="-1">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Reason for Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          <textarea
            className="form-control"
            rows="3"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Enter reason for deleting this customer..."
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Confirm Delete</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
    
  );
};

export default CustomerList;
