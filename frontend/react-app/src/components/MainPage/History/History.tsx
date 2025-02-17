// History.tsx
import React from 'react';
import './History.css';

interface HistoryProps {
  onLogout: () => void;
  checkServerStatus: () => Promise<void>;
}

const History: React.FC<HistoryProps> = ({ onLogout }) => {
  return (
    <div className="History-container">
      <h2>History</h2>
      <button onClick={onLogout}></button>
    </div>
  );
};

export default History;
