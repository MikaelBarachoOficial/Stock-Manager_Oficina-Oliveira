import React from "react";
import './Stock.css';

type AddAndSellProps = {
  onLogout: () => void;
};

const AddAndSell: React.FC<AddAndSellProps> = ({ onLogout }) => {
  return (
    <section className="stock">
      <div className="add-and-sell">
        <button className="sell-stock-btn" onClick={onLogout}>Adicionar Venda</button>
        <button className="add-stock-btn" onClick={onLogout}>Adicionar Estoque</button>
      </div>
      
      <div className="stock-hidden">
        <p>Vire o celular para visualizar a planilha.</p>
      </div>

      {/* Dashboard Content */}
      <div className="stock-content">
        <table>
          <thead className="stock-table-header">
            <tr>
                <th>Código</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço de custo</th>
              <th>Preço de venda</th>
            </tr>
          </thead>
          <tbody className="stock-table-body">
            <tr>
              <td><input readOnly value='sd5a5da' type="text" /></td>
              <td><input readOnly value='Teclado xbde234' type="text" /></td>
              <td><input readOnly value='50' type="text" /></td>
              <td><input readOnly value='R$ 70,00' type="text" /></td>
              <td><input readOnly value='R$ 120,00' type="text" /></td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AddAndSell;