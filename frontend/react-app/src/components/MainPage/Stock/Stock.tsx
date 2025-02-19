import React, { useCallback, useEffect, useState } from "react";
import './Stock.css';
import StockTable from "./StockTable/StockTable";
import Loading from "../../Loading/Loading";

type AddAndSellProps = {
  checkServerStatus: () => Promise<void>;
  API_FLASK_SERVER_URL: string;
};

interface Item {
  id: number;
  code: string;
  name: string;
  quantity: number;
  cost_value: number;
  sell_value: number;
  last_update: string;
}


const AddAndSell: React.FC<AddAndSellProps> = ({ checkServerStatus, API_FLASK_SERVER_URL }) => {

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch items from the API
  const fetchItems = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      await checkServerStatus();
      const response = await fetch(`${API_FLASK_SERVER_URL}/items`);
      const data = await response.json();
  
      if (response.ok) {
        setItems(data);
      } else {
        alert("Erro ao buscar itens: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      alert("Erro ao buscar itens. Veja o console para detalhes.");
    } finally {
      setLoading(false);
    }
  }, [checkServerStatus, API_FLASK_SERVER_URL]);

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Function to handle selling an item ("Adicionar Venda")
  const onSellStock = async (): Promise<void> => {

    let code = prompt("Digite o código do item para vender:");
    if (!code) {
      alert("Quantidade é obrigatório.");
      return;
    }
    code = code.trim()

    let quantityStr = prompt("Digite a quantidade a ser vendida:");
    if (!quantityStr) {
      alert("Código é obrigatório.");
      return;
    }
    quantityStr = quantityStr.trim()

    const quantity = parseInt(quantityStr, 10);
    try {
      const response = await fetch(`${API_FLASK_SERVER_URL}/items/add_and_sell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sell", code, quantity }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Venda realizada com sucesso! Nova quantidade: " + data.new_quantity);
        fetchItems();
      } else {
        alert("Erro ao realizar venda: " + data.message);
      }
    } catch (error) {
      console.error("Erro na venda:", error);
      alert("Erro ao realizar venda. Verifique o console para detalhes.");
    }
  };

  // Function to handle adding stock ("Adicionar Estoque")
  const onAddStock = async (): Promise<void> => {

    let code = prompt("Digite o código do item para adicionar estoque:");
    if (!code) {
      alert("Código é obrigatório.");
      return;
    }
    code = code.trim()
    console.log(code)

    let quantityStr = prompt("Digite a quantidade a ser adicionada:");
    if (!quantityStr) {
      alert("Quantidade é obrigatório.");
      return;
    }
    quantityStr = quantityStr.trim()

    const quantity = parseInt(quantityStr, 10);
    try {
      const response = await fetch(`${API_FLASK_SERVER_URL}/items/add_and_sell`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_stock", code, quantity }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Estoque adicionado com sucesso! Nova quantidade: " + data.new_quantity);
        fetchItems();
      } else {
        alert("Erro ao adicionar estoque: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar estoque:", error);
      alert("Erro ao adicionar estoque. Verifique o console para detalhes.");
    }
  };

  return (
    <section className="stock">
      <div className="add-and-sell">
        <button
          className="sell-stock-btn"
          onClick={async () => {
            await checkServerStatus();
            await onSellStock();
          }}
        >
          Adicionar Venda
        </button>
        <button
          className="add-stock-btn"
          onClick={async () => {
            await checkServerStatus();
            await onAddStock();
          }}
        >
          Adicionar Estoque
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="stock-content">
        { loading ? <Loading title={false} /> : <StockTable items={items} />  }
      </div>
    </section>
  );
};

export default AddAndSell;
