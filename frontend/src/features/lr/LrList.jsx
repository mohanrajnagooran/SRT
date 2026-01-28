import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLrs, removeLr } from './lrThunks';
import { useNavigate } from 'react-router-dom';

function List() {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    const { list, loading, page, totalPages } = useSelector(state => state.lr);
   
    const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ is_cancelled: '', is_unpaid: '' });
  const [sort, setSort] = useState({ sortBy: 'ID', sortOrder: 'DESC' });

   // delete modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
const [selectedLrId, setSelectedLrId] = useState(null);
const [deleteReason, setDeleteReason] = useState('');

    useEffect(() => {
    dispatch(fetchLrs({ page, search, ...filters, ...sort }));
  }, [dispatch, page, search, filters, sort]);

      const handlePageChange = (newPage) => {
    dispatch(fetchLrs({ page: newPage, search, ...filters, ...sort }));
  };

  const handleSearch = () => {
    dispatch(fetchLrs({ page: 1, search, ...filters, ...sort }));
  };
  const handleSearchChange = (e) => setSearch(e.target.value);
   const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
    const handleSortChange = (column) => {
    setSort(prev => ({
      sortBy: column,
      sortOrder: prev.sortOrder === 'ASC' ? 'DESC' : 'ASC'
    }));
  };
  const triggerDelete = (id) => {
  setSelectedLrId(id);
  setShowDeleteModal(true);
};

