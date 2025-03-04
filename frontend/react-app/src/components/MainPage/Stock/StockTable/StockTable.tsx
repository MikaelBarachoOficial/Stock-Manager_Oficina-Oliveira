import React from "react";
import "./StockTable.css"; // Create this file for custom styles if needed

// Define an interface for a stock item
export interface Item {
    id: number;
    code: string;
    name: string;
    quantity: number;
    cost_value: number;
    sell_value: number;
    last_update: string;
}

// Define the props for the StockTable component
interface StockTableProps {
    items: Item[];
}

const StockTable: React.FC<StockTableProps> = ({ items }) => {

    const sortedItems = [...items].sort((a, b) => {
        return new Date(b.last_update).getTime() - new Date(a.last_update).getTime();
    });


    return (
        <>

            {sortedItems.length > 0 ? <div className="stock-hidden">
                <p>Vire o celular para visualizar a planilha.</p>
            </div> : null}

            {sortedItems.length > 0 ? <table className="stock-table">
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
                    {sortedItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <input readOnly value={item.code} type="text" />
                            </td>
                            <td>
                                <input readOnly value={item.name} type="text" />
                            </td>
                            <td>
                                <input readOnly value={item.quantity} type="text" />
                            </td>
                            <td>
                                <input
                                    readOnly
                                    value={`R$ ${item.cost_value.toFixed(2).replace(".", ",")}`}
                                    type="text"
                                />
                            </td>
                            <td>
                                <input
                                    readOnly
                                    value={`R$ ${item.sell_value.toFixed(2).replace(".", ",")}`}
                                    type="text"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> : <p className="no-items-p">Nenhum item adicionado.</p>}
        </>
    );
};

export default StockTable;
