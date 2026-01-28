// pages/AddTransaction.jsx
import React, { useState } from 'react';
import { BASE_URL } from "../../api/config";
import axios from "axios";

const AddTransaction = () => {
  const initialFormState = {
  type: 'Expense',
  amount: '',
  date: '',
  category: '',
  description: '',
  paymentMethod: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  accountNumber: '',
  routingNumber: '',
  bankName: '',
  transactionId: '',
  receipt: null,
};
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    form.append(key, value);
  });

  try {
    await axios.post(`${BASE_URL}/transactions`, form);
    alert('Transaction saved successfully!');
     setFormData(initialFormState);
  } catch (err) {
    console.error(err);
    alert('Error saving transaction');
  }
};

  return (
    <div className="container py-4">
      <h3 className="mb-4 border-bottom pb-2">Add Transaction</h3>

      {/* Toggle Buttons */}
      <div className="btn-group mb-3">
        <button className={`btn ${formData.type === 'Expense' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setFormData({ ...formData, type: 'Expense' })}
        >Expense</button>
        <button className={`btn ${formData.type === 'Income' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setFormData({ ...formData, type: 'Income' })}
        >Income</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Amount</label>
            <input type="number" name="amount" className="form-control" value={formData.amount} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Date</label>
            <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
              <option value="">Select</option>
              <option>Travel</option>
              <option>Salary</option>
              <option>Services</option>
              <option>Others</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Payment Method</label>
            <select name="paymentMethod" className="form-select" value={formData.paymentMethod} onChange={handleChange} required>
              <option value="">Select</option>
              <option>Credit Card</option>
              <option>Bank Transfer</option>
              <option>UPI</option>
              <option>Cash</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Description (Optional)</label>
            <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} rows="2" />
          </div>

          <h5 className="mt-4">Payment Details</h5>

          {/* Credit Card Fields */}
{formData.paymentMethod === 'Credit Card' && (
  <>
    <div className="col-md-6">
      <label className="form-label">Card Number</label>
      <input
        type="text"
        name="cardNumber"
        className="form-control"
        value={formData.cardNumber}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-3">
      <label className="form-label">Expiry Date</label>
      <input
        type="text"
        name="expiryDate"
        className="form-control"
        value={formData.expiryDate}
        onChange={handleChange}
        placeholder="MM/YY"
        required
      />
    </div>
    <div className="col-md-3">
      <label className="form-label">CVV</label>
      <input
        type="text"
        name="cvv"
        className="form-control"
        value={formData.cvv}
        onChange={handleChange}
        required
      />
    </div>
  </>
)}

         {/* Bank Transfer Fields */}
{formData.paymentMethod === 'Bank Transfer' && (
  <>
    <div className="col-md-6">
      <label className="form-label">Account Number</label>
      <input
        type="text"
        name="accountNumber"
        className="form-control"
        value={formData.accountNumber}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Routing Number</label>
      <input
        type="text"
        name="routingNumber"
        className="form-control"
        value={formData.routingNumber}
        onChange={handleChange}
        required
      />
    </div>
    <div className="col-md-6">
      <label className="form-label">Bank Name</label>
      <input
        type="text"
        name="bankName"
        className="form-control"
        value={formData.bankName}
        onChange={handleChange}
        required
      />
    </div>
  </>
)}

          {/* UPI Fields */}
{formData.paymentMethod === 'UPI' && (
  <div className="col-md-6">
    <label className="form-label">Transaction ID</label>
    <input
      type="text"
      name="transactionId"
      className="form-control"
      value={formData.transactionId}
      onChange={handleChange}
      required
    />
  </div>
)}

          <div className="col-12 mt-4">
            <label className="form-label">Attach Receipt/Invoice</label>
            <input type="file" name="receipt" className="form-control" onChange={handleChange} />
          </div>

          <div className="col-12 d-flex justify-content-end mt-4">
            <button type="button" className="btn btn-light me-2">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
