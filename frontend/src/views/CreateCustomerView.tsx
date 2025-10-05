import React, { useState } from "react";
import { createCustomer } from "../api";
import { type CustomerDTO } from "../types/interfaces";

// Tipo para el formulario inicial (sin el 'id' generado por el backend)
type NewCustomerForm = Omit<CustomerDTO, "id" | "accountNumber"> & {
  accountNumber: string;
};

const initialForm: NewCustomerForm = {
  firstName: "",
  lastName: "",
  accountNumber: "",
  balance: 0,
};

const CreateCustomerView: React.FC = () => {
  const [formData, setFormData] = useState<NewCustomerForm>(initialForm);
  const [message, setMessage] = useState<{
    text: string | null;
    type: "success" | "error" | null;
  }>({ text: null, type: null });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convertir 'balance' a número
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    }));
    setMessage({ text: null, type: null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Usamos el mismo objeto formData para la petición
      const createdCustomer = await createCustomer(formData);

      setMessage({
        text: `Cliente ${createdCustomer.firstName} creado con éxito. Cuenta N°: ${createdCustomer.accountNumber}`,
        type: "success",
      });
      setFormData(initialForm); // Limpiar formulario
    } catch (err: any) {
      let errorMessage = "Error al crear el cliente. Verifica los datos.";

      // Manejo básico de errores si el backend devuelve un mensaje
      if (err.response && err.response.data) {
        errorMessage = `Error: ${err.response.data}`;
      } else {
        console.error("Error al crear cliente:", err);
      }

      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Cliente</h2>

      {/* ✨ Aplicamos la clase de tarjeta 'card-base' y limitamos el ancho del contenedor ✨ */}
      <div className="card-base" style={{ maxWidth: "500px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px", // El espaciado se mantiene para una buena legibilidad
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

          {/* Campos del Formulario */}
          <label>
            Nombre:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
              // El input ya toma el estilo global de App.css (curvas y padding)
            />
          </label>

          <label>
            Apellido:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label>
            N° de Cuenta:
            <input
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </label>

          <label>
            Saldo Inicial:
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              disabled={loading}
            />
          </label>

          {/* Botón de Submit (Ahora usa los estilos globales de App.css) */}
          <button
            type="submit"
            disabled={loading}
            // El botón ahora usa los estilos globales de App.css (púrpura con curvas y sombra)
          >
            {loading ? "Creando..." : "Crear Cliente"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCustomerView;
