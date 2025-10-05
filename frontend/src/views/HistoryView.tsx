import React, { useState } from "react";
import { getAccountHistory } from "../api";
import { type TransactionDTO } from "../interfaces";

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

      {/* 1. Formulario de Búsqueda: Usando el estilo moderno de inputs y botones */}
      <form
        onSubmit={handleConsult}
        className="card-base"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          maxWidth: "550px", // Aumentamos el ancho para que se vea mejor
          padding: "20px", // Redefinimos el padding ya que 'card-base' lo tiene
        }}
      >
        <input
          type="text"
          placeholder="Ingrese Número de Cuenta"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
          disabled={loading}
          // El input ya toma el estilo global de App.css
          style={{ flexGrow: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !accountNumber}
          // El botón ahora usa los estilos globales de App.css (púrpura con curvas)
          style={{ padding: "12px 20px", minWidth: "120px" }}
        >
          {loading ? "Consultando..." : "Consultar"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
      )}

      {/* 2. Resultados: La tabla envuelta en una tarjeta con estilos limpios */}
      {transactions.length > 0 ? (
        <div className="card-base card-table-container">
          <table style={{ width: "100%" }}>
            <thead>
              {/* Quitamos los estilos en línea, ahora vienen de App.css */}
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
        // Mensaje de no resultados, envuelto en una pequeña tarjeta si se consultó
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
