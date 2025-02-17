// Header.tsx
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
  onTabChange: (tab: 'stock' | 'options' | 'history') => void;
  checkServerStatus: () => Promise<void>;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onTabChange, checkServerStatus }) => {
  return (
    <>
      <header className="header">
        <div>
          <img src="/Logo.png" alt="Logo" />
          <h1>Oficina Oliveira</h1>
        </div>
        <nav>
          <ul>
            <li>
              <button onClick={async () => { await checkServerStatus(); onTabChange('stock')}}>Estoque</button>
            </li>
            <li>
              <button onClick={async () => { await checkServerStatus(); onTabChange('options')}}>Opções</button>
            </li>
            <li>
              <button onClick={async () => { await checkServerStatus(); onTabChange('history')}}>Histórico</button>
            </li>
            <li>
              <button onClick={async () => { await checkServerStatus(); onLogout()}}>Sair</button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="header-space"></div>
    </>
  );
};

export default Header;
