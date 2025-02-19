// History.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './History.css';

interface HistoryProps {
  checkServerStatus: () => Promise<void>;
  API_FLASK_SERVER_URL: string;
}

interface HistoryItem {
  id: number;
  item_id: number;
  item_code: string;
  quantity: number;
  cost_value: number;
  sell_value: number;
  action_type: string;
  timestamp: string; // e.g., "2025-02-18 12:38:49"
}

const History: React.FC<HistoryProps> = ({ checkServerStatus, API_FLASK_SERVER_URL }) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Optionally check the server status before fetching
      await checkServerStatus();

      const response = await fetch(`${API_FLASK_SERVER_URL}/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data: HistoryItem[] = await response.json();

      // Sort the records from most recent to oldest based on timestamp
      const sortedHistory = data.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      setHistoryItems(sortedHistory);
    } catch (error: unknown) {
      console.error('Error fetching history:', error);
      let errorMessage = 'An error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [checkServerStatus, API_FLASK_SERVER_URL]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="History-container">
      <h2>History</h2>
      {loading ? (
        <p>Loading history...</p>
      ) : error ? (
        <p className="error">Error: {error}</p>
      ) : historyItems.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <table className="History-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Code</th>
              <th>Quantity</th>
              <th>Cost Value</th>
              <th>Sell Value</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {historyItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.item_code}</td>
                <td>{item.quantity}</td>
                <td>{item.cost_value}</td>
                <td>{item.sell_value}</td>
                <td>{item.action_type}</td>
                <td>{item.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={fetchHistory}>Refresh History</button>
    </div>
  );
};

export default History;
