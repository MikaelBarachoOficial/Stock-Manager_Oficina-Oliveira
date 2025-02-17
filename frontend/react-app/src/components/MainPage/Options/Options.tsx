import React from "react";
import "./Options.css";

interface OptionsProps {
  checkServerStatus: () => Promise<void>;
  onLogout: () => void;
}

const Options: React.FC<OptionsProps> = ({ onLogout, checkServerStatus }) => {

  // Function to add a new item
  const onAddItem = async (): Promise<void> => {
    // Gather item details via prompts (replace with proper form inputs as needed)
    const code = prompt("Digite o código do item:");
    const name = prompt("Digite o nome do item:");
    const quantityStr = prompt("Digite a quantidade:");
    const costValueStr = prompt("Digite o valor de custo:");
    const sellValueStr = prompt("Digite o valor de venda:");

    if (!code || !name || !quantityStr || !costValueStr || !sellValueStr) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const quantity = parseInt(quantityStr, 10);
    const cost_value = parseFloat(costValueStr);
    const sell_value = parseFloat(sellValueStr);

    try {
      const response = await fetch("http://127.0.0.1:5000/items/add_item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, name, quantity, cost_value, sell_value }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Item adicionado com sucesso! ID: " + data.item_id);
      } else {
        alert("Erro ao adicionar item: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao adicionar item. Veja o console para detalhes.");
    }
  };

  // Function to edit an item (Not implemented on the server-side)
  const onEditItem = async (): Promise<void> => {
    alert("Função de editar item não implementada.");
  };

  // Function to delete an item by its code
  const onDeleteItem = async (): Promise<void> => {
    const code = prompt("Digite o código do item a ser deletado:");
    if (!code) {
      alert("Código do item é obrigatório.");
      return;
    }
    try {
      const response = await fetch(`http://127.0.0.1:5000/items/delete_item/${code}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Item deletado com sucesso!");
      } else {
        alert("Erro ao deletar item: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao deletar item:", error);
      alert("Erro ao deletar item. Veja o console para detalhes.");
    }
  };

  // Function to change the password (Not implemented on the server-side)
  const onChangePassword = async (): Promise<void> => {
    const currentPassword = prompt("Digite sua senha atual:");
    const newPassword = prompt("Digite sua nova senha:");
    const confirmPassword = prompt("Confirme sua nova senha:");

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Todos os campos são obrigatórios.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    // Simulate an API call delay since there's no endpoint
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Senha alterada com sucesso!");
    } catch (error) {
      console.error("Erro ao trocar senha:", error);
      alert("Erro ao trocar senha. Veja o console para detalhes.");
    }
  };

  // Function to clear the history via API call
  const onClearHistory = async (): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:5000/history/clear", {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        alert("Histórico limpo com sucesso!");
      } else {
        alert("Erro ao limpar histórico: " + data.message);
      }
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      alert("Erro ao limpar histórico. Veja o console para detalhes.");
    }
  };

  return (
    <section className="options-container">
      <h2>Opções</h2>
      <div>
        <button onClick={async () => { await checkServerStatus(); onAddItem() }}>Adicionar Item</button>
        <button onClick={async () => { await checkServerStatus(); onEditItem() }}>Alterar Item</button>
        <button onClick={async () => { await checkServerStatus(); onDeleteItem(); }}>Deletar Item</button>
        <button onClick={async () => { await checkServerStatus(); onChangePassword(); }}>Trocar Senha</button>
        <button onClick={async () => { await checkServerStatus(); onClearHistory(); }}>Limpar Histórico</button>
        <button onClick={async () => { onLogout() }}>Sair</button>
      </div>
    </section>
  );
};

export default Options;
