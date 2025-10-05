import React, { useState } from "react";
import { performTransfer } from "../api";
import { type TransferRequest } from "../types/interfaces";

const initialForm: TransferRequest = {
  senderAccountNumber: "",
  receiverAccountNumber: "",
  amount: 0,
};

const TransferView: React.FC = () => {
  const [formData, setFormData] = useState<TransferRequest>(initialForm);
  const [message, setMessage] = useState<{
    text: string | null;
    type: "success" | "error" | null;
  }>({ text: null, type: null });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
    setMessage({ text: null, type: null }); // Limpiar mensaje al cambiar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones básicas de frontend
      if (
        formData.amount <= 0 ||
        formData.senderAccountNumber === formData.receiverAccountNumber
      ) {
        setMessage({
          text: "Verifica el monto y las cuentas (no pueden ser iguales).",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const transaction = await performTransfer(formData);

      setMessage({
        text: `Transferencia exitosa. ID: ${
          transaction.id
        } por $${transaction.amount.toFixed(2)}.`,
        type: "success",
      });
      setFormData(initialForm); // Limpiar formulario
    } catch (err: any) {
      let errorMessage = "Error desconocido al realizar la transferencia.";

      // ✨ Manejo de errores 400 del backend (IllegalArgumentException)
      if (err.response && err.response.status === 400 && err.response.data) {
        errorMessage = `Error: ${err.response.data}`;
      } else {
        console.error("Error al enviar la transferencia:", err);
      }

      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Realizar Transferencia</h2>
      <div className="card-base" style={{ maxWidth: "500px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px", // Usamos el gap ya definido en el CSS global
          }}
        >
          {/* Mensaje de Éxito/Error (Mantiene el estilo de color en línea) */}
          {message.text && (
            <div
              style={{
                padding: "10px",
                borderRadius: "8px", // Curvas más grandes para el mensaje
                color: "white",
                fontWeight: "bold",
                backgroundColor:
                  message.type === "success" ? "#28a745" : "#dc3545",
              }}
            >
              {message.text}
            </div>
          )}

          {/* Campo N° Cuenta Origen */}
          <label>
            N° Cuenta Origen:
            <input
              type="text"
              name="senderAccountNumber"
              value={formData.senderAccountNumber}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          {/* Campo N° Cuenta Destino */}
          <label>
            N° Cuenta Destino:
            <input
              type="text"
              name="receiverAccountNumber"
              value={formData.receiverAccountNumber}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          {/* Campo Monto */}
          <label>
            Monto:
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
              disabled={loading}
            />
          </label>

          {/* Botón de Confirmar Transferencia */}
          <button
            type="submit"
            disabled={
              loading ||
              formData.amount <= 0 ||
              !formData.senderAccountNumber ||
              !formData.receiverAccountNumber
            }
          >
            {loading ? "Procesando..." : "Confirmar Transferencia"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferView;
