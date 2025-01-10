import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [result, setResult] = useState(null);
  const [csvResult, setCsvResult] = useState(null);

  // Handle check single transaction
  const handleCheckTransaction = async () => {
    try {
      const transactionData = {
        transaction_id: transactionId,
        amount: parseFloat(amount),
        account_id: accountId,
        transaction_type: transactionType,
      };

      const response = await axios.post("http://127.0.0.1:5000/check_transaction", transactionData, {
        headers: { "Content-Type": "application/json" },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while checking the transaction.");
    }
  };

  // Handle CSV file upload
  const handleUploadCsv = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) {
      alert("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCsvResult(response.data);
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert("An error occurred while uploading the CSV file.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Transaction Checker</h1>

      <div className="card p-3 mb-4">
        <h3>Single Transaction</h3>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Account ID"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Transaction Type"
          value={transactionType}
          onChange={(e) => setTransactionType(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCheckTransaction}>
          Check Transaction
        </button>
      </div>

      {result && (
        <div className="alert mt-3" style={{ color: result.flagged ? "red" : "green" }}>
          <strong>{result.message}</strong>
          <p>Transaction ID: {result.transaction_id}</p>
          <p>Amount: {result.amount}</p>
          <p>Account ID: {result.account_id}</p>
        </div>
      )}

      <div className="card p-3 mb-4">
        <h3>Upload CSV</h3>
        <input type="file" className="form-control" onChange={handleUploadCsv} />
      </div>

      {csvResult && (
        <div className="mt-3">
          <h3>CSV Results</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Amount</th>
                <th>Account ID</th>
                <th>Transaction Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {csvResult.map((item, index) => (
                <tr key={index} style={{ color: item.flagged ? "red" : "green" }}>
                  <td>{item.transaction_id}</td>
                  <td>{item.amount}</td>
                  <td>{item.account_id}</td>
                  <td>{item.transaction_type}</td>
                  <td>{item.flagged ? "Flagged" : "Safe"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
