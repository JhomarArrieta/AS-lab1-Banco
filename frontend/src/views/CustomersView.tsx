import React, { useState, useEffect } from "react";
import { getAllCustomers } from "../api";
import { type CustomerDTO } from "../interfaces";

const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomers();
        setCustomers(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError(
          "Error al cargar la lista de clientes. Asegúrate de que el backend está corriendo."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (customers.length === 0) return <p>No hay clientes registrados.</p>;

  return (
    <div>
      <h2>Consultar Clientes y Saldos</h2>

      {/* ✨ Aquí aplicamos la clase de tarjeta para la estética de cuadrito ✨ */}
      <div className="card-base card-table-container">
        {/* Si no hay clientes, muestra un mensaje bonito en la tarjeta */}
        {customers.length === 0 ? (
          <p>No hay clientes registrados.</p>
        ) : (
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>N° Cuenta</th>
                <th style={{ textAlign: "right" }}>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.firstName}</td>
                  <td>{customer.lastName}</td>
                  <td>{customer.accountNumber}</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      color: "#28a745",
                    }}
                  >
                    ${customer.balance.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomersView;
