// Header.tsx
import './Header.css';

interface HeaderProps {
  onLogout: () => void;
  onTabChange: (tab: 'stock' | 'items' | 'history') => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onTabChange }) => {
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
              <button onClick={() => onTabChange('stock')}>Estoque</button>
            </li>
            <li>
              <button onClick={() => onTabChange('items')}>Itens</button>
            </li>
            <li>
              <button onClick={() => onTabChange('history')}>Histórico</button>
            </li>
            <li>
              <button onClick={onLogout}>Sair</button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="header-space"></div>
    </>
  );
};

export default Header;
