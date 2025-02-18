// History.tsx
import React from 'react';
import './History.css';

interface HistoryProps {
  checkServerStatus: () => Promise<void>;
}

const History: React.FC<HistoryProps> = () => {
  return (
    <div className="History-container">
      <h2>History</h2>
      <button></button>
    </div>
  );
};

export default History;
