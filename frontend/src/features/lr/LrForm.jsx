import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addLr, editLr } from "./lrThunks";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../api/config";
import Select from "react-select";

function LrForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [articlesList, setArticlesList] = useState([]);
  const [consignerPlaces, setConsignerPlaces] = useState([]);
  const [consigneePlaces, setConsigneePlaces] = useState([]);
  const [customersList, setCustomersList] = useState([]);

  const [consignerList, setConsignerList] = useState([]);
  const [consigneeList, setConsigneeList] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleCount, setArticleCount] = useState(1);
  const [selectedPrefix, setSelectedPrefix] = useState(null);
  const [routePrefixes, setRoutePrefixes] = useState([]);
  const [formData, setFormData] = useState({
    article: [],
    billingType: "Paid",
    amount: "",
    lrno: "",
    prefix: "",
    consigner: "",
    consignee: "",
    paid: "",
    crossing: "",
    date: new Date().toISOString().split("T")[0],
    accounting_year: "",
    travel_code: "",
    consigner_place: "",
    consignee_place: "",
    total: "",
    priority: "",
    bale_no: "",
    consigner_id: "",
    consignee_id: "",
    maatral_set: "",
    delivered: "",
    id_only_no: "",
    include_unloading_charges: "false",
    is_unpaid: "",
    is_cancelled: "",
    from_transport: "",
    from_transport_id: "",
  });

  // calculate amount from articles
  useEffect(() => {
  console.log("Articles for calculation:", formData.article); // 👈 DEBUG

  const total = formData.article.reduce((sum, art) => {
    const rate = parseFloat(art.final_rate
 || 0);
    const count = parseFloat(art.count || 0);

    console.log("Rate:", art.rate, "Count:", art.count, "Subtotal:", rate * count); // 👈 DEBUG

    return sum + rate * count;
  }, 0);

  console.log("Total Amount:", total); // 👈 DEBUG

  setFormData((prev) => ({
    ...prev,
    amount: total,
  }));
}, [formData.article]);


 // calculate total incl. crossing
