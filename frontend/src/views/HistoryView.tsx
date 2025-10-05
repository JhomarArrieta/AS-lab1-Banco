import React, { useState } from "react";
import { getAccountHistory } from "../api";
import { type TransactionDTO } from "../types/interfaces";

const HistoryView: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Guardamos la cuenta que se consultó para usarla en la lógica de colores
  const [consultedAccount, setConsultedAccount] = useState<string>("");

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) return;

    setLoading(true);
    setTransactions([]);
    setError(null);
    setConsultedAccount(accountNumber);

    try {
      const data = await getAccountHistory(accountNumber);
      setTransactions(data);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError(
        "No se pudo cargar el historial. Verifica el número de cuenta y la conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMovementType = (
    tx: TransactionDTO
  ): { type: string; color: string } => {
    if (tx.receiverAccountNumber === consultedAccount) {
      return { type: "INGRESO", color: "green" };
    }
    if (tx.senderAccountNumber === consultedAccount) {
      return { type: "EGRESO", color: "red" };
    }
    // Caso de seguridad
    return { type: "DESCONOCIDO", color: "gray" };
  };

  return (
    <div>
      <h2>Histórico de Transacciones</h2>

      <form
        onSubmit={handleConsult}
        className="card-base"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          maxWidth: "550px", 
          padding: "20px", 
        }}
      >
        <input
          type="text"
          placeholder="Ingrese Número de Cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          disabled={loading}
          style={{ flexGrow: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !accountNumber}
          style={{ padding: "12px 20px", minWidth: "120px" }}
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
      )}

      {transactions.length > 0 ? (
        <div className="card-base card-table-container">
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Remitente</th>
                <th>Receptor</th>
                <th>Tipo</th>
                <th style={{ textAlign: "right" }}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const { type, color } = getMovementType(tx);

                return (
                  <tr key={tx.id}>
                    <td>
                      {tx.transactionDate
                        ? new Date(tx.transactionDate).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{tx.senderAccountNumber}</td>
                    <td>{tx.receiverAccountNumber}</td>
                    <td style={{ color }}>{type}</td>
                    <td
                      style={{ textAlign: "right", fontWeight: "bold", color }}
                    >
                      {type === "EGRESO" ? "-" : "+"} ${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        consultedAccount &&
        !loading && (
          <div className="card-base" style={{ padding: "20px" }}>
            <p>
              No se encontraron transacciones para la cuenta **
              {consultedAccount}**.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default HistoryView;
