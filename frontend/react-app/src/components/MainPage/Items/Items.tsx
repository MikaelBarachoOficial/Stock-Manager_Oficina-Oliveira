// Items.tsx
import React from 'react';
import './Items.css';

interface ItemsProps {
  onLogout: () => void;
}

const Items: React.FC<ItemsProps> = ({ onLogout }) => {
  return (
    <div className="items-container">
      <h2>Itens</h2>
      <button onClick={onLogout}></button>
    </div>
  );
};

export default Items;
