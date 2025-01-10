import React, { useState } from "react";
import axios from "axios";
//import './App.css';

function App() {
  const [flaggedTransactions, setFlaggedTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFlaggedTransactions(response.data.suspicious_transactions || []);
      setChartData(response.data.chart_data || []);
      setError(null);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload the file. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Suspicious Transactions Dashboard</h1>
      <input type="file" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <h2>Flagged Transactions</h2>
      {flaggedTransactions.length > 0 ? (
        <table border="1" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Account ID</th>
            </tr>
          </thead>
          <tbody>
            {flaggedTransactions.map((tx) => (
              <tr key={tx.transaction_id}>
                <td>{tx.transaction_id}</td>
                <td>{tx.amount}</td>
                <td>{tx.account_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No suspicious transactions detected.</p>
      )}

      <h2>Chart Data</h2>
      {chartData.length > 0 ? (
        <ul>
          {chartData.map((data) => (
            <li key={data.account_id}>
              Account ID: {data.account_id}, Total Amount: {data.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chart data available.</p>
      )}
    </div>
  );
}

export default App;
