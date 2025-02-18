// MainPage.tsx
import React, { useState } from 'react';
import './MainPage.css';
import Header from './Header/Header';
import Stock from './Stock/Stock';
import Options from './Options/Options'; 
import History from './History/History'; 

interface MainPageProps {
  onLogout: () => void;
  checkServerStatus: () => Promise<void>;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout, checkServerStatus }) => {
    const [activeTab, setActiveTab] = useState<'stock' | 'options' | 'history'>('stock');


  // Callback to change the active tab
  const handleTabChange = (tab: 'stock' | 'options' | 'history') => {
    setActiveTab(tab);
  };

  return (
    <div className="main-container">
      <div className="content">
        {/* Pass the tab change callback to Header */}
        <Header checkServerStatus={checkServerStatus} onLogout={onLogout} onTabChange={handleTabChange} />

        {/* Conditionally render components based on activeTab */}
        {activeTab === 'stock' && <Stock checkServerStatus={checkServerStatus} />}
        {activeTab === 'options' && <Options checkServerStatus={checkServerStatus} onLogout={onLogout} />}
        {activeTab === 'history' && <History checkServerStatus={checkServerStatus} />}
      </div>
    </div>
  );
};

export default MainPage;