//     const handleDelete = async (id) => {
//   const confirmDelete = window.confirm("Are you sure you want to delete this LR?");
//   if (confirmDelete) {
//     try {
//       await dispatch(removeLr(id)).unwrap();
//       dispatch(fetchLrs());
//       alert("LR deleted successfully.");
//     } catch (error) {
//       alert("Failed to delete LR.");
//     }
//   }
// };
const fallbackBrowserPrint = (lr) => {
  console.log(lr);
  
  const printWindow = window.open('', '_blank', 'width=850,height=450');

  // Calculate total of article rates
  const total = lr.articles && lr.articles.length > 0 
    ? lr.articles.reduce((acc, article) => acc + (Number(article.rate) || 0), 0) 
    : 0;

    // convert date in to dd/mm/yyyy format
    let date = new Date(lr.date);
    let day = String(date.getDate()).padStart(2, '0');
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    let year = date.getFullYear();
    let formattedDate = `${day}/${month}/${year}`;
  // Calculate article rows top positions starting at 5.8 cm, each +0.5 cm per article
  const articlesHtml = (lr.articles && lr.articles.length > 0)
    ? lr.articles.map((article, index) => {
        const topPos = 5.8 + index * 0.5; // starting 5.8 cm, increment 0.5 cm per row
        return `
          <span style="position:absolute; left:1.2cm; top:${topPos}cm; height:0.5cm; width:1cm; font-size:15px;">
            ${Number(article.qty)}
          </span>
          <span style="position:absolute; left:3cm; top:${topPos}cm; height:0.5cm; width:14cm; font-size:15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
            ${article.product_name || ''}
          </span>
          <span style="position:absolute; left:18cm; top:${topPos}cm; height:0.5cm; width:2cm; font-size:15px;">
            ${article.rate}
          </span>
        `;
      }).join('')
    : `
      <span style="position:absolute; left:3cm; top:5.8cm; height:0.5cm; width:19cm; font-size:12px;">
        No articles found
      </span>
    `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Print LR</title>
      <style>
        @page {
          margin: 0;
          size: 21cm 9.9cm landscape;
        }
        body {
          font-family: Arial, sans-serif;
          width: 21cm;
          height: 9.9cm;
          margin: 0;
          padding: 0;
          position: relative;
          font-size: 15px;
          box-sizing: border-box;
        }
        .print-field {
          position: absolute;
          font-size: 15px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      </style>
    </head>
    <body>
      <!-- LR Number -->
      <span class="print-field" style="left:17.4cm; top:0.6cm; width:2.5cm; height:0.5cm;">
        ${lr.ID || ''}
      </span>

      <!-- Date -->
      <span class="print-field" style="left:17.4cm; top:1.5cm; width:2.5cm; height:0.5cm;">
        ${formattedDate }
      </span>

      <!-- Consignor Name -->
      <span class="print-field" style="left:2.5cm; top:2.7cm; width:10cm; height:0.5cm;">
        ${lr.consigner || ''}
      </span>

      <!-- Consignor Place -->
      <span class="print-field" style="left:2.5cm; top:3.2cm; width:10cm; height:0.5cm;">
        ${lr.consigner_place || ''}
      </span>

      <!-- Consignee Name -->
      <span class="print-field" style="left:12.3cm; top:2.5cm; width:7.7cm; height:0.5cm;">
        ${lr.consignee || ''}
      </span>

      <!-- Consignee Place -->
      <span class="print-field" style="left:12.3cm; top:3cm; width:7.7cm; height:0.5cm;">
        ${lr.consignee_place || ''}
      </span>

      <!-- Paid Detail -->
      <span class="print-field" style="left:18cm; top:4.9cm; width:2cm; height:0.5cm;">
        ${lr.to_pay || ''}
      </span>

      <!-- Articles as individual absolute spans -->
      ${articlesHtml}

      <!-- Total -->
      <span class="print-field" style="left:18cm; top:8.7cm; width:2cm; height:0.5cm;">
        ${total.toFixed(2)}
      </span>

      <!-- B.No -->
      <span class="print-field" style="left:3.8cm; top:8cm; width:2cm; height:0.5cm;">
        ${lr.bale_no || ''}
      </span>

      <script>
        window.onload = () => {
          window.focus();
          window.print();
          window.close();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.onload = () => {
  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, 300);
};
};
const confirmDelete = async () => {
  if (!deleteReason.trim()) {
    alert('Please provide a reason for deleting this LR.');
    return;
  }

  try {
    await dispatch(removeLr({ id: selectedLrId, reason: deleteReason })).unwrap();
    dispatch(fetchLrs());
    alert("LR soft-deleted successfully.");
  } catch (error) {
    alert("Failed to soft-delete LR.");
  } finally {
    setShowDeleteModal(false);
    setDeleteReason('');
    setSelectedLrId(null);
  }
};

  return (
    <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>LR List</h2>
            <button className="btn btn-primary" onClick={() => navigate('/lrs/report')}>
              LR Report
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/lrs/deliverlr')}>
              Deliver LR 
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/lrs/cancellr')}>
              Cancel LR
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/lrs/add')}>
              + Create LR
            </button>
          </div>
          <div className="d-flex justify-content-between align-items-center my-3">
  <input
    type="text"
    className="form-control me-2"
    placeholder="Search by ID / Consigner / Consignee"
    value={search}
    onChange={handleSearchChange}
  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
    style={{ maxWidth: '300px' }}
  />
   <div className="mb-3 d-flex gap-3">
        <select name="is_cancelled" className="form-select w-auto" onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="1">Cancelled</option>
          <option value="0">Not Cancelled</option>
        </select>
        <select name="is_unpaid" className="form-select w-auto" onChange={handleFilterChange}>
          <option value="">All Payment</option>
          <option value="1">Unpaid</option>
          <option value="0">Paid</option>
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
            <div className="table-sm">
              <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark">
                  <tr>
                     <th onClick={() => handleSortChange('ID')}>#</th>
                <th onClick={() => handleSortChange('consigner')}>Consigner</th>
                <th onClick={() => handleSortChange('consignee')}>Consignee</th>
                    <th>Paid</th>
                    <th>Date</th>
                    <th>Consigner_place</th>
                    <th>Consignee_place</th>
                    <th>Total</th>
                    <th>Articles_count</th>
                    <th>Delivered</th>
                    <th>Is_cancelled</th>
                    <th>Is_unpaid</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.length > 0 ? (
                    list.map((c, index) => (
                      <tr key={c.ID}>
                        <td>{index + 1}</td>
                        <td>{c.consigner || c.Consigner}</td>
                        <td>{c.consignee || c.Consignee}</td>
                        <td>{c.paid}</td>
                        <td>{c.date }</td>
                        <td>{c.consigner_place }</td>
                        <td>{c.consignee_place }</td>
                        <td>{c.total }</td>
                        <td>{c.articles_count }</td>
                        <td>{c.delivered }</td>
                        <td>{c.is_cancelled }</td>
                        <td>{c.is_unpaid }</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => navigate(`/lrs/edit/${c.ID}`)}
                          >
                            Edit 
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => triggerDelete(c.ID)}
                          >
                            Delete
                          </button>
                          <button
    className="btn btn-sm btn-outline-primary"
    onClick={() => fallbackBrowserPrint(c)}
  >
    Print
  </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">No articles found.</td>
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
            placeholder="Enter reason for deleting this LR..."
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
}

export default List;

