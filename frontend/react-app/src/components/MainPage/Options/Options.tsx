import React from "react";
import "./Options.css";

interface OptionsProps {
  checkServerStatus: () => Promise<void>;
  onLogout: () => void;
  API_FLASK_SERVER_URL: string;
}

const Options: React.FC<OptionsProps> = ({ onLogout, checkServerStatus, API_FLASK_SERVER_URL }) => {

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
      const response = await fetch(`${API_FLASK_SERVER_URL}/items/add_item`, {
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
    // Ask the user for the code of the item they want to edit.
    const code = prompt("Enter the item code to edit:");
    if (!code) {
      alert("Item code is required.");
      return;
    }
  
    // Prompt for the new values. (You could pre-fill these by fetching the current item info first.)
    const name = prompt("Enter the new name for the item:");
    const quantityStr = prompt("Enter the new quantity:");
    const costValueStr = prompt("Enter the new cost value:");
    const sellValueStr = prompt("Enter the new sell value:");
  
    if (!name || !quantityStr || !costValueStr || !sellValueStr) {
      alert("All fields are required.");
      return;
    }
  
    // Convert numeric values from strings.
    const quantity = parseInt(quantityStr, 10);
    const cost_value = parseFloat(costValueStr);
    const sell_value = parseFloat(sellValueStr);
  
    try {
      // Send a PUT request to update the item.
      const response = await fetch(`${API_FLASK_SERVER_URL}/items/update_item`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, name, quantity, cost_value, sell_value }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Item updated successfully!");
      } else {
        alert("Error updating item: " + data.message);
      }
    } catch (error) {
      console.error("Error in onEditItem:", error);
      alert("Error updating item. Please check the console for details.");
    }
  };

  // Function to delete an item by its code
  const onDeleteItem = async (): Promise<void> => {
    const code = prompt("Digite o código do item a ser deletado:");
    if (!code) {
      alert("Código do item é obrigatório.");
      return;
    }
    try {
      const response = await fetch(`${API_FLASK_SERVER_URL}/items/delete_item/${code}`, {
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

  // Function to change the password 
  const onChangePassword = async (): Promise<void> => {
    // Prompt the user for the current password
    const currentPassword = prompt("Digite sua senha atual:") || "";
    
    if (!currentPassword) {
      alert("Senha é obrigatória.");
      return;
    }
  
    try {
      // Verify the current password by sending it to the login endpoint
      const loginResponse = await fetch(`${API_FLASK_SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Note: Make sure the property name matches what your server expects (e.g., "password")
        body: JSON.stringify({ password: currentPassword }),
      });
  
      if (loginResponse.ok) {
        // If the login (password check) was successful, prompt for the new password
        const newPassword = prompt("Digite sua nova senha:") || "";
        const confirmPassword = prompt("Confirme sua nova senha:") || "";
  
        if (!newPassword || !confirmPassword) {
          alert("Todos os campos são obrigatórios.");
          return;
        }
  
        if (newPassword !== confirmPassword) {
          alert("As senhas não coincidem.");
          return;
        }
  
        try {
          // Request to change the password
          const changeResponse = await fetch(`${API_FLASK_SERVER_URL}/login/change_password`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ new_password: newPassword }),
          });
          const data = await changeResponse.json();
  
          if (changeResponse.ok) {
            alert("Senha alterada com sucesso!");
          } else {
            alert("Erro ao alterar senha: " + data.message);
          }
        } catch (error) {
          console.error("Erro ao alterar senha:", error);
          alert("Erro ao alterar senha. Verifique o console para mais detalhes.");
        }
      } else {
        alert("Senha atual incorreta.");
      }
    } catch (error) {
      console.error("Erro ao verificar senha atual:", error);
      alert("Erro ao verificar senha atual. Verifique o console para mais detalhes.");
    }
  }
  

  // Function to clear the history via API call
  const onClearHistory = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_FLASK_SERVER_URL}/history/clear`, {
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
