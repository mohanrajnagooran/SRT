import React, { useState, useEffect } from 'react';
import Cards from '../features/miscExpences/Cards';
import FilterTabs from '../features/miscExpences/FilterTabs';
import TransactionsTable from '../features/miscExpences/TransactionsTable';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const AccountsManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const navigate = useNavigate();
   const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/transactions`); // use your actual backend URL
        setTransactions(res.data);
        console.log('Fetched transactions:', res.data);
        
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

  useEffect(() => {
   

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'All') return true;
    return t.type === activeTab;
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h3>Accounts Management</h3>
          <p className="text-muted">Track and manage your daily financial activities.</p>
        </div>
        <button className="btn btn-outline-dark" onClick={() => navigate('/add-transaction')}>
          + Add Transaction
        </button>
      </div>

      <input type="search" className="form-control my-3" placeholder="Search" />

      <h5>Financial Overview</h5>
      <Cards transactions={transactions} />

      <h5 className="mt-4">Recent Transactions</h5>
      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <TransactionsTable transactions={filteredTransactions}  refreshData={fetchTransactions} />
    </div>
  );
};

export default AccountsManagement;
