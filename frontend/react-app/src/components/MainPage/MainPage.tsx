// MainPage.tsx
import React, { useState } from 'react';
import './MainPage.css';
import Header from './Header/Header';
import Stock from './Stock/Stock';
import Items from './Items/Items'; 
import History from './History/History'; 

interface MainPageProps {
  onLogout: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<'stock' | 'items' | 'history'>('stock');


  // Callback to change the active tab
  const handleTabChange = (tab: 'stock' | 'items' | 'history') => {
    setActiveTab(tab);
  };

  return (
    <div className="main-container">
      <div className="content">
        {/* Pass the tab change callback to Header */}
        <Header onLogout={onLogout} onTabChange={handleTabChange} />

        {/* Conditionally render components based on activeTab */}
        {activeTab === 'stock' && <Stock onLogout={onLogout} />}
        {activeTab === 'items' && <Items onLogout={onLogout} />}
        {activeTab === 'history' && <History onLogout={onLogout} />}
      </div>
    </div>
  );
};

export default MainPage;

