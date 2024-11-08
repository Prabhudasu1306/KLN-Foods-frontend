

// import React, { useState, useEffect } from 'react';
// import { usePaymentContext } from './PaymentContext'; 
// import './Admin.css';

// const Admin = () => {
//   const { setTransactionId, setStatus } = usePaymentContext(); 
//   const [payments, setPayments] = useState([]);
//   const [transactionId, setTransactionIdLocal] = useState('');
//   const [status, setStatusLocal] = useState('');

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/payments/all');
//         if (!response.ok) throw new Error('Failed to fetch payments');
//         const data = await response.json();
//         setPayments(data);
//       } catch (error) {
//         console.error(error);
//         alert('Error fetching payments: ' + error.message);
//       }
//     };
//     fetchPayments();
//   }, []);

//   const updatePaymentStatus = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`http://localhost:8080/payments/transaction/${transactionId}/status`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status }),
//       });
//       if (!response.ok) throw new Error('Failed to update payment status');

      
//       setTransactionId(transactionId); 
//       setStatus(status);
//     } catch (error) {
//       console.error(error);
//       alert('Error updating payment status: ' + error.message);
//     }
//   };

//   return (
//     <div className="admin-management-container">
//       <h2 className="admin-title">Admin Payment Management</h2>
//       <h3 className="admin-subtitle">All Payments</h3>
//       <table className="admin-payments-table">
//         <thead>
//           <tr>
//             <th>Transaction ID</th>
//             <th>Total Amount</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {payments.length > 0 ? (
//             payments.map((payment) => (
//               <tr key={payment.transactionId}>
//                 <td>{payment.transactionId}</td>
//                 <td>{payment.totalAmount}</td>
//                 <td>{payment.status}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="3">No payments found.</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <h3 className="admin-subtitle">Update Payment Status</h3>
//       <form className="admin-status-update-form" onSubmit={updatePaymentStatus}>
//         <input
//           type="text"
//           placeholder="Transaction ID"
//           value={transactionId}
//           onChange={(e) => setTransactionIdLocal(e.target.value)}
//           required
//           className="admin-input"
//         />
//         <select value={status} onChange={(e) => setStatusLocal(e.target.value)} required className="admin-select">
//           <option value="">Select Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Success">Success</option>
//           <option value="Failed">Failed</option>
//         </select>
//         <button type="submit" className="admin-submit-button">Update Status</button>
//       </form>
//     </div>
//   );
// };

// export default Admin;


import React, { useState, useEffect } from 'react';
import { usePaymentContext } from './PaymentContext'; 
import './Admin.css';

const Admin = () => {
  const { setTransactionId, setStatus } = usePaymentContext(); 
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch('http://localhost:8080/payments/all');
        if (!response.ok) throw new Error('Failed to fetch payments');
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error(error);
        alert('Error fetching payments: ' + error.message);
      }
    };
    fetchPayments();
  }, []);

  const updatePaymentStatus = async (transactionId, status) => {
    try {
      const response = await fetch(`http://localhost:8080/payments/transaction/${transactionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update payment status');

      setTransactionId(transactionId); 
      setStatus(status);

      // Update the payment status locally
      setPayments(prevPayments => 
        prevPayments.map(payment => 
          payment.transactionId === transactionId ? { ...payment, status } : payment
        )
      );
    } catch (error) {
      console.error(error);
      alert('Error updating payment status: ' + error.message);
    }
  };

  return (
    <div className="admin-management-container">
      <h2 className="admin-title">Admin Payment Management</h2>
      <h3 className="admin-subtitle">All Payments</h3>
      <table className="admin-payments-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.transactionId}>
                <td>{payment.transactionId}</td>
                <td>{payment.totalAmount}</td>
                <td>{payment.status === 'Success' ? 'Paid' : payment.status === 'Failed' ? 'Not Paid' : payment.status}</td>
                <td>
                  {payment.status === 'Success' || payment.status === 'Failed' ? (
                    <span className="admin-done">Done</span>
                  ) : (
                    <>
                      <button
                        className="admin-allow-button"
                        onClick={() => updatePaymentStatus(payment.transactionId, 'Success')}
                      >
                        Allow
                      </button>
                      <button
                        className="admin-decline-button"
                        onClick={() => updatePaymentStatus(payment.transactionId, 'Failed')}
                      >
                        Decline
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No payments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