useEffect(() => {
  const amountNum = parseFloat(formData.amount) || 0;
  const crossingNum = parseFloat(formData.crossing) || 0;

  setFormData((prev) => ({
    ...prev,
    total: crossingNum ? amountNum + crossingNum : amountNum
  }));
}, [formData.amount, formData.crossing]);

 
//   useEffect(() => {
//   axios.get(`${BASE_URL}/route-prefix`)
//     .then((res) => {
//       const options = res.data.map(p => ({
//         value: p.prefix_code,
//         label: p.prefix_code
//       }));
//       setRoutePrefixes(options);
//     })
//     .catch(err => console.error("Error loading route prefixes", err));
// }, []);

 // fetch customers
  useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/customers/page`);
      console.log("Fetched Customers:", response.data);
      
      setCustomersList(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  fetchCustomers();
}, []);


// useEffect(() => {
//   if (!customersList.length || !selectedPrefix) {
//     setConsignerList([]);
//     setConsigneeList([]);
//     setConsignerPlaces([]);
//     setConsigneePlaces([]);
//     return;
//   }
//   // console.log("All Customers:", customersList);

//   const prefixValue = selectedPrefix.value;

//   // Filter by prefix + type
//   const filteredConsigners = customersList.filter(
//   (c) =>
//     c.customer_type === "consigner" &&
//     c.prefix === selectedPrefix?.value
// );

// const filteredConsignees = customersList.filter(
//   (c) =>
//     c.customer_type === "consignee" &&
//     c.prefix === selectedPrefix?.value
// );

// // console.log("Selected Prefix:", selectedPrefix);
// // console.log("Filtered Consigners:", filteredConsigners);
// // console.log("Filtered Consignees:", filteredConsignees);

//   // Extract unique places
//   const consignerPlaceOptions = [
//     ...new Set(filteredConsigners.map((c) => c.place)),
//   ];
//   const consigneePlaceOptions = [
//     ...new Set(filteredConsignees.map((c) => c.place)),
//   ];

//   // Set lists and places
//   setConsignerList(filteredConsigners);
//   setConsigneeList(filteredConsignees);
//   setConsignerPlaces(consignerPlaceOptions);
//   setConsigneePlaces(consigneePlaceOptions);
// }, [customersList, selectedPrefix]);

 // load consigner/consignee places without prefix filtering
 // load consigner/consignee places 
 useEffect(() => {
    if (!customersList.length) return;
    const consignerPlaceOptions = [...new Set(customersList.filter(c => c.customer_type === "Consigner").map(c => c.place))];
    const consigneePlaceOptions = [...new Set(customersList.filter(c => c.customer_type === "Consignee").map(c => c.place))];
    // console.log("Consigner Places:", consignerPlaceOptions);
    console.log("Consignee Places:", consigneePlaceOptions);
    
    setConsignerPlaces(consignerPlaceOptions);
    setConsigneePlaces(consigneePlaceOptions);
    setConsignerList(customersList.filter(c => c.customer_type === "Consigner"));
    setConsigneeList(customersList.filter(c => c.customer_type === "Consignee"));
  }, [customersList]);

   // load prefixes based on consignee_place
  useEffect(() => {
    if (!formData.consignee_place) {
      setRoutePrefixes([]);
      return;
    }
    console.log("Fetching Route Prefixes for Place:", formData.consignee_place);
    axios.get(`${BASE_URL}/route-prefix/by-place`,{
      params: { placeName: formData.consignee_place }
    })
      .then((res) => {
      console.log("Fetched Route Prefixes by Place:", res.data);
        if (res.data.length === 0) {
        setRoutePrefixes([]);
        alert("No prefix match for consignee place. Please add consignee place in any prefix route.");
      } else {
        console.log("Fetched Route Prefixes:", res.data);
        
        setRoutePrefixes(res.data.map(p => ({
          value: p.prefix_code,
          label: p.prefix_code
        })));
      }
    })
    .catch(err => {
      console.error("Error loading route prefixes", err);
    });
  }, [formData.consignee_place]);
  
// load existing LR for editing
  useEffect(() => {
    if (id) {
      axios
        .get(`${BASE_URL}/lrs/${id}`)
        .then((res) => {
          console.log("Fetched Lr Data:", res.data);
          const data = res.data;

          const updateData = {
            ...data,
            article: data.article || [],
          };

          setFormData(updateData);
        })
        .catch((err) => console.error("Error fetching lrs:", err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddArticle = () => {
    console.log("Adding Article:", selectedArticle, articleCount);

    if (!selectedArticle || !articleCount) return;

    const article = selectedArticle.article;
    // console.log('Selected Article:', article);
    const alreadyExists = formData.article.some(
      (a) => a.article_id === article.article_id
    );
    if (alreadyExists) return;

    const articleWithCount = {
      ...article,
      count: articleCount,
    };

    setFormData((prev) => ({
      ...prev,
      article: [...prev.article, articleWithCount],
    }));

    setSelectedArticle(null);
    setArticleCount("");
  };

  const handleRemoveArticle = (index) => {
    setFormData((prev) => ({
      ...prev,
      article: prev.article.filter((_, i) => i !== index),
    }));
  };
  const handlePrefixChange = (selected) => {
    setSelectedPrefix(selected);
    setFormData((prev) => ({ ...prev, prefix: selected ? selected.value : "" }));
  };

  
  
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Articles before validation:", formData.article);
// Validate articles before submit
  const hasValidArticle = Array.isArray(formData.article) &&
  formData.article.some(article => {
    const count = parseInt(article.count, 10);
    return !isNaN(count) && count > 0;
  });

  if (!hasValidArticle) {
    alert("Please add at least one article with a count greater than 0 before submitting.");
    return;
  }

  try {
    if (!id) {
     const savedLr = await dispatch(addLr(formData)).unwrap();

if (!savedLr || !savedLr.lr) {
  console.error("No LR returned from server.");
  return;
}

const lr = {
  ...savedLr.lr,
  articles: Array.isArray(savedLr.articles) ? savedLr.articles : [],
};

console.log("Saved LR with Articles:", lr);


      if (window.printer && typeof window.printer.printReceipt === 'function') {
  console.log("🖨️ Sending to printer...");
  window.printer.printReceipt(lr);
} else {
  console.warn("⚠️ window.printer.printReceipt not available");
  fallbackBrowserPrint(lr);
}
    } else {
      await dispatch(editLr({ id, data: formData })).unwrap();
    }
    navigate('/lrs');
  } catch (err) {
    console.error('Error saving LR:', err);
  }
};



  const fetchArticlesByCustomerId = async (customerId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/articles/${customerId}/articles`
      );
      console.log("Fetched Articles for Customer:", response.data);

      setArticlesList(response.data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
  };

  // web print
//   const fallbackBrowserPrint = (lr) => {
//   const printWindow = window.open('', '_blank', 'width=800,height=600');

//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <title>Print LR</title>
//       <style>
//         body {
//           font-family: Arial, sans-serif;
//           width: 210mm;
//           height: 99mm;
//           margin: 0;
//           padding: 10mm;
//           font-size: 12px;
//         }
//         .lr-header {
//           display: flex;
//           justify-content: space-between;
//           border-bottom: 1px solid #000;
//         }
//         .lr-body {
//           margin-top: 10px;
//         }
//         .article-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 10px;
//         }
//         .article-table th, .article-table td {
//           border: 1px solid black;
//           padding: 4px;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="lr-header">
//         <div><strong>LR No:</strong> <span id="lr-id">${lr.ID}</span></div>
//         <div><strong>Date:</strong> <span id="lr-date">${lr.date}</span></div>
//       </div>

//       <div class="lr-body">
//         <p><strong>From:</strong> <span id="lr-from">${lr.consigner_place}</span></p>
//         <p><strong>To:</strong> <span id="lr-to">${lr.consignee_place}</span></p>
//         <p><strong>Consigner:</strong> <span id="lr-consigner">${lr.consigner}</span></p>
//         <p><strong>Consignee:</strong> <span id="lr-consignee">${lr.consignee}</span></p>
        
//         <table class="article-table">
//           <thead>
//             <tr>
//               <th>Article</th>
//               <th>Qty</th>
//               <th>Rate</th>
//               <th>Kooli</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody id="article-rows">
//             ${
//               lr.articles && lr.articles.length > 0
//                 ? lr.articles.map(article => `
//                   <tr>
//                     <td>${article.product_name}</td>
//                     <td>${article.qty}</td>
//                     <td>${article.rate}</td>
//                     <td>${article.kooli}</td>
//                   </tr>
//                 `).join('')
//                 : '<tr><td colspan="5">No articles found</td></tr>'
//             }
//           </tbody>
//         </table>

//       </div>

//       <script>
//         window.onload = function () {
//           window.print();
//           window.close();
//         };
//       </script>
//     </body>
//     </html>
//   `;

//   printWindow.document.open();
//   printWindow.document.write(htmlContent);
//   printWindow.document.close();
// };
const fallbackBrowserPrint = (lr) => {
  // Try to open the print window
  const printWindow = window.open('', '_blank', 'width=850,height=450');

  // If blocked or failed
  if (!printWindow) {
    alert("Unable to open print window. Please allow popups for this site.");
    return;
  }

  // // Calculate total
  // const total = lr?.articles?.length
  //   ? lr.articles.reduce((acc, article) => acc + (Number(article.rate) || 0), 0)
  //   : 0;

  // Format date
  const dateObj = new Date(lr.date);
  const formattedDate = [
    String(dateObj.getDate()).padStart(2, '0'),
    String(dateObj.getMonth() + 1).padStart(2, '0'),
    dateObj.getFullYear()
  ].join('/');

  // Build article rows
  const articlesHtml = lr?.articles?.length
    ? lr.articles.map((article, index) => {
        const topPos = 5.8 + index * 0.5;
        return `
          <span style="position:absolute; left:1.2cm; top:${topPos}cm; font-size:15px;">
            ${Number(article.qty)}
          </span>
          <span style="position:absolute; left:3cm; top:${topPos}cm; width:14cm; font-size:15px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
            ${article.product_name || ''}
          </span>
          <span style="position:absolute; left:18cm; top:${topPos}cm; font-size:15px;">
            ${article.rate * article.qty}
          </span>
        `;
      }).join('')
    : `<span style="position:absolute; left:3cm; top:5.8cm; font-size:12px;">No articles found</span>`;

  // HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Print LR</title>
      <style>
        @page { margin: 0; size: 21cm 9.9cm landscape; }
        body { font-family: Arial, sans-serif; width: 21cm; height: 9.9cm; margin: 0; padding: 0; position: relative; font-size: 15px; }
        .print-field { position: absolute; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      </style>
    </head>
    <body>
      <span class="print-field" style="left:17.4cm; top:0.6cm;">${lr.ID || ''}</span>
      <span class="print-field" style="left:17.4cm; top:1.5cm;">${formattedDate}</span>
      <span class="print-field" style="left:2.5cm; top:2.7cm;">${lr.consigner || ''}</span>
      <span class="print-field" style="left:2.5cm; top:3.2cm;">${lr.consigner_place || ''}</span>
      <span class="print-field" style="left:12.3cm; top:2.7cm;">${lr.consignee || ''}</span>
      <span class="print-field" style="left:12.3cm; top:3.2cm;">${lr.consignee_place || ''}</span>
      <span class="print-field" style="left:18cm; top:4.5cm;">${lr.to_pay || ''}</span>
      ${articlesHtml}

      ${
          lr.consignee_place 
            ? `<span class="print-field" style="left:11cm; top:6cm;">Upto ${lr.consignee_place}</span>` 
            : ""
        }
      ${
          lr.from_transport 
            ? `<span class="print-field" style="left:14cm; top:7.5cm;">${lr.from_transport} crossing</span>` 
            : ""
        }
        ${
          lr.crossing 
            ? `<span class="print-field" style="left:18cm; top:7.5cm;">${lr.crossing}</span>` 
            : ""
        }
      ${
          lr.include_unloading_charges 
            ? `<span class="print-field" style="left:10cm; top:8.7cm;">Including Unload Charges*</span>` 
            : ""
        }
      <span class="print-field" style="left:18cm; top:8.7cm;">${lr.total}</span>
      <span class="print-field" style="left:3.7cm; top:8.3cm;">${lr.bale_no || ''}</span>
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.focus();
            window.print();
            window.close();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  // Write content to the print window
  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};



  return (
    <div className="container mt-4">
      <h2 className="mb-4">{id ? "Edit" : "Create"} Lr</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-4 rounded shadow-sm bg-light"
      >
        <div className="mb-4">
          <h5 className="mb-3 text-primary">LR Basic Details</h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Date</label>
              <input
                name="date"
                type="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="col-md-3 mb-3">
              <label className="form-label">LR No</label>
              <input
                name="lrno"
                className="form-control"
                value={formData.lrno}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">From Transport</label>
              <input
                name="from_transport"
                className="form-control"
                value={formData.from_transport}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <hr />

        <div className="mb-4">
          <h5 className="mb-3 text-primary">Consigner / Consignee Details</h5>
          <div className="row">
            {/* Consigner Place */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Consigner Place</label>
              <Select
                options={consignerPlaces.map((p) => ({ label: p, value: p }))}
                value={
                  formData.consigner_place
                    ? {
                        label: formData.consigner_place,
                        value: formData.consigner_place,
                      }
                    : null
                }
                onChange={(selected) => {
                  const selectedPlace = selected?.value || "";
                  setFormData((prev) => ({
                    ...prev,
                    consigner_place: selectedPlace,
                    consigner: "",
                    consigner_id: "",
                  }));
                }}
                placeholder="Select Consigner Place"
                isClearable
              />
            </div>

            {/* Consignee Place */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Consignee Place</label>
              <Select
                options={consigneePlaces.map((p) => ({ label: p, value: p }))}
                value={
                  formData.consignee_place
                    ? {
                        label: formData.consignee_place,
                        value: formData.consignee_place,
                      }
                    : null
                }
                onChange={(selected) => {
                  const selectedPlace = selected?.value || "";
                  setFormData((prev) => ({
                    ...prev,
                    consignee_place: selectedPlace,
                    consignee: "",
                    consignee_id: "",
                  }));
                }}
                placeholder="Select Consignee Place"
                isClearable
              />
            </div>

            {/* Consigner */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Consigner</label>
              <Select
                options={consignerList
                  .filter((c) => c.place === formData.consigner_place)
                  .map((c) => ({ label: c.name, value: c.name, id: c.id }))}
                value={
                  formData.consigner
                    ? { label: formData.consigner, value: formData.consigner }
                    : null
                }
                onChange={(selected) => {
                  const selectedConsigner = consignerList.find(
                    (c) => c.name === selected?.value
                  );
                  if (!selectedConsigner) return;

                  setFormData((prev) => ({
                    ...prev,
                    consigner: selectedConsigner.name,
                    consigner_id: selectedConsigner.id,
                  }));

                  // Fetch articles for selected consigner
                  fetchArticlesByCustomerId(selectedConsigner.id);
                }}
                placeholder="Select Consigner"
                isClearable
              />
            </div>

            {/* Consignee */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Consignee</label>
              <Select
                options={consigneeList
                  .filter((c) => c.place === formData.consignee_place)
                  .map((c) => ({ label: c.name, value: c.name, id: c.id }))}
                value={
                  formData.consignee
                    ? { label: formData.consignee, value: formData.consignee }
                    : null
                }
                onChange={(selected) => {
                  const selectedConsignee = consigneeList.find(
                    (c) => c.name === selected?.value
                  );
                  if (!selectedConsignee) return;

                  setFormData((prev) => ({
                    ...prev,
                    consignee: selectedConsignee.name,
                    consignee_id: selectedConsignee.id,
                  }));
                }}
                placeholder="Select Consignee"
                isClearable
              />
            </div>
          </div>

          {/* Article Selection */}
          <div className="row mb-3">
            <div className="col-md-5">
              <label className="form-label">Select Article</label>
              <Select
                options={articlesList.map((a) => ({
                  label: a.article_name,
                  value: a.article_id,
                  article: a, // Send full article object
                }))}
                value={selectedArticle}
                onChange={(option) => setSelectedArticle(option)}
                placeholder="Search and select article"
                isClearable
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Count</label>
              <input
                type="number"
                className="form-control"
                value={articleCount}
                onChange={(e) => setArticleCount(e.target.value)}
                onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAddArticle();
        }}}
              />
            </div>

            <div className="col-md-2 d-flex align-items-end">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddArticle}
              >
                + Add Article
              </button>
            </div>
          </div>

          {/* Article Table */}
          {formData.article.length > 0 && (
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-sm align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Rate</th>
                    <th>Kooli</th>
                    <th>Unload Charges</th>
                    <th>Count</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.article.map((art, i) => (
                    <tr key={i}>
                      <td>{art.article_name || art.product_name}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={art.final_rate === "" ? 0 : art.final_rate || art.rate}
                          onFocus={(e) => {
        if (e.target.value === "0") {
          e.target.value = ""; // clear if 0
        } else {
          e.target.select(); // select all so typing replaces
        }
      }}
      onBlur={(e) => {
        if (e.target.value === "") {
          e.target.value = "0"; // restore 0 if left empty
        }
      }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.article];
                              updated[i].final_rate = value;
                              return { ...prev, article: updated };
                            });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={art.final_kooli || art.kooli}
                          onFocus={(e) => {
        if (e.target.value === "0") {
          e.target.value = ""; // clear if 0
        } else {
          e.target.select(); // select all so typing replaces
        }
      }}
      onBlur={(e) => {
        if (e.target.value === "") {
          e.target.value = "0"; // restore 0 if left empty
        }
      }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.article];
                              updated[i].final_kooli = value;
                              return { ...prev, article: updated };
                            });
                          }}
                        />
                      </td>
                      {/* <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={art.final_speed}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.article];
                              updated[i].final_speed = value;
                              return { ...prev, article: updated };
                            });
                          }}
                        />
                      </td> */}
                      <td>
  <input
    type="number"
    className="form-control form-control-sm"
    value={art.final_unloadcharges || art.unloadcharges || 0}
    onFocus={(e) => {
        if (e.target.value === "0") {
          e.target.value = ""; // clear if 0
        } else {
          e.target.select(); // select all so typing replaces
        }
      }}
      onBlur={(e) => {
        if (e.target.value === "") {
          e.target.value = "0"; // restore 0 if left empty
        }
      }}
    onChange={(e) => {
      const value = e.target.value;
      setFormData((prev) => {
        const updated = [...prev.article];
        updated[i].final_unloadcharges = value;
        return { ...prev, article: updated };
      });
    }}
  />
</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={art.count || Number(art.qty)}
                          onFocus={(e) => {
        if (e.target.value === "0") {
          e.target.value = ""; // clear if 0
        } else {
          e.target.select(); // select all so typing replaces
        }
      }}
      onBlur={(e) => {
        if (e.target.value === "") {
          e.target.value = "0"; // restore 0 if left empty
        }
      }}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => {
                              const updated = [...prev.article];
                              updated[i].count = value;
                              return { ...prev, article: updated };
                            });
                          }}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveArticle(i)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <hr />

        <div className="mb-4">
          <h5 className="mb-3 text-primary">Billing & Charges</h5>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label className="form-label">Prefix</label>
              <Select
  options={routePrefixes}
  value={selectedPrefix}
  onChange={handlePrefixChange}
  placeholder="Select a Prefix"
  isClearable
  required
/>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Amount</label>
              <input
                name="amount"
                className="form-control"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Crossing</label>
              <input
                name="crossing"
                className="form-control"
                value={formData.crossing}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Total</label>
              <input
                name="total"
                className="form-control"
                value={formData.total}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Bale No</label>
              <input
                name="bale_no"
                className="form-control"
                value={formData.bale_no}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3 form-check">
  <input
    className="form-check-input"
    type="checkbox"
    name="include_unloading_charges"
    checked={formData.include_unloading_charges === "true"}
    onChange={(e) =>
      setFormData({
        ...formData,
        include_unloading_charges: e.target.checked ? "true" : "false",
      })
    }
  />
  <label className="form-check-label">
    Include Unloading Charges
  </label>
</div>


            <div className="col-md-4 mb-3">
              <label>Billing Type</label>
              <br />
              <label>
                <input
                  type="radio"
                  name="billingType"
                  value="Paid"
                  checked={formData.billingType === "Paid"}
                  onChange={handleChange}
                />{" "}
                Paid
              </label>
              <label className="ms-2">
                <input
                  type="radio"
                  name="billingType"
                  value="ToPay"
                  checked={formData.billingType === "ToPay"}
                  onChange={handleChange}
                />{" "}
                To Pay
              </label>
              <label className="ms-2">
                <input
                  type="radio"
                  name="billingType"
                  value="Rpaid"
                  checked={formData.billingType === "Rpaid"}
                  onChange={handleChange}
                />{" "}
                RPaid
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? "Update" : "Create"} LR
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/lrs")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default LrForm;
